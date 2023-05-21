<template>
  <div
    ref="toastifyRef"
    v-toastify-directive="{ props, emit }"
    class="toastify-content hidden"
  >
    <div class="flex" >
        <CheckCircleIcon class="text-success" />
        <div class="ml-4 mr-4">
            <div class="font-medium">__title__</div>
            <div class="text-slate-500 mt-1 leading-4">
                __content__
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { init, reInit } from "./index";

const vToastifyDirective = {
  mounted(el, { value }) {
    init(el, value.props);
  },
  updated(el) {
    reInit(el);
  },
};

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  refKey: {
    type: String,
    default: null,
  },
});

const emit = defineEmits();

const toastifyRef = ref();
const bindInstance = () => {
  if (props.refKey) {
    const bind = inject(`bind[${props.refKey}]`);
    if (bind) {
      bind(toastifyRef.value);
    }
  }
};

onMounted(() => {
  bindInstance();
});
</script>
