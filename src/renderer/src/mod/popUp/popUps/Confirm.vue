<!-- 确认弹出框 -->
<script setup lang="ts">
import UniversalButton from '@renderer/components/UniversalButton.vue';

const props = defineProps<{
    title: string;
    content: string;
    confirm: () => void;
    cancel: () => void;
}>();

</script>
<template>
    <div class="confirm-box">
        <div class="confirm-box-title">{{ props.title }}</div>
        <div class="confirm-box-content">{{ props.content }}</div>
        <div class="confirm-box-buttons">
            <UniversalButton type="ok" text="确定" @click="props.confirm" />
            <UniversalButton type="other" text="取消" @click="props.cancel" />
        </div>
    </div>
</template>
<style scoped>
.confirm-box {
    background-color: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    min-width: 15rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.confirm-box-title {
    font-size: 1.2rem;
    font-weight: bolder;
    color: var(--confirm-box-title-color);
}

.confirm-box-content {
    font-size: 1rem;
    color: var(--confirm-box-content-color);
}

.confirm-box-buttons {
    display: flex;
    gap: 1rem;
}

</style>