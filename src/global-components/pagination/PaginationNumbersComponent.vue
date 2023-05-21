<template>
    <div class="intro-y col-span-12 flex flex-row justify-between  sm:flex-nowrap items-center">
        <nav class="w-auto">
            <ul v-if="total >= 1" class="pagination">
                <li class="page-item" aria-label="go to previous page" @click="previous()" :class="{disabled: currentPage === 1}">
                    <button class="page-link" :disabled="currentPage === 1">
                        <ChevronLeftIcon class="w-4 h-4"/>
                    </button>
                </li>
                <li v-for="index in total_pages" :key="index" :aria-label="'go to page ' + index" class="page-item" :class="{'active': currentPage === index}" @click="setCurrentPage(index)">
                    <button class="page-link">{{ index }}</button>
                </li>
                <li class="page-item" :class="{disabled: currentPage === total_pages || !total_pages}" aria-label="go to next page" @click="next()">
                    <button class="page-link" :disabled="currentPage === total_pages || !total_pages">
                        <ChevronRightIcon class="w-4 h-4"/>
                    </button>
                </li>
            </ul>
        </nav>
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
