<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';
import { type MusicPlayerLink } from '../musicPlayers';
import { EmoMusicData, paresEmoMusicData } from './emoMusic';
import { song_url_v1, SoundQualityType } from "./emoApi";
import ImgDiv from '@renderer/components/ImgDiv.vue';
import colorthief from 'colorthief';
import MusicList from '@renderer/components/allSmall/MusicList.vue';

const props = defineProps<{
    musicPlayerLink: MusicPlayerLink,
}>();

const the_song = ref<string>('');
const musicPlayerLink = props.musicPlayerLink;
const musicData: Ref<EmoMusicData> = computed(() => paresEmoMusicData(musicPlayerLink.currentMusicData));


song_url_v1({ id: musicData.value.id, level: SoundQualityType.standard }).then((res) => {
    musicPlayerLink.updateDuration(res.body.data[0].time);
    let songs = res.body.data[0].url
    the_song.value = songs;
});

const playing = ref(true);
const the_url = ref<HTMLImageElement | null>(null);

musicPlayerLink.updateContrMaxDisplay({
    type: 'fixe',
    progressShow: 'top',
    isShwoNusicName: false,
});

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

const c1 = ref("");
const c2 = ref("");
// const c3 = ref("");

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

    // 实现背景色的渐变
    const colorThief = new colorthief();
    const colors = colorThief.getPalette(the_url.value, 2);
    const [c11, c22] = colors!.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`) // 解构出三组rgb
    c1.value = c11;
    c2.value = c22;
})

musicPlayerLink.updateButtomWidth("5.5rem");

</script>
<template>
    <div class="all">
        <audio :src="the_song" ref="audio"></audio>
        <img class="main" :class="[{ playing: playing }, musicPlayerLink.musicPlayerSize]"
            :src="musicPlayerLink.currentMusic?.iconUrl" ref="the_url">
        </img>
        <div v-if="musicPlayerLink.musicPlayerSize == 'max'" class="max-paper">
            <div class="big-left">
                <span class="song_name">{{ musicPlayerLink.currentMusic?.musicName }}</span>
            </div>
        </div>
    </div>

</template>
<style scoped>
.big-left{
    height: 100%;
    padding-left: 29rem;
    white-space: nowrap;
}

.all {
    width: 100%;
    height: 100%;
}
.main.max{
    width: 20rem;
    height: 20rem;
    left: 5rem;
    top: calc(50% - 10rem);
}

.main {
    border: 10px solid black;
    /* Add a black border */
    box-sizing: border-box;
    /* Ensure the border is included in the element's total width and height */
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    animation: rotate 15s linear infinite;
    animation-play-state: paused;
    position: absolute;
    left: 1.7rem;
    top: calc(50% - 2rem);
    transition: all 0.5s;
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
    background: linear-gradient(to bottom, v-bind("c1"), v-bind("c2"));
    ;
    /* display: flex;
    align-items: center;
    justify-content: center; */
}
</style>
