<script setup lang="ts">

import OpenAI from "openai";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { orderBy, debounce } from 'lodash'
import type { MessageListItem, Role, AsideDataItem } from '~/types'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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
const contentRef = ref<InstanceType<typeof DynamicScroller>>();
const textareaRef = ref<HTMLElement>()
const doneLoading = ref(false)
const showAiModal = ref(false)
const tempRefresh = ref(0)
const balLoading = ref(false)
const clearLoading = ref(false)
const asideLoading = ref(false)
const isMove = ref(false)
const models = ref({
    'chat': 'deepseek-chat',
    'reasoner': 'deepseek-reasoner'
})
const worker = ref()
const hasBalance = ref(true)
const showAside = ref(false)
const usePercent = ref('')
const currentActiveDialog = ref('')
const asideData = ref<AsideDataItem[]>([])
const AINAME = 'AI助手 Skunk-DeepSeek'
const currentKey = ref()
const prevScrollTop = ref(0)
const currentScrollTop = ref(0)
const sectionRef = ref()
const headerRef = ref()
const footerRef = ref()
const modalRef = ref()
const TIMEOUT = 60 * 1000 // 60s
const deepthink = ref(false)
const isWheel = ref(false)
const oldScrollTop = ref(0)
let moveTimer: NodeJS.Timeout
let timer: NodeJS.Timeout
let controller: any = null;
const config = useRuntimeConfig()
const APIKEY = config.public.deepseekApiKey
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
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
        // await nextTick()
        highBlock()
        try {
            scrollPd(true)
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
            if (typeof e === 'string') {
                ElMessage.error(e);
            } else if (e instanceof Error) {
                ElMessage.error(e.message);
            }
        } finally {
            comSectionHeigh()
            contentRefScroll()
            balLoading.value = false
            textareaRef.value?.focus()
        }
    } else {
        scrollPd(false)
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
    }, 300)
}

const stopWatch = watch(textarea, () => {
    if (textarea.value) {
        showPopover.value = false;
    }
});

// 复制文本
const copy = async (item: MessageListItem, field: 'content' | 'answer') => {
    if (item.copySuccess) return
    await copyToClipboard(item[field]);
    item.copySuccess = true
    setTimeout(() => {
        item.copySuccess = false
    }, 1000)
}
// 重新生成
const refresh = async (item: MessageListItem, index: number) => {
    tempRefresh.value = ++item.refresh
    messageList.value.splice(index)
    textarea.value = ''
    tempTextarea.value = item.content
    sendMsgToDeepSeek()
    await nextTick()
    contentRefScroll()
}

const clearIntervalFn = () => {
    timer && clearInterval(timer)
}

const scrollBto = () => {
    clearIntervalFn()
    timer = setInterval(() => {
        if (userScroll.value) {
            clearIntervalFn()
        } else {
            contentRefScroll()
        }
    }, 100)
};

const cancelMain = () => {
    if (controller) {
        controller.abort();
        controller = null;
        loading.value = false;
        messageList.value = messageList.value.map(item => ({ ...item, startLoading: false }))
        setStorage(currentKey.value, messageList.value)
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
        '对话清理',
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
                removeStorage(currentKey.value, 0, true)
                setDialogKey()
                messageList.value = []
                ElMessage.success('清除成功')
            }, Math.random() * 1500)
        })
        .catch(() => {

        })
}
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function scrollPd(hidden: boolean) {
    if (hidden) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = isMobileDevice() ? '0px' : '15px'
    } else {
        document.body.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
    }
}

function contentRefScroll(type?: string) {
    if (type === 'bottom') {
        contentRef.value.scrollToBottom();
        isWheel.value = true
    } else {
        if (contentRef.value && !userScroll.value) {
            contentRef.value.scrollToBottom();
        }
    }
}

