<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';
import { type MusicPlayerLink } from '../musicPlayers';
import { EmoMusicData, paresEmoMusicData } from './emoMusic';
import { song_url_v1, SoundQualityType } from "./emoApi";
import ImgDiv from '@renderer/components/allSmall/ImgDiv.vue';

const props = defineProps<{
    musicPlayerLink: MusicPlayerLink,
}>();

const the_song = ref<string>('');
const musicPlayerLink = props.musicPlayerLink;
const musicData: Ref<EmoMusicData> = computed(() => paresEmoMusicData(musicPlayerLink.currentMusicData));


song_url_v1({ id: musicData.value.id, level: SoundQualityType.standard }).then((res) => {
    console.log(res.body.data[0].size)
    musicPlayerLink.updateDuration(res.body.data[0].time);
    let songs = res.body.data[0].url
    the_song.value = songs;
});

// musicPlayerLink.updateDuration(20000);


const playing = ref(true);

// 播放
musicPlayerLink.onRequestPlay(() => {
    console.log('play');
    audio.value?.play();
});

// 暂停
musicPlayerLink.onRequestPause(() => {
    console.log('pause');
    audio.value?.pause();
});
// 设置音量
musicPlayerLink.onRequestVolume((volume: number) => {
    audio.value!.volume = volume;
});

// 播放当前位置
musicPlayerLink.onRequestCurrentTime((currentTime: number) => {
    audio.value!.currentTime = currentTime / 1000;
});


const audio = ref<HTMLAudioElement | null>(null);
onMounted(() => {
    audio.value!.addEventListener('timeupdate', () => {
        musicPlayerLink.updateCurrentTime(audio.value!.currentTime * 1000);
        console.log(audio.value!.currentTime);
    });
    audio.value!.addEventListener('ended', () => {
        musicPlayerLink.updatePlaying(false);
        musicPlayerLink.updateEnded(true);
        playing.value = false;
    });
    audio.value!.addEventListener('play', () => {
        musicPlayerLink.updatePlaying(true);
        musicPlayerLink.updateEnded(false);
        playing.value = true;
    });
    audio.value!.addEventListener('pause', () => {
        musicPlayerLink.updatePlaying(false);
        playing.value = false;
    });
    audio.value!.addEventListener('volumechange', () => {
        musicPlayerLink.updateVolume(audio.value!.volume);
    });
    audio.value!.addEventListener('canplay', () => {
        musicPlayerLink.updateLoading(false);
        audio.value?.play();
    });
    audio.value!.volume = musicPlayerLink.volume;

})

musicPlayerLink.updateButtomWidth("6rem")
</script>
<template>
    <div style="width: 100%;height: 100%;position: relative;">
        <audio :src="the_song" ref="audio"></audio>
        <ImgDiv class="main" v-if="musicPlayerLink.musicPlayerSize == 'buttom'" :class="{ playing: playing }"
            :src="musicPlayerLink.currentMusic?.iconUrl">
        </ImgDiv>
        <div v-else-if="musicPlayerLink.musicPlayerSize == 'max'" class="max-paper">
            放大状态
        </div>
    </div>

</template>
<style scoped>
.main {
    border: 10px solid black;
    /* Add a black border */
    box-sizing: border-box;
    /* Ensure the border is included in the element's total width and height */
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    animation: rotate 10s linear infinite;
    animation-play-state: paused;
    position: absolute;
    left: 1.7rem;
    top: calc(50% - 2rem);
}

.main img {
    width: calc(var(--button-player-height) - 4px);
    /* Reduce the image size to fit within the border */
    height: calc(var(--button-player-height) - 4px);
    border-radius: 50%;
}

.main.playing {
    animation-play-state: running;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.max-paper {
    width: 100%;
    height: 100%;
    background-color: #bf1212;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
