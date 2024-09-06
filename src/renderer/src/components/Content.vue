<script lang="ts" setup>
import { ContentState } from '../states/ContentState';

</script>
<template>
    <div class="content">
        <component :is="ContentState.displayComponent"></component>
    </div>
</template>
<style scoped>

</style>