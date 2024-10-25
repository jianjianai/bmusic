<script lang="ts" setup>
import { contentState } from '../states/contentState';

</script>
<template>
    <div class="content">
        <component :is="contentState.display"></component>
    </div>
</template>
<style scoped>

</style>