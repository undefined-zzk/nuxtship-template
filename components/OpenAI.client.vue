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
const startLoading = ref(false);
const userScroll = ref(false)
const textarea = ref('给我一段简单的 JavaScript 代码示例,实现网格布局.');
const showPopover = ref(false);
const messageList = ref<MessageListItem[]>([]);
const role = ref<Role>('assistant');
const contentRef = ref<HTMLElement>();
const content = ref('');
const isProgrammaticScroll = ref(false)
const showAiModal = ref(false)
let timer: any = null
let controller: any = null;


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-7ba4755beeb04125ad58644b88e21aad',
    dangerouslyAllowBrowser: true,
    timeout: 60000
});

watch(showAiModal, () => {
    if (showAiModal.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }
})

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
        if (contentRef.value) {
            contentRef.value.scrollTo(0, contentRef.value.scrollHeight);
        }
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

async function main(e: any) {
    console.log('aaa');
    if (e.shiftKey) return  // shift + enter 不阻止默认行为实现换行
    e.preventDefault();
    if (!textarea.value && !loading.value && !startLoading.value) {
        showPopover.value = true;
        return;
    }
    if (loading.value || startLoading.value) return;

    content.value = "";
    controller = new AbortController();
    try {
        startLoading.value = true;
        loading.value = true;
        messageList.value = [{ role: role.value, content: textarea.value, name: '' }];
        const stream = await openai.chat.completions.create({
            messages: messageList.value,
            model: "deepseek-chat",
            stream: true,
        }, { signal: controller.signal });
        startLoading.value = false;
        textarea.value = ''
        let buffer = ''

        // 开启新线程避免页面卡顿
        const worker = new Worker(new URL('../utils/worker', import.meta.url), { type: 'module' });
        scrollBto();
        for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || '';
            if (chunkContent) {
                buffer += chunkContent
                worker.postMessage({ buffer });
                worker.onmessage = (event) => {
                    content.value = event.data;
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
            console.error("请求失败:", error);
        } else {
        }
    } finally {
        loading.value = false;
        controller = null;
        clearIntervalFn()
    }
}

// const stopWatch = watch(textarea, () => {
//     if (textarea.value) {
//         showPopover.value = false;
//     }
// });

const cancelMain = () => {
    if (controller) {
        controller.abort();
        controller = null;
        loading.value = false;
        startLoading.value = false;
    }
};

// onMounted(() => {
//     hljs.highlightAll();
// });

// onBeforeUnmount(() => {
//     cancelMain();
//     stopWatch();
// });
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
                        <img src="~/assets/icons/loading.svg" class="w-4 h-4" alt=""
                            :class="loading ? 'animate-spin' : 'hidden'">
                    </div>
                    <div class="">
                        <img src="~/assets/icons/close.svg" class="w-4 h-4 cursor-pointer" @click="showAiModal = false"
                            alt="">
                    </div>
                </header>
                <section class="w-full flex-1 border rounded-md p-4 overflow-y-auto overflow-x-hidden" ref="contentRef">
                    <div class="text-white" v-html="content"></div>
                </section>
                <footer
                    class="text-center max-h-[300px] sm:min-h-[160px] bg-[#F3F4F6] dark:bg-[#404045] p-3 rounded-md">
                    <textarea :readonly="loading" placeholder="给 AI助手 - DeepSeek 发送消息"
                        class="w-full md:h-36 sm:h-24 resize-none p-2 outline-none rounded-md focus:border-[#D6DEE8] bg-transparent dark:bg-[#404045] dark:text-white text-gray-800"
                        rows="2" v-model.trim="textarea" @keydown.enter="main"></textarea>
                    <div class="flex justify-end">
                        <button
                            class="md:w-10 md:h-10 w-8 h-8 flex justify-center items-center rounded-full bg-[#D6DEE8]"
                            :class="!textarea && !loading ? 'cursor-not-allowed' : ''" @click.stop="main">
                            <img src="~/assets/icons/send.svg" class="w-6 h-6" alt=""
                                :class="(!loading && !startLoading) ? 'block' : 'hidden'">
                            <img src="~/assets/icons/loading.svg" class="w-6 h-6"
                                :class="startLoading ? 'animate-spin' : 'hidden'" alt="">
                            <img src="~/assets/icons/stop.svg" @click.stop="cancelMain" class="w-6 h-6"
                                :class="(!startLoading && loading) ? 'block' : 'hidden'" alt="">
                        </button>
                        <!-- <span>请输入你的问题</span> -->
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
pre code {
    border-radius: 8px !important;
    margin: 10px 0;
}
</style>