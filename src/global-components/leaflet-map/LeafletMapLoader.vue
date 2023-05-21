
<template>
  <div
    :class="{
      '[&_.leaflet-tile-pane]:saturate-[.3]': !props.darkMode,
      '[&_.leaflet-tile-pane]:grayscale [&_.leaflet-tile-pane]:invert [&_.leaflet-tile-pane]:brightness-90 [&_.leaflet-tile-pane]:hue-rotate-15':
        props.darkMode,
    }"
  >
    <div ref="mapRef" class="w-full h-full"></div>
  </div>
</template>

<script setup>

import { initializeMap } from "./leaflet-map-loader";
import { ref, onMounted } from "vue";

const mapRef = ref();

const props = defineProps(['darkMode','init']);

onMounted(() => {
  
  props.init((mapConfig) => {
    if (mapRef.value) {
      return initializeMap(mapRef.value, mapConfig);
    }
  });
});

</script>
