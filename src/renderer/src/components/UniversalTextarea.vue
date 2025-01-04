<script lang="ts" setup>
const model = defineModel<string>();
    const props = defineProps<{
    placeholder?: string;
}>();
const id = Math.random().toString(36).slice(2);

</script>
<template>
    <label class="universal-input" :for="id">
        <textarea class="universal-input-input" :id="id" type="text" v-model="model" :placeholder="props.placeholder"></textarea>
    </label>
</template>
<style scoped>
.universal-input:has(.universal-input-input:focus) {
    border-color: var(--universal-input-border-color-focus);
}

.universal-input {
    flex: 1;
    width: 0;
    display: flex;
    align-items: stretch;
    padding: 0.2rem 0.5rem;
    border: 0.1rem solid var(--universal-input-border-color);
    border-radius: 0.5rem;
    background-color: var(--universal-input-bg-color);
    cursor: text;
}

.universal-input-input {
    flex: 1;
    color: var(--universal-input-color);
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    resize: none;
    outline: none;
    font-size: 0.9rem;
    font-family: auto;
}
</style>