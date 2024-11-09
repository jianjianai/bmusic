<!-- 喜欢按钮 -->
<script lang="ts" setup>
import IcFavoriteBorderSvg from '@renderer/components/svg/IcFavoriteBorder.vue';
import IcFavoriteSvg from '@renderer/components/svg/IcFavorite.vue';
import { useLikeedPlayList } from '@renderer/storage/playListStorage';
import { Music } from '@renderer/mod/playing/playing';
const likeedPlayList = useLikeedPlayList();
const props = defineProps<{
    music: Music
}>();

</script>
<template>
    <div title="喜欢" class="like" v-if="likeedPlayList!.hasMusic(props.music)" @click="likeedPlayList!.removeMusic(props.music);likeedPlayList?.save()">
        <IcFavoriteSvg class="favorite-icon-liked" />
    </div>
    <div title="喜欢" class="like" v-else @click="likeedPlayList!.addMusic(props.music);likeedPlayList?.save()">
        <IcFavoriteBorderSvg class="favorite-icon" />
    </div>
</template>
<style scoped>
.like {
    position: relative;
    cursor: pointer;
}

.favorite-icon-liked,
.favorite-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-pay-list-favorite-icon);
}
.favorite-icon:hover {
    color: var(--color-pay-list-favorite-icon-hover);
}

.favorite-icon-liked {
    color: var(--color-pay-list-favorite-icon-liked);
}
.favorite-icon-liked:hover {
    color: var(--color-pay-list-favorite-icon-liked-hover);
}
</style>