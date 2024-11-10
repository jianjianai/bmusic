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
const ul = ref<HTMLUListElement | null>(null);
// const container = ref<HTMLDivElement | null>(null);

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
    console.log(findIndex());
    audio.value!.currentTime = currentTime / 1000;
});

const c1 = ref("");
const c2 = ref("");


onMounted(() => {
    audio.value!.addEventListener('timeupdate', () => {
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
})

// 左下框的宽度
musicPlayerLink.updateButtomWidth("5.5rem");

// 获取歌词
const parsedLyrics = ref<ReturnType<typeof parseYrc>>([]);
lyric({ id: musicData.value.id }).then((res) => {
    parsedLyrics.value = parseYrc(res.body.lrc.lyric);
    console.log(parsedLyrics.value);
});


// findIndex
function findIndex() {
    let currentTime = audio.value!.currentTime;
    for (let i = 0; i < parsedLyrics.value.length; i++) {
        if (parsedLyrics.value[i].time > currentTime) {
            return i - 1;
        }
    }
    // 歌词的最后一句
    return parsedLyrics.value.length - 1;
}

// 创建li元素
function createLiElement() {
    const flag = document.createDocumentFragment();
    for (let i = 0; i < parsedLyrics.value.length; i++) {
        const li = document.createElement('li');
        li.textContent = parsedLyrics.value[i].text;
        console.log(li.textContent);
        flag.appendChild(li);
    }
    ul.value!.appendChild(flag);
}

watch(() => musicPlayerLink.musicPlayerSize, () => {
    if (musicPlayerLink.musicPlayerSize == 'max') {
        nextTick(() => {
            createLiElement();
        })
    }
})

const container = document.getElementById('song-context');
const containerHeight = container?.clientHeight;
const liHeight = ul.value?.children[0].clientHeight;
const maxOffset = ul.value && containerHeight ? ul.value.clientHeight - containerHeight : 0;

// offset
function setOffset() {
    const index = findIndex();

    // 正常情况下的偏移量
    let offset = liHeight! * index + liHeight! / 2 - containerHeight! / 2;

    // 最小offset
    if (offset < 0) offset = 0;

    // 最大offset
    if (offset > maxOffset) offset = maxOffset;

    ul.value!.style.transform = `translateY(-${offset}px)`;

    //消除之前的active
    const li = ul.value!.querySelector('.active');
    if (li) li.classList.remove('active');

    ul.value!.children[index].classList.add('active');
}

audio.value?.addEventListener('timeupdate', setOffset);
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
                    <div id="song-context">
                        <ul ref="ul">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
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
