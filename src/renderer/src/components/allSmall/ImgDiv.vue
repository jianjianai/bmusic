<script lang="ts" setup>
import { LOGO_URL } from '@renderer/imageUrls';

defineProps<{
    src?: string
}>();
</script>
<template>
    <div :style="`background-image: url(${src || LOGO_URL});`">
        <slot></slot>
    </div>
</template>
<style scoped>
div {
    background-position: center;
    background-size: cover;
    overflow: hidden;
    width: 2rem;
    height: 2rem;
}
</style>