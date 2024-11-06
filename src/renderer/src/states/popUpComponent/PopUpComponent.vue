<script setup lang="ts">
import { popUpComponents,closePopUpComponent } from './popUpComponent';


</script>
<template>
    <div class="pop-up-components" v-for="item of popUpComponents">
        <component :is="item.component" :key="item.popUpComponentKey" :closePopUpSelf="()=>closePopUpComponent(item.popUpComponentKey)" v-bind="item.data"></component>
    </div>
</template>
<style scoped>
.pop-up-components {
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>