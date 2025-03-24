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
const role = ref<Role>('assistant');
const contentRef = ref<HTMLElement>();
const textareaRef = ref<HTMLElement>()
const isProgrammaticScroll = ref(false)
const doneLoading = ref(false)
const showAiModal = ref(false)
const tempRefresh = ref(0)
let timer: any = null
let controller: any = null;


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-7ba4755beeb04125ad58644b88e21aad',
    dangerouslyAllowBrowser: true,
});

const startLoading = computed(() => {
    return messageList.value.some(item => item.startLoading)
})

// 监听AI对话框开启状态
watch(showAiModal, async () => {
    if (showAiModal.value) {
        document.body.style.overflow = 'hidden'
        await nextTick()
        contentRefScroll()
        textareaRef.value?.focus()
    } else {
        document.body.style.overflow = 'auto'
    }
})
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
        if (userScroll.value) {
            clearIntervalFn()
            return
        }
        contentRefScroll()
    }, 10)
    contentRef.value!.addEventListener('scroll', () => {
        if (isProgrammaticScroll.value) {
            isProgrammaticScroll.value = false
            return
        }
        userScroll.value = true
        clearIntervalFn()
    })
};

function contentRefScroll() {
    if (contentRef.value) {
        contentRef.value.scrollTo(0, contentRef.value.scrollHeight);
    }
}

async function main(e: any) {
    if (e.shiftKey) return  // shift + enter 不阻止默认行为实现换行
    e.preventDefault();
    if (!textarea.value && !loading.value && !startLoading.value) {
        showPopover.value = !showPopover.value;
        return;
    }
    if (loading.value || startLoading.value) return;
    userScroll.value = false
    isProgrammaticScroll.value = true
    sendMsgToDeepSeek()
}

async function sendMsgToDeepSeek() {
    try {
        controller = new AbortController();
        loading.value = true;
        const messageId = getNanoid()
        messageList.value.push({ role: role.value, content: textarea.value || tempTextarea.value, name: '', id: messageId, answer: '', startLoading: true, copySuccess: false, refresh: tempRefresh.value || 0 });
        tempRefresh.value = 0
        setStorage(messageList.value)
        doneLoading.value = true
        textarea.value = ''
        const stream = await openai.chat.completions.create({
            messages: messageList.value.map(item => ({ role: item.role, content: item.content, name: item.name })),
            model: "deepseek-chat",
            stream: true,
        }, { signal: controller.signal });
        doneLoading.value = false
        let buffer = ''
        const messageItem = messageList.value.find(item => item.id === messageId)!
        // 开启新线程避免页面卡顿
        const worker = new Worker(new URL('../utils/worker', import.meta.url), { type: 'module' });
        scrollBto();
        for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || '';
            if (chunkContent) {
                buffer += chunkContent
                worker.postMessage({ buffer });
                worker.onmessage = (event) => {
                    messageItem.answer = event.data;
                    messageItem.startLoading = false
                    isProgrammaticScroll.value = true
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
        console.log('finally');
        controller = null;
        clearIntervalFn()
        setStorage(messageList.value)
    }
}


const cancelMain = () => {
    if (controller) {
        controller.abort();
        controller = null;
        loading.value = false;
        messageList.value = messageList.value.map(item => ({ ...item, startLoading: false }))
        setStorage(messageList.value)
    }
};
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
        <div ref="aiRef" :style="style" v-if="!showAiModal" @click="showAiModal = true"
            class="fixed text-xs cursor-pointer z-50 flex justify-center items-center w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 shadow-lg dark:bg-[#292A2D] rounded-full">
            <span>AI助手</span>
        </div>
        <div v-show="showAiModal" class="fixed right-0 bottom-0 left-0 top-0 bg-black/50 w-screen h-screen">
            <div
                class="fixed motion-safe:animate-drawer z-10 right-0 bottom-0 bg-slate-600 dark:bg-[#292A2D] h-screen md:w-2/3 w-full p-4 flex flex-col gap-4">
                <header class="text-center select-none h-10 leading-10 flex items-center justify-between gap-2">
                    <div>
                        <img src="~/assets/icons/hamburger.svg" class="w-4 h-4 cursor-pointer" alt="">
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-white">AI助手 - DeepSeek</span>
                    </div>
                    <div class="">
                        <img src="~/assets/icons/close.svg" class="w-4 h-4 cursor-pointer" @click="showAiModal = false"
                            alt="">
                    </div>
                </header>
                <section class="w-full flex-1  rounded-md p-2 overflow-y-auto overflow-x-hidden" ref="contentRef">
                    <div v-for="item in messageList" :key="item.id">
                        <div class="text-block flex items-baseline justify-end gap-x-1 group mb-2">
                            <div>
                                <img src="~/assets/icons/success.svg" v-if="item.copySuccess"
                                    class="w-6 h-6 cursor-pointer" alt="">
                                <el-tooltip class="box-item" effect="dark" content="Top Center prompts info"
                                    placement="top" v-else>
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
                                <div v-html="item.answer" v-if="item.refresh == 0" class="text-sm"></div>
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
                </section>
                <footer
                    class="text-center max-h-[300px] sm:min-h-[160px] bg-[#F3F4F6] dark:bg-[#404045] p-3 rounded-md">
                    <textarea ref="textareaRef" :readonly="loading" placeholder="给 AI助手 - DeepSeek 发送消息"
                        class="w-full md:h-36 sm:h-24 resize-none p-2 outline-none rounded-md focus:border-[#D6DEE8] bg-transparent dark:bg-[#404045] dark:text-white text-gray-800 text-sm"
                        rows="2" v-model.trim="textarea" @keydown.enter="main"></textarea>
                    <div class="flex justify-end">
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
    </div>
</template>

<style>
pre code {
    border-radius: 8px !important;
    margin: 10px 0;
}
</style>