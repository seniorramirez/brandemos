<template>
    <div class="flex items-center sm:ml-auto">
        <div class="flex items-center mr-4 text-xs">
            Pág {{ currentPage }} de {{ total_pages }}
            <div class="ml-4 py-1 px-2 flex items-center rounded-full bg-slate-100 dark:bg-darkmode-400 text-slate-500 ml-auto truncate">
                Total: {{ total }}, {{stringTotal}}
            </div>
        </div>
        <ul v-if="total >= 1" class="pagination">
            <li class="page-item" aria-label="go to previous page" @click="previous()" :class="{disabled: currentPage === 1}">
                <button class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2" :disabled="currentPage === 1">
                    <ChevronLeftIcon class="w-4 h-4"/>
                </button>
            </li>
            <!--                <li v-for="index in total_pages" :key="index" :aria-label="'go to page ' + index" class="page-item" :class="{'active': currentPage === index}" @click="setCurrentPage(index)">
                                <button class="page-link">{{ index }}</button>
                            </li>-->
            <li class="page-item" :class="{disabled: currentPage === total_pages || !total_pages}" aria-label="go to next page" @click="next()">
                <button class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2" :disabled="currentPage === total_pages || !total_pages">
                    <ChevronRightIcon class="w-4 h-4"/>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {onMounted, ref, toRefs, watch} from "vue";

const props = defineProps({
    total: {
        required: true,
        type: Number,
        default: 0,
    },
    stringTotal: {
        type: String,
        default: 'registros',
    },
    modelValue: {
        required: true,
        type: Number,
    },
    limit: {
        type: Number,
        default: 15,
    },
    change: {
        type: Function
    },
});

const page = ref(1);
const {total, modelValue: currentPage, limit} = toRefs(props);

const emit = defineEmits(["update:modelValue", 'update:total']);

const setCurrentPage = (number) => {
    emit("update:modelValue", number);
    page.value = number;
};

const previous = () => {
    if (currentPage.value === 1) return;
    emit("update:modelValue", currentPage.value - 1);
    page.value = (currentPage.value - 1);
};

const next = () => {
    if (currentPage.value >= total_pages.value) return;
    emit("update:modelValue", currentPage.value + 1);
    page.value = (currentPage.value + 1);
};

const total_pages = ref(1);
const generatePages = () => {
    total_pages.value = Math.ceil(total.value / limit.value);
}

watch(page, (newValue) => {
    props.change(newValue);
});

watch(() => total.value, () => {
    generatePages();
});

onMounted(() => {
    generatePages();
});

</script>

<style scoped lang="scss"></style>
