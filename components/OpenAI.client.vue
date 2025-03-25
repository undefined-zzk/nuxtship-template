<script setup lang="ts">
import OpenAI from "openai";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import type { MessageListItem, Role } from '~/types'
const aiRef = ref<HTMLElement>()
const { style } = useDraggable(aiRef, {
    initialValue: {
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
    },
})
const loading = ref(false);
const userScroll = ref(false)
const textarea = ref('');
const tempTextarea = ref('')
const showPopover = ref(false);
const messageList = ref<MessageListItem[]>([]);
const role = ref<Role>('user');
const contentRef = ref<HTMLElement>();
const textareaRef = ref<HTMLElement>()
// const isProgrammaticScroll = ref(false)
const doneLoading = ref(false)
const showAiModal = ref(false)
const tempRefresh = ref(0)
const balLoading = ref(false)
const clearLoading = ref(false)
const isMove = ref(false)
const hasBalance = ref(true)
let moveTimer: NodeJS.Timeout
let timer: NodeJS.Timeout
let controller: any = null;
const APIKEY = 'sk-7ba4755beeb04125ad58644b88e21aad'
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: APIKEY,
    dangerouslyAllowBrowser: true,
});

const startLoading = computed(() => {
    return messageList.value.some(item => item.startLoading)
})
// 监听AI对话框开启状态
watch(showAiModal, async () => {
    if (showAiModal.value) {
        clearCacheByIndex()
        await nextTick()
        try {
            document.body.style.overflow = 'hidden'
            balLoading.value = true
            const balance = await $fetch<{ is_available: boolean }>('https://api.deepseek.com/user/balance', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${APIKEY}`
                }
            })
            hasBalance.value = balance.is_available
            if (!hasBalance.value) {
                errTipMsg()
            }
        } catch (e) {
        } finally {
            textareaRef.value?.focus()
            contentRefScroll()
            balLoading.value = false
        }
    } else {
        document.body.style.overflow = 'auto'
    }
})

watch(style, () => {
    isMove.value = true
})



const mouseUp = () => {
    moveTimer && clearTimeout(moveTimer)
    moveTimer = setTimeout(() => {
        isMove.value = false
        clearTimeout(moveTimer)
    }, 500)
}

const stopWatch = watch(textarea, () => {
    if (textarea.value) {
        showPopover.value = false;
    }
});

const copy = async (item: MessageListItem, field: 'content' | 'answer') => {
    if (item.copySuccess) return
    await copyToClipboard(item[field]);
    item.copySuccess = true
    setTimeout(() => {
        item.copySuccess = false
    }, 1000)
}
// 重新生成
const refresh = (item: MessageListItem) => {
    tempRefresh.value = ++item.refresh
    messageList.value = messageList.value.filter(i => i.id !== item.id)
    textarea.value = ''
    tempTextarea.value = item.content
    sendMsgToDeepSeek()
}

const clearIntervalFn = () => {
    timer && clearInterval(timer)
}

const scrollBto = () => {
    timer && clearInterval(timer)
    timer = setInterval(() => {
        // console.log('userScroll', userScroll.value);
        if (userScroll.value) {
            clearIntervalFn()
            return
        }
        contentRefScroll()
    }, 100)
    contentRef.value!.addEventListener('scroll', () => {
        // console.log('isProgrammaticScroll', isProgrammaticScroll.value);
        // if (isProgrammaticScroll.value) {
        //     isProgrammaticScroll.value = false
        //     return
        // }
        // userScroll.value = true
        // clearIntervalFn()
    })
};



const cancelMain = () => {
    if (controller) {
        controller.abort();
        controller = null;
        loading.value = false;
        messageList.value = messageList.value.map(item => ({ ...item, startLoading: false }))
        setStorage(messageList.value)
    }
};

const showModal = () => {
    if (isMove.value) return
    showAiModal.value = true
}

// 清除缓存
const clearCache = () => {
    ElMessageBox.confirm(
        '确定清除缓存吗?将失去所有的对话内容',
        '缓存清理',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            balLoading.value = true
            setTimeout(() => {
                balLoading.value = false
                removeStorage(0, true)
                messageList.value = []
                ElMessage.success('清除成功')
            }, Math.random() * 1500)
        })
        .catch(() => {

        })
}

function contentRefScroll() {
    if (contentRef.value) {
        contentRef.value.scrollTo({
            top: contentRef.value.scrollHeight,
            behavior: 'smooth' // 启用平滑滚动
        });
    }
}
function errTipMsg(msg: string = '余额不足,无法继续对话,给作者打赏点吧!😭') {
    ElMessage.error(msg)
}
async function main(e: any) {
    if (e.shiftKey) return  // shift + enter 不阻止默认行为实现换行
    e.preventDefault();
    if (!textarea.value && !loading.value && !startLoading.value) {
        showPopover.value = !showPopover.value;
        return;
    }
    if (loading.value || startLoading.value) return;
    if (!hasBalance.value) return errTipMsg()
    sendMsgToDeepSeek()
}
// https://chat.deepseek.com/api/v0/file/upload_file
async function sendMsgToDeepSeek() {
    try {
        clearCacheByIndex()
        await nextTick()
        userScroll.value = false
        // isProgrammaticScroll.value = true
        controller = new AbortController();
        loading.value = true;
        const messageId = getNanoid()
        messageList.value.push({ role: role.value, content: textarea.value || tempTextarea.value, name: '', id: messageId, answer: '', startLoading: true, copySuccess: false, refresh: tempRefresh.value || 0, createtime: Date.now() });
        tempRefresh.value = 0
        setStorage(messageList.value)
        doneLoading.value = true
        textarea.value = ''
        scrollBto();
        setTimeout(() => {
            doneLoading.value = false
        }, 2000)
        const stream = await openai.chat.completions.create({
            messages: [{ role: 'system', content: 'You are a helpful assistant', name: '' }, ...messageList.value.map(item => ({ role: item.role, content: item.content, name: item.name }))],
            model: "deepseek-chat",
            stream: true,
        }, { signal: controller.signal });
        doneLoading.value = false
        let buffer = ''
        const messageItem = messageList.value.find(item => item.id === messageId)!
        // 开启新线程避免页面卡顿
        const worker = new Worker(new URL('../utils/worker', import.meta.url), { type: 'module' });
        for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || '';
            if (chunkContent) {
                buffer += chunkContent
                worker.postMessage({ buffer });
                worker.onmessage = (event) => {
                    messageItem.answer = event.data;
                    messageItem.startLoading = false
                    // isProgrammaticScroll.value = true
                    nextTick(() => {
                        const codeBlocks = contentRef.value!.querySelectorAll('pre code') as any;
                        codeBlocks.forEach((block: any) => {
                            if (!block.dataset.highlighted) {
                                hljs.highlightElement(block);
                                block.dataset.highlighted = true
                            }
                        });
                    });
                }
            }
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            return
        }
        console.log('error', error);
        ElMessage.error(error || '请求出错了,请稍后再试')
    } finally {
        loading.value = false
        doneLoading.value = false
        controller = null;
        clearIntervalFn()
        setStorage(messageList.value)
    }
}
// 自动清理部分缓存
function clearCacheByIndex() {
    const { isFull } = checkStore()
    if (isFull) {
        removeStorage(10)
        messageList.value = getStorage()
    }
}
// 开启新的对话
function openNewChat() {
    clearCacheByIndex()

}
onMounted(async () => {
    messageList.value = getStorage().map(item => ({ ...item, startLoading: false, copySuccess: false }))
    await nextTick()
    hljs.highlightAll();
})

onBeforeUnmount(() => {
    cancelMain();
    stopWatch();
});


</script>

<template>
    <div>
        <div ref="aiRef" @mouseup="mouseUp" :style="style" v-if="!showAiModal" @click.stop="showModal"
            class="fixed text-xs cursor-pointer z-50 flex justify-center items-center w-12 h-12 lg:w-14 lg:h-14 text-color bg-slate-100 shadow-lg dark:bg-[#292A2D] rounded-full">
            <span>AI助手</span>
        </div>
        <div v-show="showAiModal"
            class="fixed motion-safe:animate-drawer z-10 right-0 bottom-0 bg-slate-600 dark:bg-[#292A2D] h-screen md:w-2/3 w-full p-4 flex flex-col gap-4">
            <CssLoading v-if="balLoading"></CssLoading>
            <header class="text-center select-none h-10 leading-10 flex items-center justify-between gap-2">
                <div>
                    <img src="~/assets/icons/hamburger.svg" class="w-4 h-4 cursor-pointer" alt="">
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-white">AI助手Skunk-DeepSeek</span>
                </div>
                <div class="">
                    <img src="~/assets/icons/close.svg" class="w-4 h-4 cursor-pointer" @click="showAiModal = false"
                        alt="">
                </div>
            </header>
            <section
                class="w-full flex-1 flex flex-col items-center justify-center rounded-md p-2 overflow-y-auto overflow-x-hidden"
                ref="contentRef">
                <div v-for="item in messageList" :key="item.id">
                    <div class="text-block flex items-baseline justify-end gap-x-1 group mb-2">
                        <div class="group-hover:block hidden">
                            <img src="~/assets/icons/success.svg" v-if="item.copySuccess" class="w-6 h-6 cursor-pointer"
                                alt="">
                            <el-tooltip class="box-item" effect="dark" content="复制" placement="top" v-else>
                                <img src="~/assets/icons/copy.svg" @click.stop="copy(item, 'content')"
                                    class="w-6 h-6 cursor-pointer" alt="">
                            </el-tooltip>
                        </div>
                        <div
                            class="bg-[#EFF6FF] rounded p-2 max-w-2/3 break-all text-sm relative after:content-[''] after:absolute after:-right-3 after:top-1 after:w-0 after:h-0 after:border-8 after:border-transparent after:border-l-[#EFF6FF]">
                            {{ item.content }}
                        </div>
                        <div class="w-10 h-10 overflow-hidden flex items-center justify-center">
                            <img src="~/assets/icons/skunk.svg" alt="" class="w-6 h-6">
                        </div>
                    </div>
                    <div class="flex items-start gap-x-3 text-white">
                        <div
                            class="w-10 h-10 border-2 overflow-hidden flex items-center justify-center border-white rounded-full">
                            <img src="~/assets/icons/deepseek.svg" alt="" class="w-6 h-6">
                        </div>
                        <img src="~/assets/icons/loading.svg" class="w-8 h-8 mt-1" alt=""
                            :class="item.startLoading ? 'animate-spin' : 'hidden'">
                        <div class="w-2/3 break-all group">
                            <div v-html="item.answer" v-if="item.refresh == 0 || item.answer" class="text-sm"></div>
                            <div v-if="item.refresh > 0 && !item.answer && !item.startLoading">服务器繁忙，请稍后再试。</div>
                            <div class="mt-2 h-7">
                                <div class="items-center gap-x-2 hidden group-hover:flex">
                                    <img src="~/assets/icons/success.svg" v-if="item.copySuccess"
                                        class="w-6 h-6 cursor-pointer" alt="">
                                    <img src="~/assets/icons/copy.svg"
                                        v-if="!item.startLoading || (!item.copySuccess && !loading)"
                                        @click.stop="copy(item, 'answer')" class="w-6 h-6 cursor-pointer" alt="">
                                    <img v-if="!loading" @click="refresh(item)" src="~/assets/icons/refresh.svg"
                                        class="w-6 h-6 cursor-pointer" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-white text-center" v-if="messageList.length == 0">
                    <div class="flex items-center justify-center gap-x-3 mb-1">
                        <img src="~/assets/icons/skunk.svg" class="w-8 h-8" alt="">
                        <span class=" font-bold text-xl">我是AI助手Skunk-DeepSeek，很高兴见到你!</span>
                    </div>
                    <div class="text-sm">我可以帮你写代码、写作等，请把你的任务交给我吧~</div>
                </div>
            </section>
            <div class="flex items-center justify-center h-10" v-if="messageList.length > 0">
                <div @click="openNewChat"
                    class="text-[#646BFE] bg-[#DBEAFE] text-sm cursor-pointer flex items-center justify-center gap-x-2 py-1 px-2 rounded-lg">
                    <img src="~/assets/icons/modal.svg" class="w-4 h-4" alt=""><span>开启新的对话</span>
                </div>
            </div>
            <footer class="text-center max-h-[300px] sm:min-h-[160px] bg-[#F3F4F6] dark:bg-[#404045] p-3 rounded-md">
                <textarea ref="textareaRef" maxlength="50000" :readonly="loading || balLoading"
                    placeholder="给 AI助手 - DeepSeek 发送消息"
                    class="w-full md:h-36 sm:h-24 resize-none p-2 outline-none rounded-md focus:border-[#D6DEE8] bg-transparent dark:bg-[#404045] dark:text-white text-gray-800 text-sm"
                    rows="2" v-model.trim="textarea" @keydown.enter="main"></textarea>
                <div class="flex justify-end gap-x-2">
                    <el-tooltip effect="dark" placement="top" v-if="!loading">
                        <template #content>
                            <span>清除缓存</span>
                        </template>
                        <button
                            class="md:w-10 md:h-10 w-8 h-8 flex justify-center items-center rounded-full bg-[#D6DEE8]"
                            :class="clearLoading ? 'cursor-not-allowed' : ''" @click.stop="clearCache">
                            <img src="~/assets/icons/clear.svg" class="w-6 h-6" alt=""
                                :class="!clearLoading ? 'block' : 'hidden'">
                            <img src="~/assets/icons/loading.svg" class="w-6 h-6"
                                :class="clearLoading ? 'animate-spin' : 'hidden'" alt="">
                        </button>
                    </el-tooltip>
                    <el-tooltip :visible="showPopover" effect="dark" placement="top">
                        <template #content>
                            <span>请输入你的问题</span>
                        </template>
                        <button
                            class="md:w-10 md:h-10 w-8 h-8 flex justify-center items-center rounded-full bg-[#D6DEE8]"
                            :class="!textarea && !loading ? 'cursor-not-allowed' : ''" @click.stop="main">
                            <img src="~/assets/icons/send.svg" class="w-6 h-6" alt=""
                                :class="(!loading && !doneLoading) ? 'block' : 'hidden'">
                            <img src="~/assets/icons/loading.svg" class="w-6 h-6"
                                :class="doneLoading ? 'animate-spin' : 'hidden'" alt="">
                            <img src="~/assets/icons/stop.svg" @click.stop="cancelMain" class="w-6 h-6"
                                :class="(!doneLoading && loading) ? 'block' : 'hidden'" alt="">
                        </button>
                    </el-tooltip>
                </div>
            </footer>
        </div>
    </div>
</template>

<style>
pre code {
    border-radius: 8px !important;
    margin: 10px 0;
}
</style>