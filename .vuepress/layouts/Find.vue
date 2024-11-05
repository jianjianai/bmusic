<script setup lang="ts">
import MusicCaedGroup from '../components/MusicCaedGroup.vue';
import { Music } from '../findMain';
import MusicLIstCardGroup from '../components/MusicLIstCardGroup.vue';

const music: Music = {
    "iconUrl": "data:image/webp;base64,UklGRr4KAABXRUJQVlA4WAoAAAAgAAAAfwAAfwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgg0AgAALAtAJ0BKoAAgAA+zVKjS6ekoyGulP8Q8BmJYgC7M99WDK807Pvxkdeq4yMXKAAD1uu9uq1omlw1zTqzHVuF75/Ev/JSk4d5kSEur2TGNAoQyZqsn+/kWb0v0hLnd9xeEialWcQ0jb3dhIkuDfM5+tCUp19B2rabQzHwAKgOf7ICRvDOUe9kw6XJJw9K3c6XxfgEA050U023QQZ3D8FUbTEa8/Wp3u7xFrU+Qld5s+Fflcqgp5ks0rAfEIsMoXIZclu/VYWVSuOammsA/wJbmyZYb+VrGcL7ZdMtG/CO7TT6HsnOiv2Mzp+oyDnTJk7ugZMvMtzEvI/mUwaAAtYIb3ZBkgQzzEPPBH3YJGs2qyGR/LFj+xvGlTr07JoM58emKccD/0BCbIdB6Kv+3wphoSQxAMq2Nv4kY2OVm/Qe8OtXCyfUTms0bVD+kiUzeaMDGyOkdqjZPeob1m/TN10Df3bae8STaeCrQP0Bu9aKduIY+ctKu+rgAP77aA95K431otn4tVUC8vAlvTPCFfjaFNkscTwU7p0aMDS92yiqnZPzCFOrWv1hEnmOugilu/enNBX6IEy/kB7EUdbRdBGrj9pS/lIn/JWUn2KlkaYoqHlElDn4ziia3J9IkZMloNoXU0xZ8tEPuM6QZx7RuSI4n7DHgjQBRes4NofI4JYnzEaW2jnRfDB13VDcM5ybyeq+00jDUSTmbR2mB5uwG/vOyd+DYBRgzvyZH1fJ75oRVbtSgQqexR5qnmK6IuF4JaXntSQ/AvjpeMRvSDVsVH8R3L6kWu7jdENX+LrI62OrcUuN5xwt4h4l+20VgsRNh/D1jazVQlfoVtzRp3uV5fR/yg4z7l+J0r9Ow7TbN2s7/fB6CsRJDjgHxJv1R1bB7HZSxKt4bhT4WQEZweR8Qs7GugtpIjiiEgji00efSvBfEMRibuEaMMlcCg0AKrmWqB6SeZre4EBcPGdok5A8+RcioHc5QEFC/ZX6pIEYiRPPCBMfYhdfjT9srorz8I8on9mWMt3cUbmMF6+zQ0wDsKKMlH/vWrub9TymGdMQs6cEUMAwNCSMcTdw1M06ca2XCdEEpVVB4WIDWmzsRgt0PCLg2f2eqF9O/cJFKZJBovCCT4V503HlO6VnYORFG4EXtpPXiA/PqBwuE0JZFQSrGg2tTLGfh1gTzN8CeDU17pO/8nQzXCYDv6FTxpfXaTYNNVGf+b6JXp+NvU7ok8of2+fWm8ovLo9pS3WZKK67CcRtiB7dV78JvlmO+Dejz4a9hBwS0p1aJ1eF0Xvq0805LyGqDMmNKRgSW2/vnBUBBU6T/OcHAjuorsqdTt+8muouK0JZENtmwZAZTVpOLvvHWbiN+avJp9OWPY/pziFmRh3Mvxt7opjqb0Xl9lm7N1YtH03Aab/U9KK2krCD3Hk4OIFor/SVZRtGIC0Ss5TQB9R1IFpdgNKr15NkI9djOGFZQ+FbtB92tDvCcPfrv0TWk255XSdG6NLouXwOpsGuIHVPa7R0uS25XA2zo4segl+JEanTLTMq0Kotbu/ZrkfSsZChiaziGOc4zXxQ699rvw2yKh9JhagUKEvBDemlP8UXq+caW+H72mycYk5xusnKTx+1vrkw2BNY0W1mmHp164t8fQmvyn2thPuli6wMamMd71snWNWenjZ+cqtemyrux2g/WjnIU4AuzNj+Y3Fgvn3PgBg7WYp3xi4AkbGHBKsKE69+QhxFxs0qp8HpWoCsVhtsmkpqcdHqzYKcJHuWCghWTeo2fuQc+KDm4UlnzLhGuOlFKsO+RbJa5aOGwSY1JeMPIGokW/gzV2+jEQvoo864G6b8Y0u9jKDoikdAVBqZ6uEHtC9IiAFawEThzy2C3jdf55a8HjLPHEF6T/1obdca0nEGCSsUIdlgQwqovHDvMSNqq9coOgESgxGLVhQvRaf7WPVwIvwXH78h1xswJpmDKTpqriYYR9SMPMd2JQuuFsQNplzN4cwOZUTRosjt4wrfFftg4hLIbe5q4QiuGN3+IUwpntUxdTuFK1H84GjUsBBzxynIJ8Gu2KgKeKpjXab5Awp31J5cgfAW9Q1aR8SmCEsTDNKavqLyrcSHyFtZtkwBrVCxZWRBjaRSPmn2D55h0G8M3kYvGSXCwqeYmJenPKXqTjEsO5ot121s7/St4kevextGtKvpXM+V8YU7eC7Fn4wVl4Hh9wG+uBxh/jBdRMYapRwAB59BByV1M/R6vRGLmJYwAL3uxHdPhIQppxNao3VjXLWz7CVIFFG45ST9bs/lShtt7791bDheWijejPfkw/5Nr5HRYKz84NHe3RQv5SpocfG+SW5zcF3hVzOyR8z46Qo2A7Fz2ojzjvh3/aGNnilncc6DO9Ylq5ydrKDlGox+dnERCnNiLtxIPg+MrJNymI8skgeXzzgxCxogKoe6R/p/OOtbujWwGeLaxfsh/5lFlFhT9vo9PHVXntPLdeuJH4kCHq3MzdvskI/IahXi7uXcvbtuY3HFNdhu7mUa+Md6bSVR+hCae7auKiCAtqCjP6gWOS/3iMABprEcNF165gtQf2fTAKlf92ns6l93aq8OegtGoG9DyQ1uDyd+wpD+jPcJge318tlygcB4RGetfu3Co0Y3SUNhZIQkE7oB1EZQboJrWz3dgFk0imjLj2tPQQ4uJjyU2aCwAS0E+DlriPsUoi+RNd656XsYNrR/WAqtsLYiDgoVwl/e0/GR2SwgdPdlwmRJaPQ6wCNptUbCIfcJm/5IImd/4cj/S9XX5nNEjxnNbG3/QoaDuxY3FsFVQiwTTt2dEz+KyPFsylAMo9OFKkhdvfNmKJoHLi909zeAPCNsEwtjawK89pMcqzQPIVmj22bkZKui5+xgVgWRsQfXm95DVHgWmshjoMyh44sZxtkF7enBBNamNK047l2FIHvhGxaV42oE9crfCdwGBxx49f6e8Pvbnp5GSrVySUttcolCR3dqhUZBcnV7adP8nuknR6J+/aGDWZOwGITIAA==",
    "musicName": "【小马宝莉/自制动画/寿命论】𝑳𝒐𝒔𝒆 𝒀𝒐𝒖 𝑵𝒐𝒘",
    "musicAuthor": "LUMO_Xu",
    "playerName": "Bilibili",
    "playerData": "{\"bvId\":\"BV1ST421k7RS\"}"
};
const musicList = {
    name: "精选推荐单曲",
    iconUrl: "file:///C:/Users/Administrator/Pictures/20200329103701_kvbqx.jpg",
    description: "这里是精选推荐单曲",
    author: "小马宝莉",
    authorIconUrl: "file:///C:/Users/Administrator/Pictures/20200329103701_kvbqx.jpg",
    list: [music, music, music, music, music, music]
}

</script>
<template>
    <div class="find-main">
        <MusicLIstCardGroup title="精选推荐歌单" :list="[musicList,musicList,musicList,musicList,musicList,musicList,musicList]"></MusicLIstCardGroup>
        <MusicCaedGroup title="精选推荐单曲" :list="[music, music, music, music, music, music]" />
    </div>
</template>
<style scoped>
.find-main {
    padding: 0 1rem;
}
</style>