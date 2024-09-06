import { reactive } from "vue";

export const MusicPlayerState = reactive<{
    size:"buttom" | "max"
}>({
    size:"buttom"
});