<script lang="ts" setup>
import IcFavoriteBorderSvg from '../svg/IcFavoriteBorder.vue';
import IcFavoriteSvg from '../svg/IcFavorite.vue';
import { useLikeedPlayList } from '@renderer/states/playListStorage';
import { Music } from '@renderer/states/musicPlayerStates';
const likeedPlayList = useLikeedPlayList();
const props = defineProps<{
    music: Music
}>();

</script>
<template>
    <div class="like" v-if="likeedPlayList.isLikeed(props.music)" @click="likeedPlayList.removeLikeed(props.music)">
        <IcFavoriteSvg class="favorite-icon-liked" />
    </div>
    <div class="like" v-else @click="likeedPlayList.addLikeed(props.music)">
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
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-pay-list-favorite-icon);
}

.favorite-icon-liked {
    color: var(--color-pay-list-favorite-icon-liked);
}
</style>