<script setup lang="ts">

</script>

<template>
    <div class="pt-10">
        <top zhtitle="接触" title="Contact" zhdesc="我来帮忙。" desc="I am here to help."></top>
        <div class="md:flex gap-10 md:px-32">
            <div class="flex-1 md:mb-0 mb-5">
                <div class="text-2xl">Contact Nuxtship Creator</div>
                <div class="mt-3 mb-5 text-xl text-gray-400">
                    Have something to say? I am here to help. Fill up the form or send email.
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <Icon name="uil:registered"></Icon>
                    <span>1010 Vienna, Austria</span>
                </div>
                <div class="flex items-center gap-4">
                    <Icon name="uil:envelope-minus"></Icon>
                    <span>jakobaichmayr@gmail.com</span>
                </div>
            </div>
            <div class="flex-1">
                <form action="" class="flex flex-col items-center">
                    <input class="w-full border-2 border-[#D1D5DB] h-10 rounded pl-3" type="text" required
                        placeholder="Full Name">
                    <input class="w-full border-2 border-[#D1D5DB] h-10 rounded pl-3 my-3" type="text" required
                        placeholder="Email Address">
                    <textarea class="w-full h-36 border-2 border-[#D1D5DB] rounded p-3 mb-3" name="" id=""
                        placeholder="Your Message"></textarea>
                    <button type="submit"
                        class="text-white rounded-md w-full text-center py-3 bg-black hover:bg-slate-700 cursor-pointer">Send
                        Message</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>