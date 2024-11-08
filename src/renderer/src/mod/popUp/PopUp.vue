<script setup lang="ts">
import { popUpComponents, closePopUpComponent } from './popUp';


</script>
<template>
    <TransitionGroup name="list">
        <div class="pop-up-components" v-for="item of popUpComponents" :key="item.popUpComponentKey">
            <component :is="item.component" :closePopUpSelf="() => closePopUpComponent(item.popUpComponentKey)"
                v-bind="item.data"></component>
        </div>
    </TransitionGroup>
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

.list-enter-active,
.list-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10%);
}
</style>