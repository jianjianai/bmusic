<script setup lang="ts">
import { computed, nextTick, onMounted, ref, Ref, watch } from 'vue';
import { type MusicPlayerLink } from '../musicPlayers';
import { EmoMusicData, paresEmoMusicData } from './emoMusic';
import { song_url_v1, SoundQualityType, lyric } from "./emoApi";
import colorthief from 'colorthief';
import { parseYrc } from '@lrc-player/parse';
import Lyrics from './Lyrics.vue';

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
const audio = ref<HTMLAudioElement | null>(null);
// const ul = ref<HTMLUListElement | null>(null);
// const container = ref<HTMLDivElement | null>(null);

musicPlayerLink.updateContrMaxDisplay({
    type: 'fixe',
    progressShow: 'top',
    isShwoNusicName: false,
    extraClass: 'emo-music-player-max-extra',
});

// 播放
musicPlayerLink.onRequestPlay(() => {
    audio.value?.play();
});

// 暂停
musicPlayerLink.onRequestPause(() => {
    audio.value?.pause();
});
// 设置音量
musicPlayerLink.onRequestVolume((volume: number) => {
    audio.value!.volume = volume;
});

// 播放当前位置
musicPlayerLink.onRequestCurrentTime((currentTime: number) => {
    // findIndex();
    // console.log(findIndex());
    audio.value!.currentTime = currentTime / 1000;
});

const c1 = ref("");
const c2 = ref("");

const currentTime = ref(0);
onMounted(() => {
    audio.value!.addEventListener('timeupdate', () => {
        currentTime.value = audio.value!.currentTime;
        musicPlayerLink.updateCurrentTime(audio.value!.currentTime * 1000);
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
    scrollToCurrentLyric();
})

// 左下框的宽度
musicPlayerLink.updateButtomWidth("5.5rem");


//-----------------------------------歌词-----------------------------------
// 获取歌词
const parsedLyrics = ref<ReturnType<typeof parseYrc>>([]);
lyric({ id: musicData.value.id }).then((res) => {
    parsedLyrics.value = parseYrc(res.body.lrc.lyric);
    console.log(parsedLyrics.value);
});
const currentIndex = computed(() => {
    for (let i = 0; i < parsedLyrics.value.length; i++) {
        if (parsedLyrics.value[i].time > currentTime.value) {
            return i - 1;
        }
    }
    // 歌词的最后一句
    return parsedLyrics.value.length - 1;
});

const scrollToCurrentLyric = () => {
    const currentLyricElement = document.querySelector('.li_son.color_or_fontsize');
    if (currentLyricElement) {
        currentLyricElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

watch(currentIndex, () => {
    scrollToCurrentLyric();
});

</script>
<template>
    <div class="all">
        <audio :src="the_song" ref="audio"></audio>
        <img class="main" :class="[{ playing: playing }, musicPlayerLink.musicPlayerSize]"
            :src="musicPlayerLink.currentMusic?.iconUrl" ref="the_url">
        </img>
        <div v-if="musicPlayerLink.musicPlayerSize == 'max'" class="max-paper">
            <div class="big-left">
                <div class="song_left">
                    <div>
                        <div class="song_name">
                            {{ musicPlayerLink.currentMusic?.musicName }}
                        </div>
                        <div class="song_infor">
                            <div>
                                专辑: {{ musicData.album }}
                            </div>
                            <div>
                                歌手: {{ musicPlayerLink.currentMusic?.musicAuthor }}
                            </div>
                        </div>
                    </div>
                    <div id="song-context" class="div_dad">
                        <ul class="ul_dad">
                            <li v-for="text, index of parsedLyrics" class="li_son"
                                :class="{ 'color_or_fontsize': currentIndex == index }">
                                {{ text.text }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.li_son.color_or_fontsize {
    color: white;
    font-size: 1.5rem;
    transition: color 0.3s, font-size 0.3s;
}

.li_son {
    font-size: 1rem;
    transition: color 0.3s, font-size 0.3s;
    color: gray;
}

.div_dad {
    overflow: scroll;
    height: 25rem;
    scrollbar-width: none;
}

.ul_dad {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    gap: 1rem;
}

.song_infor {
    font-weight: bold;
    display: flex;
    gap: 0.8rem;
    color: gray;
    margin-top: 0.7rem;
    font-size: 0.9rem;
}

.song_name {
    color: rgb(236, 236, 236);
    font-size: 1.5rem;
}

.big-left {
    height: 100%;
    padding-left: 29rem;
    white-space: nowrap;
    display: flex;
    align-items: center
}

.all {
    width: 100%;
    height: 100%;
}

.main.max {
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
    transition: all 0.25s;
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
<style>
.emo-music-player-max-extra {
    --color-primary-button-small: #ffffff7f;
    --color-primary-button-small-hover: #ffffffa6;

    /* 播放器左下角按钮颜色 */
    --color-music-player-user-button: var(--color-primary-button-small);
    --color-music-player-user-button-hover: var(--color-primary-button-small-hover);

    /* 播放器右下角按钮颜色 */
    --color-music-player-right-button: var(--color-primary-button-small);
    --color-music-player-right-button-hover: var(--color-primary-button-small-hover);

    /* 播放器暂停播放按钮颜色 */
    --color-contr-play-btn: #ffffff18;
    --color-contr-play-btn-hover: #ffffff3b;
    /* 中间文字颜色 */
    --color-contr-play-btn-text: #ffffff;
    /* 上一首和下一首按钮颜色 */
    --color-contr-prev-next-btn: var(--color-primary-button-small);
    --color-contr-prev-next-btn-hover: var(--color-primary-button-small-hover);
    /* 播放顺序按钮颜色 */
    --color-contr-play-mode-btn: var(--color-primary-button-small);
    --color-contr-play-mode-btn-hover: var(--color-primary-button-small-hover);
    /* 全部的喜欢按钮 */
    --color-pay-list-favorite-icon: var(--color-primary-button-small);
    --color-pay-list-favorite-icon-hover: var(--color-primary-button-small-hover);
    --color-pay-list-favorite-icon-liked: var(--color-primary);
    --color-pay-list-favorite-icon-liked-hover: var(--color-primary2);
}
</style>