function daynamicScrollerScroll(e: any) {
    if (userScroll.value) {
        if (!loading.value) {
            contentRef.value.$el.scrollTop = e.target.scrollTop
        } else {
            if (isWheel.value) {
                contentRef.value.$el.scrollTop = e.target.scrollTop
                oldScrollTop.value = e.target.scrollTop
            } else {
                // contentRef.value.$el.scrollTo({
                //     top: oldScrollTop.value,
                //     behavior: 'smooth'
                // })
            }
        }
        return
    }
    currentScrollTop.value = e.target.scrollTop
    if (currentScrollTop.value < prevScrollTop.value) {
        userScroll.value = true
        oldScrollTop.value = e.target.scrollTop
    }
    prevScrollTop.value = currentScrollTop.value - 30
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
    if (!isToday()) {
        currentKey.value = getDateTime().fulltime
        setDialogKey(currentKey.value)
    }
    sendMsgToDeepSeek()
}
async function sendMsgToDeepSeek() {
    try {
        clearCacheByIndex()
        await nextTick()
        currentKey.value = getDialogKey()
        userScroll.value = false
        isWheel.value = false
        prevScrollTop.value = 0
        currentScrollTop.value = 0
        controller = new AbortController();
        loading.value = true;
        const messageId = getNanoid()
        messageList.value.push({ role: role.value, content: textarea.value || tempTextarea.value, name: '', id: messageId, answer: '', lzstring: false, startLoading: true, copySuccess: false, refresh: tempRefresh.value || 0, createtime: Date.now() });
        tempRefresh.value = 0
        setStorage(currentKey.value, messageList.value)
        doneLoading.value = true
        textarea.value = ''
        scrollBto();
        setTimeout(() => {
            doneLoading.value = false
        }, 2000)
        const list = messageList.value.map(item => ({ role: item.role, content: item.content, answer: item.answer }))
        const messages: any[] = []
        list.forEach(item => {
            const user = {
                role: item.role, //'user'
                content: item.content,
            }
            const assistant = {
                role: 'assistant',
                content: domParserText(item.answer)
            }
            messages.push(user, assistant)
        })
        // 确保最后一个是user
        messages.splice(messages.length - 1, 1)
        const stream = await openai.chat.completions.create({
            messages,
            model: deepthink.value ? models.value['reasoner'] : models.value['chat'],
            stream: true,
        }, { signal: controller.signal, timeout: TIMEOUT });
        doneLoading.value = false
        let buffer = ''
        const messageItem = messageList.value.find(item => item.id === messageId)!
        // 开启新线程减少页面卡顿
        worker.value = new Worker(new URL('../utils/worker', import.meta.url), { type: 'module' });
        worker.value.onmessage = async (event: any) => {
            messageItem.answer = event.data;
            messageItem.startLoading = false
            requestAnimationFrame(() => {
                highBlock();
            });
        }
        const debouncedPost = debounce((data) => worker.value.postMessage(data), 20);
        for await (const chunk of stream) {
            let chunkContent
            if (deepthink.value) {
                const reasonContent = (chunk.choices[0].delta as any)?.reasoning_content || ''
                if (reasonContent) {
                    chunkContent = reasonContent
                } else {
                    chunkContent = chunk.choices[0]?.delta?.content || ''
                }
            } else {
                chunkContent = chunk.choices[0]?.delta?.content || ''
            }
            if (chunkContent) {
                buffer += chunkContent
                debouncedPost({ buffer });
            }
        }
    } catch (e) {
        if (typeof e === 'string') {
            ElMessage.error(e);
        } else if (e instanceof Error) {
            ElMessage.error(e.message);
        }
        resetMessage()
    } finally {
        worker.value?.terminate();
        doneLoading.value = false
        controller = null;
        clearIntervalFn()
        if (loading.value) {
            await nextTick()
            setStorage(currentKey.value, messageList.value)
        }
        loading.value = false
    }
}

