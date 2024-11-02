<script lang="ts" setup>
import { contentDisplay, contentData } from '../states/contentState';

</script>
<template>
    <div class="content">
        <component :is="contentDisplay" v-bind="contentData"></component>
    </div>
</template>
<style scoped>
.content{
    padding-top: var(--top-bar-height);
}
</style>