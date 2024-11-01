<script setup lang="ts">
import UniversalInput from '@renderer/components/allSmall/UniversalInput.vue';
import { BilibiliMusicData, paresBilibiliMusicData, paresBilibiliMusicDataToString } from './bilibiliMusic';
import { ref, watch } from 'vue';


const model = defineModel<string>("playerData", { required: true });
const refEditData = ref<BilibiliMusicData>(paresBilibiliMusicData(model.value));

// 示例: 不需要，因为新的音乐会重新加载新组件
// watch(model,(newVal)=>{
//   refEditData.value = paresBilibiliMusicData(newVal);
// });

watch(refEditData,(newVal)=>{
  model.value = paresBilibiliMusicDataToString(newVal);
},{deep:true});



</script>
<template>
  <div class="from">
    <div class="from-line">
      <div class="from-line-title">BV号:</div>
      <UniversalInput  placeholder="BV号" class="from-line-content-input" v-model="refEditData.bvId" />
    </div>
  </div>
</template>
<style scoped>
.from-line-content-input {
  height: 2rem;
}

.from-line {
  display: flex;
  gap: 1rem;
}

.from-line-title {
  line-height: 2rem;
}

.from {
  display: flex;
  flex-direction: column;
  width: min(100% - 11rem, 45rem);
  gap: 1rem;
}
</style>