// 代码高亮避免重复
async function highBlock() {
    const codeBlocks = sectionRef.value?.querySelectorAll('pre code') as any;
    codeBlocks.forEach((block: any) => {
        if (!block.dataset.highlighted) {
            hljs.highlightElement(block);
            block.dataset.highlighted = true
        }
        block.parentNode.insertAdjacentHTML('afterbegin', createCopyElement())
    });
    await nextTick()
    addLisEventCopyText()
}

//请求出错后当前对话重置
function resetMessage() {
    const loadingItem = messageList.value.find(item => item.startLoading)
    if (loadingItem) {
        loadingItem.startLoading = false
    }
}

// 自动清理部分缓存
function clearCacheByIndex() {
    const { isFull, percent } = checkStore()
    usePercent.value = percent + '%'
    if (isFull) {
        removeStorage(currentKey.value, 10)
        messageList.value = getStorage()[currentKey.value]
    }
}
// 开启新的对话
async function openNewChat() {
    clearCacheByIndex()
    if (messageList.value.length == 0) {
        // 说明已经是新的了
        showAside.value = false
        return
    }
    if (loading.value) {
        cancelMain()
    }
    currentKey.value = getDateTime().fulltime
    setDialogKey(currentKey.value)
    textarea.value = ''
    tempTextarea.value = ''
    textareaRef.value?.focus()
    showAside.value = false
    messageList.value = []
}

// 打开历史记录侧边栏
function openAside(bol: boolean) {
    if (balLoading.value) return
    showAside.value = bol
    if (bol) {
        try {
            asideLoading.value = true
            asideData.value = []
            const tempList = []
            const cacheData = getStorage()
            const data = orderBy(Object.entries(cacheData), ([key]) => new Date(key), ['desc'])
            const fromData = Object.fromEntries(data)
            for (let key in fromData) {
                const time = getTimeFromNow(key)
                const item = fromData[key]
                if (item.length == 0) continue
                const obj = {
                    time,
                    data: item,
                    origin_time: key,
                    title: item[0].content,
                }
                tempList.push(obj)
            }
            const groupList: AsideDataItem[] = []
            tempList.forEach(item => {
                const findItem = groupList.find(k => k.time == item.time)
                if (findItem) {
                    findItem.titles.push({
                        title: item.title,
                        origin_time: item.origin_time
                    })
                } else {
                    groupList.push({
                        time: item.time,
                        titles: [{
                            title: item.title,
                            origin_time: item.origin_time
                        }],
                    })
                }
            })
            asideData.value = groupList
            currentActiveDialog.value = currentKey.value
        } catch (e) {
            console.log('e', e);
        } finally {
            asideLoading.value = false
        }
    }
}

// 删除历史记录
function removeHistory(origin_time: string) {
    ElMessageBox.confirm(
        '删除后，该对话将不可恢复。确认删除吗？',
        '永久删除对话',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            asideData.value = asideData.value.map(item => {
                item.titles = item.titles.filter(k => k.origin_time !== origin_time)
                return item
            })
            removeStorage(origin_time, 0)
            if (origin_time === currentKey.value) {
                // 删除的是当前的对话
                cancelMain()
                removeDialogKey()
                messageList.value = []
                textarea.value = ''
                tempTextarea.value = ''
            }
        })
        .catch(() => {

        })
}

// 打开历史记录
async function openHistory(key: string) {
    if (currentKey.value === key) return
    if (loading.value) {
        cancelMain()
    }
    currentKey.value = key
    setDialogKey(key)
    messageList.value = getStorage()[key]
    currentActiveDialog.value = key
    showAside.value = false
    resetMessage()
    await nextTick()
    highBlock()
    contentRefScroll()
}

