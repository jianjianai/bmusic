# APIDOC

## 播放音乐

### 播放单独音乐
``` ts
import { musicPlayer } from '@renderer/states/musicPlayerStates'
musicPlayer.setCurrentMusic({
    musicName: "测试音乐",
    musicAuthor: "测试作者",
    playerName: "BilibiliMusicPlayer",
    playerData: `{"bvId":"BV19G411H7DY"}`
});
```

### 播放音乐列表
``` ts
import { playList } from '@renderer/states/playListState';
// 设置播放列表
playList.setList([
    {
        musicName: "bilibili测试音乐1",
        musicAuthor: "测试作者",
        playerName: "BilibiliMusicPlayer",
        playerData: `{"bvId":"BV19G411H7DY"}`
    },
    {
        musicName: "bilibili测试音乐2",
        musicAuthor: "测试作者",
        playerName: "BilibiliMusicPlayer",
        playerData: `{"bvId":"BV1eU4y1X7uA"}`
    }
]);
playList.setCurrentIndex(0); // 设置当前播放的音乐索引
```