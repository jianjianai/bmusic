<!-- 通用按钮 -->
<script lang="ts" setup>
import { type Component } from 'vue';


defineProps<{
    type: "ok" | "other",
    icon?: Component,
    text: string
}>();

</script>
<template>
    <div class="universal-button" :class="[type]">
        <component v-if="icon" :is="icon" class="universal-button-icon"></component>
        <div class="universal-button-text">{{ text }}</div>
    </div>
</template>
<style scoped>
.universal-button-text{
    font-size: 1em;
}
.universal-button-icon{
    width: 1.33em;
    height: 1.33em;
    margin-right: 0.2em;
}

.universal-button{
    cursor: pointer;
    padding: 0.5em 1em;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    font-size: 1rem;
    display: flex;
    align-items: center;
}

/* other */
.universal-button.other{
    color: var(--color-universal-button-other-text);
    background-color: var(--color-universal-button-other-bgc);
    border: 0.1rem solid var(--color-universal-button-other-border);
}

.universal-button.other:hover{
    background-color: var(--color-universal-button-other-bgc-hover);
}

/* ok */
.universal-button.ok{
    color: var(--color-universal-ok-butto-text);
    background-color: var(--color-universal-ok-button-bgc);
    border: 0.1rem solid var(--color-universal-ok-button-border);
}

.universal-button.ok:hover{
    background-color: var(--color-universal-ok-button-bgc-hover);
}

</style>