<script setup lang="ts">
import OpenAI from "openai";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useMessage } from 'naive-ui';
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
const message = useMessage();
const messageList = ref<MessageListItem[]>([]);
const role = ref<Role>('assistant');
const contentRef = ref<HTMLElement>();
const content = ref('');
const isProgrammaticScroll = ref(false)
let timer: any = null
let controller: any = null;


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-7ba4755beeb04125ad58644b88e21aad',
    dangerouslyAllowBrowser: true,
    timeout: 60000
});



const scrollBto = () => {
    timer && clearInterval(timer)
    timer = setInterval(() => {
        if (userScroll.value) {
            clearInterval(timer)
            return
        }
        if (contentRef.value) {
            contentRef.value.scrollTo(0, contentRef.value.scrollHeight);
        }
    }, 100)
    contentRef.value!.addEventListener('scroll', () => {
        if (isProgrammaticScroll.value) {
            isProgrammaticScroll.value = false
            return
        }
        userScroll.value = true
        clearInterval(timer)
    })
};

async function main(e: KeyboardEvent) {
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
            message.warning(error.message);
        }
    } finally {
        loading.value = false;
        controller = null;
    }
}

const stopWatch = watch(textarea, () => {
    if (textarea.value) {
        showPopover.value = false;
    }
});

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
        <div ref="aiRef" :style="style"
            class="fixed text-xs cursor-pointer z-50 flex justify-center items-center w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 shadow-lg dark:bg-slate-800 rounded-full">
            <span>AI助手</span>
        </div>
        <div class="fixed right-0 bottom-0 h-screen lg:w-1/3 ">
            <header class="text-center h-10 leading-10 flex items-center justify-center gap-2">
                <span>DeepSeek AI</span>
                <img src="~/assets/icons/loading.svg" class="w-4 h-4" alt=""
                    :class="loading ? 'animate-spin' : 'hidden'">
            </header>
            <section class="w-full flex-1 border rounded-md p-4 overflow-y-auto overflow-x-hidden" ref="contentRef">
                <div v-if="startLoading" class="text-center text-gray-500 text-sm">DeepSeek 正在思考中...</div>
                <div v-html="content"></div>
            </section>
            <footer class="text-center min-h-[100px] max-h-[300px] bg-[#F3F4F6] p-3 rounded-md">
                <textarea :readonly="loading" placeholder="给 DeepSeek 发送消息"
                    class="w-full h-36 resize-none p-2 outline-none rounded-md focus:border-[#D6DEE8] bg-transparent text-gray-800"
                    rows="2" v-model.trim="textarea" @keydown.enter="main"></textarea>
                <div class="flex justify-end">
                    <!-- <n-tooltip :show="showPopover" placement="bottom">
                        <template #trigger>
                            <button class="w-10 h-10 flex justify-center items-center rounded-full bg-[#D6DEE8]"
                                :class="!textarea && !loading ? 'cursor-not-allowed' : ''" @click.stop="main">
                                <img src="~/assets/icons/send.svg" class="w-6 h-6" alt=""
                                    :class="(!loading && !startLoading) ? 'block' : 'hidden'">
                                <img src="~/assets/icons/loading.svg" class="w-6 h-6"
                                    :class="startLoading ? 'animate-spin' : 'hidden'" alt="">
                                <img src="~/assets/icons/stop.svg" @click.stop="cancelMain" class="w-6 h-6"
                                    :class="(!startLoading && loading) ? 'block' : 'hidden'" alt="">
                            </button>
                        </template>
<span>请输入你的问题</span>
</n-tooltip> -->
                </div>
            </footer>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>