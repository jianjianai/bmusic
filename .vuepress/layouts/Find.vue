<script setup lang="ts">
import { recommends } from '../recommends';

</script>
<template>
    <div class="find-main">
        <component v-for="item of recommends" :is="item.display" v-bind="item.data"></component>
    </div>
</template>
<style scoped>
.find-main {
    padding: 0 1rem;
}
</style>