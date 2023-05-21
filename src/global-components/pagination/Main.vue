<template>
    <div class="intro-y col-span-12 flex flex-row justify-between  sm:flex-nowrap items-center">
        <div class="ml-4 text-slate-600 dark:text-slate-400">
            <strong>Total:</strong> {{ total }}
        </div>

        <nav class="w-auto ">
            <ul class="pagination" v-show="multi_pages">
                <li class="page-item">
                    <button class="page-link" :disabled="page <= 1" @click="firstPage">
                        <ChevronsLeftIcon class="w-4 h-4"/>
                    </button>
                </li>
                <li class="page-item">
                    <button class="page-link" :disabled="page <= 1" @click="prevPage">
                        <ChevronLeftIcon class="w-4 h-4"/>
                    </button>
                </li>

                <li class="page-item" :class="{'active': page_for == page}" v-for="page_for in pages" :key="page_for">
                    <button class="page-link" @click="setPage(page_for)">{{ page_for }}</button>
                </li>

                <li class="page-item">
                    <button class="page-link" :disabled="page >= total_pages" @click="nextPage">
                        <ChevronRightIcon class="w-4 h-4"/>
                    </button>
                </li>
                <li class="page-item">
                    <button class="page-link" :disabled="page >= total_pages" @click="lastPage">
                        <ChevronsRightIcon class="w-4 h-4"/>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup>

import {inject, onMounted, ref, watch} from "vue";

const page = ref(1);
const total_pages = ref(1);
const pages = ref([]);
const last_pages = ref(1);
const multi_pages = ref(false);

const props = defineProps({
    total: {
        type: Number,
        default: 0,
    },
    limit: {
        type: Number,
        default: 15,
    },
    change: {
        type: Function
    }
});

const generatePages = () => {
    total_pages.value = Math.ceil(props.total / props.limit);
    multi_pages.value = total_pages.value > 1;
    setPagesLimit();
}

const setPagesLimit = () => {
    let new_pages = [];

    let page_value = page.value;

    let prev_page = page_value - 1;

    let next_page = page_value + 1;

    if (prev_page) {
        new_pages.push(prev_page);
    }

    new_pages.push(page_value);

    if (next_page <= total_pages.value) {
        new_pages.push(next_page);
    }

    pages.value = new_pages;

}

const setPage = (value) => {
    page.value = parseInt(value);
    setPagesLimit();
}

const lastPage = () => {
    page.value = total_pages.value;
    setPagesLimit();
}

const nextPage = () => {
    page.value++;
    setPagesLimit();
}

const prevPage = () => {
    page.value--;
    setPagesLimit();
}

const firstPage = () => {
    page.value = 1;
    setPagesLimit();
}

watch(page, (newValue) => {
    props.change(newValue);
});

watch(() => props.total, () => {
    generatePages();
});

onMounted(() => {
    generatePages();
});

</script>
