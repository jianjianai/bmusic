import { ipcRenderer } from 'electron';

async function doLoadNetworkImage(img: HTMLImageElement): Promise<string> {
    const targetWidth = 128;
    const targetHeight = 128;
    return new Promise<string>((resolve, reject) => {
        const load = () => {
            try {
                // 新建画布
                const canvas = document.createElement('canvas')
                // 画布大小与图片一致
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 2D 画布将图片绘制上去
                const ctx = canvas.getContext('2d')
                // 计算缩放比例
                const scale = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
                const scaledWidth = img.naturalWidth * scale;
                const scaledHeight = img.naturalHeight * scale;

                // 计算居中偏移量
                const offsetX = (targetWidth - scaledWidth) / 2;
                const offsetY = (targetHeight - scaledHeight) / 2;

                // 绘制缩放并居中的图片
                ctx!.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
                resolve(canvas.toDataURL('image/webp', 0.5));
            } catch (e) {
                reject(e);
            }
        }
        img.loading = "eager";
        img.crossOrigin = 'Anonymous';
        if (img.complete) {
            load();
        } else {
            img.addEventListener('load', load);
            img.addEventListener('error', reject);
        }
    });
}

window.addEventListener('load', async () => {
    console.log("BilibiliMusicSearch preload loaded");
    const wraps = document.querySelectorAll(".search-page>.video-list>.video-list-item>.bili-video-card>.bili-video-card__wrap");
    const items: Promise<{ bv: string, imgUrl?: string, name?: string, author?: string }>[] = [];
    for (const wrap of wraps) {
        const urlA = wrap.querySelector("a");
        const img = wrap.querySelector("a picture img") as HTMLImageElement;
        const titleH3 = wrap.querySelector("h3") as HTMLImageElement;
        const authorSpan = wrap.querySelector("p a span") as HTMLImageElement;

        const url = urlA?.href;
        if (!url) {
            continue;
        }
        const exec = /https?:\/\/www\.bilibili\.com\/video\/([0-9A-Za-z]+)\/?/.exec(url);
        if (!exec) {
            continue;
        }
        const bv = exec[1];
        items.push(doLoadNetworkImage(img).then(imgUrl => ({
            bv: bv,
            imgUrl: imgUrl,
            name: titleH3?.innerText,
            author: authorSpan?.innerText
        })));
    }
    ipcRenderer.sendToHost("searchResult", await Promise.all(items));
});