// 切换深度思考--切换模型为deepseek-reasoner
function useDeepThink() {
    deepthink.value = !deepthink.value
}
// 选取文件
function openFileWindow() {
    return ElMessage.warning('功能开发中')
    // const ipt = document.createElement('input')
    // ipt.type = 'file'
    // ipt.multiple = true
    // ipt.click()
    // ipt.onchange = (e: any) => {
    //     const files = e.target.files as Array<File>
    //     if (!files) return
    //     const validFiles = Array.from(files).filter(item => item.size <= 1024 * 1024 * 100)
    //     const formData = new FormData();
    //     validFiles.forEach(async (item) => {
    //         formData.append('file', item);
    //         const { data, error } = await useFetch('/api/upload', {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         console.log('data', data);
    //     })
    // }
}

// 创建复制元素
function createCopyElement() {
    const copyEle = `<div class="h-6 shadow-lg w-full bg-[#50505A] absolute top-0 left-0 right-0 z-10 flex items-center justify-end px-3"><span class="text-white text-xs cursor-copy copy-text">复制</span></div>`
    return copyEle
}

// 给复制元素添加点击事件
function addLisEventCopyText() {
    const copyTexts = document.querySelectorAll('.copy-text')
    copyTexts.forEach(item => {
        item.addEventListener('click', () => copyCode(item))
    })
}
let isCopy = false
// 复制code中的代码
async function copyCode(el: Element) {
    if (isCopy) return
    isCopy = true
    const codeEl = el.parentNode?.parentNode?.querySelector('code')
    await copyToClipboard(codeEl?.innerHTML as string)
    el.innerHTML = '复制成功'
    isCopy = false
    setTimeout(() => {
        el.innerHTML = '复制'
    }, 1000)
}

let wheelTimer: any = null
function contentAddEventWheel() {
    contentRef.value.$el.addEventListener('mousewheel', wheelFn)
    contentRef.value.$el.addEventListener('wheel', wheelFn)
    contentRef.value.$el.addEventListener('touchmove', wheelFn)
    function wheelFn() {
        wheelTimer && clearTimeout(wheelTimer)
        isWheel.value = true
        wheelTimer = setTimeout(() => {
            isWheel.value = false
        }, 100)
    }
}

// 动态计算section的高度
function comSectionHeigh() {
    const width = window.innerWidth
    const height = window.innerHeight
    const h = width < 768 ? 10 : 40
    const headerHeight = headerRef.value.offsetHeight
    const footerHeight = footerRef.value.offsetHeight
    const modalPad = (+getComputedStyle(modalRef.value).paddingRight.replace('px', '')) * 2
    sectionRef.value.style.height = `calc(${height - headerHeight - footerHeight - modalPad - h}px)`
}

onMounted(async () => {
    const guide = getGuide()
    if (guide) {
        await nextTick()
        const driverObj = driver({
            showProgress: true,
            nextBtnText: '下一步',
            prevBtnText: '上一步',
            doneBtnText: '完成',
            progressText: '{{current}}/{{total}}',
            onDestroyed: () => {
                setGuide(false)
            },
            steps: [
                { element: '#open-ai', popover: { title: 'AI助手', description: '点击我打开对话框进行对话', side: "left", align: 'start' } },
                { element: '#language', popover: { title: '语言切换', description: '可以进行中英切换', side: "bottom", align: 'end' } },
            ]
        });
        driverObj.drive();
    }
    currentKey.value = getDialogKey()
    setDialogKey(currentKey.value)
    try {
        const cacheData = getStorage()
        if (!cacheData[currentKey.value] || !Array.isArray(cacheData[currentKey.value])) {
            cacheData[currentKey.value] = []
        }
        messageList.value = (cacheData[currentKey.value] || []).map(item => ({ ...item, startLoading: false, copySuccess: false }))
        await nextTick()
        hljs.highlightAll()
        contentAddEventWheel()
    } catch (e) {
        messageList.value = []
    }
})

onBeforeUnmount(() => {
    cancelMain();
    stopWatch();
});
</script>

