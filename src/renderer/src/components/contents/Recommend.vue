<script lang="ts" setup>
import { ref } from 'vue';
import LoadingSvg from '@renderer/svg/Loading.vue';

const iframeLoading = ref(true);

</script>
<template>
    <div class="recommend">
        <div v-if="iframeLoading" class="loading">
            <LoadingSvg class="loading-icon" />
        </div>
        <iframe class="recommend-iframe" frameborder="no" src="http://localhost:8080/find/" @load="iframeLoading = false"></iframe>
    </div>
</template>
<style scoped>
.loading-icon{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 5rem;
    height: 5rem;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.loading{
    position: relative;
    flex: 9;
}
.recommend-iframe{
    flex: 1;
    height: 0;
}
.recommend {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>