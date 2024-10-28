<script lang="ts" setup>
import { contentDisplay } from '../states/contentState';

</script>
<template>
    <div class="content">
        <component :is="contentDisplay"></component>
    </div>
</template>
<style scoped>

</style>