<template>
    <div :class="showAiModal ? `fixed bottom-0 right-0 overflow-hidden top-0 left-0 w-full h-full` : ''">
        <div ref="aiRef" id="open-ai" @mouseup="mouseUp" @touchend="mouseUp" :style="style" v-if="!showAiModal"
            @click.stop="showModal"
            class="drag-ele fixed text-xs cursor-pointer z-50 flex justify-center items-center w-12 h-12 lg:w-14 lg:h-14 text-color bg-slate-100 shadow-lg dark:bg-[#292A2D] rounded-full">
            <img src="~/assets/icons/ai-assisant.svg" alt="" class="w-6 h-6 select-none">
            <div class="w-7 h-7 absolute opacity-0"></div>
        </div>
        <div v-show="showAiModal" ref="modalRef"
            class="sticky motion-safe:animate-opacity md:translate-x-1/2 z-10 right-0 bottom-0 bg-slate-600 dark:bg-[#292A2D] h-screen md:w-2/3 w-full p-3">
            <CssLoading v-if="balLoading"></CssLoading>
            <header ref="headerRef" class="text-center select-none h-10 flex items-center justify-between gap-2">
                <div @click.stop="openAside(true)" class="flex items-center gap-x-2">
                    <img src="~/assets/icons/hamburger.svg" class="w-4 h-4 cursor-pointer" alt="">
                    <div class="w-4 h-4"></div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-white">{{ AINAME }}</span>
                </div>
                <div class="flex items-center gap-x-2">
                    <img src="~/assets/icons/new-dialogue.svg" class="w-4 h-4 cursor-pointer md:hidden"
                        @click="openNewChat" alt="">
                    <img src="~/assets/icons/close.svg" class="w-4 h-4 cursor-pointer" @click="showAiModal = false"
                        alt="">
                </div>
            </header>
            <section ref="sectionRef"
                class="w-full font-normal relative  rounded-md sm:p-0 md:p-2 overflow-x-hidden scrollbar"
                :class="messageList.length == 0 ? 'flex flex-col items-center justify-center' : ''">
                <DynamicScroller ref="contentRef" :buffer="1000" :items="messageList" :min-item-size="54"
                    class="h-full scrollbar" v-show="messageList.length > 0" @scroll.passive="daynamicScrollerScroll">
                    <template v-slot="{ item, index, active }">
                        <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
                            item.content, item.answer
                        ]" :data-index="index">
                            <div class="text-block flex items-baseline justify-end gap-x-1 group mb-2">
                                <div class="group-hover:block hidden">
                                    <img src="~/assets/icons/success.svg" v-if="item.copySuccess"
                                        class="w-6 h-6 cursor-pointer" alt="">
                                    <el-tooltip class="box-item" effect="dark" content="复制" placement="top" v-else>
                                        <img src="~/assets/icons/copy.svg" @click.stop="copy(item, 'content')"
                                            class="w-6 h-6 cursor-pointer" alt="">
                                    </el-tooltip>
                                </div>
                                <div
                                    class="bg-[#EFF6FF] rounded-md p-2 max-w-[66.66%] w-fit break-all text-sm relative after:content-[''] after:absolute after:-right-3 after:top-1 overflow-hidden after:w-0 after:h-0 after:border-8 after:border-transparent after:border-l-[#EFF6FF] whitespace-pre-wrap">
                                    {{ item.content }}
                                </div>
                                <div class="w-10 h-10 overflow-hidden flex items-center justify-center">
                                    <img src="~/assets/icons/skunk.svg" alt="" class="w-6 h-6">
                                </div>
                            </div>
                            <div class="flex items-start gap-x-3 text-white">
                                <div
                                    class="w-10 flex-shrink-0 h-10 border-2 overflow-hidden flex items-center justify-center border-white rounded-full">
                                    <img src="~/assets/icons/deepseek.svg" alt="" class="w-6 h-6">
                                </div>
                                <img src="~/assets/icons/loading.svg" class="w-8 h-8 mt-1" alt=""
                                    :class="item.startLoading ? 'animate-spin' : 'hidden'">
                                <div class="w-4/5 break-all group">
                                    <div v-html="item.answer" v-if="item.refresh == 0 || item.answer" class="text-sm">
                                    </div>
                                    <div v-if="!item.answer && !item.startLoading">服务器繁忙，请稍后再试。
                                    </div>
                                    <div class="mt-2 h-7">
                                        <div class="items-center gap-x-2 hidden group-hover:flex">
                                            <img src="~/assets/icons/success.svg" v-if="item.copySuccess"
                                                class="w-6 h-6 cursor-pointer" alt="">
                                            <img src="~/assets/icons/copy.svg"
                                                v-if="(!item.startLoading && !item.copySuccess) || (!item.copySuccess && !loading)"
                                                @click.stop="copy(item, 'answer')" class="w-6 h-6 cursor-pointer"
                                                alt="">
                                            <img v-if="!loading && !startLoading" @click="refresh(item, index)"
                                                src="~/assets/icons/refresh.svg" class="w-6 h-6 cursor-pointer" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DynamicScrollerItem>
                    </template>
                </DynamicScroller>
                <div class="text-white text-center" v-if="messageList.length == 0">
                    <div class="flex items-center justify-center gap-x-3 mb-1">
                        <img src="~/assets/icons/skunk.svg" class="w-8 h-8" alt="">
                        <span class=" font-bold text-xl">我是AI助手Skunk-DeepSeek，很高兴见到你!</span>
                    </div>
                    <div class="text-sm">我可以帮你写代码、写作等，请把你的任务交给我吧~</div>
                </div>
                <div v-if="userScroll && messageList.length > 0" @click.stop="contentRefScroll('bottom')"
                    class="absolute z-50 right-6 bottom-0 select-none cursor-pointer w-8 h-8 rounded-full flex items-center justify-center dark:bg-[#404045] shadow bg-[#F3F4F6] hover:shadow-xl">
                    <img src="~/assets/icons/down.svg" class="w-4 h-4" alt="">
                </div>
            </section>
            <div class="md:flex items-center justify-center h-10 hidden" v-if="messageList.length > 0">
                <div @click.stop="openNewChat"
                    class="text-[#646BFE] bg-[#DBEAFE] text-sm cursor-pointer flex items-center justify-center gap-x-2 py-1 px-2 rounded-lg">
                    <img src="~/assets/icons/modal.svg" class="w-4 h-4" alt=""><span>开启新的对话</span>
                </div>
            </div>
            <!-- F3F4F6 -->
            <footer ref="footerRef"
                class="modal-footer fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] text-center sm:h-[160px] bg-[#F3F4F6] dark:bg-[#404045] p-3 rounded-md">
                <textarea ref="textareaRef" maxlength="50000" :readonly="loading || balLoading"
                    placeholder="给 AI助手 Shunk-DeepSeek 发送消息"
                    class="w-full md:h-30 sm:h-24 resize-none p-2 outline-none rounded-md focus:border-[#D6DEE8] bg-transparent dark:bg-[#404045] dark:text-white text-gray-800 text-sm"
                    rows="2" v-model.trim="textarea" @keydown.enter="main"></textarea>
                <div class="flex justify-between gap-x-2">
                    <div class="flex items-center gap-x-2">
                        <el-tooltip effect="dark" placement="top" :disabled="deepthink">
                            <template #content>
                                <span>先思考后回答，解决推理问题</span>
                            </template>
                            <button :disabled="loading"
                                class="w-fit md:h-10 h-8 text-[#4C4C4C] px-2 flex gap-x-1 justify-center items-center rounded-full bg-[#D6DEE8]"
                                @click.stop="useDeepThink"
                                :class="[{ 'cursor-not-allowed': loading }, { 'bg-[#DBEAFE] text-[#5F7FFE]': deepthink }]">
                                <img src="~/assets/icons/deepthink.svg" class="w-6 h-6" alt="" v-if="!deepthink">
                                <img src="~/assets/icons/deepthink-active.svg" class="w-6 h-6 text-[#5F7FFE]" alt=""
                                    v-else>
                                <span class="text-xs">深度思考(R1)</span>
                            </button>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="top" v-if="!loading">
                            <template #content>
                                <div>清除所有对话</div>
                                <div class="text-xs text-[#D6DEE8]">已使用内存:{{ usePercent }}</div>
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
                    </div>
                    <div class="flex justify-between gap-x-2">
                        <el-tooltip effect="dark" placement="top" v-if="!loading">
                            <template #content>
                                <div>上传附件(仅识别文字)</div>
                                <div class="text-xs">每个100MB,支持各类文档和图片</div>
                            </template>
                            <button
                                class="md:w-10 md:h-10 w-8 h-8 flex justify-center items-center rounded-full bg-[#D6DEE8]"
                                @click.stop="openFileWindow">
                                <img src="~/assets/icons/filelink.svg" class="w-6 h-6" alt=""
                                    :class="!loading ? 'block' : 'hidden'">
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
                </div>
            </footer>
            <aside v-if="showAside" class="h-screen w-full absolute left-0 top-0 overflow-hidden">
                <div class="h-screen w-full absolute left-0 bg-[rgba(0,0,0,0.3)] top-0" @click.stop="openAside(false)">
                </div>
                <div class="h-screen w-80 absolute z-10 bg-[#ebf1fc] p-4 motion-safe:animate-drawerleft">
                    <header class="flex items-center justify-between mb-5">
                        <h3>{{ AINAME }}</h3>
                        <img src="~/assets/icons/aside.svg" class="w-5 h-5 cursor-pointer"
                            @click.stop="openAside(false)" />
                    </header>
                    <div class="flex items-center h-10" @click.stop="openNewChat">
                        <div
                            class="text-[#646BFE] w-full h-full bg-[#DBEAFE] text-sm cursor-pointer flex items-center justify-center gap-x-2 py-1 px-2 rounded-lg">
                            <img src="~/assets/icons/modal.svg" class="w-5 h-5" alt=""><span>开启新的对话</span>
                        </div>
                    </div>
                    <!-- 历史记录 -->
                    <div class="mt-5 h-[calc(100%-100px)] overflow-y-hidden hover:overflow-y-auto scrollbar">
                        <div v-for="item in asideData" :key="item.time" class="mb-3">
                            <h3 class="text-[#555570] font-bold my-1 px-2 text-sm">{{ item.time }}</h3>
                            <div v-for="(child, idx) in item.titles" :key="idx"
                                :class="currentActiveDialog === child.origin_time ? 'bg-[#DAE9FD]' : ''"
                                class="flex justify-between items-center h-9 hover:bg-[#DAE9FD] cursor-pointer rounded-xl py-1 px-2 mb-1">
                                <div @click.stop="openHistory(child.origin_time)"
                                    class="text-sm flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{{
                                        child.title.slice(0, 30) }}</div>
                                <img src="~/assets/icons/remove.svg" @click.stop="removeHistory(child.origin_time)"
                                    alt="" class="w-4 h-4 cursor-pointer">
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<style>
pre code {
    position: relative;
    border-radius: 8px !important;
    margin: 10px 0;
    background-color: #181D28 !important;
    color: #fff !important;
    padding-top: 30px !important;
}

pre {
    position: relative;
    overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 18px 0;
}

ul,
ol {
    margin: 13px 0;
    padding-left: 30px !important;
}

ul li,
ol li {
    margin-top: 4px;
    list-style: disc !important;
}

p {
    margin: 13px 0;
}


.drag-ele {
    /* 拖拽优化 */
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.modal-footer {
    bottom: calc(10px + env(safe-area-inset-bottom));
}
</style>
