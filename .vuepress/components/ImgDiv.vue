<!-- 图片显示div -->
<script lang="ts" setup>
defineProps<{
    src?: string
}>();
</script>
<template>
    <div :style="`background-image: url(${src});`">
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
    background-color: rgba(234, 114, 49, 0.111);
}
</style>