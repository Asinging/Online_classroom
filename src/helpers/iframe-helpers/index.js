export const checkIframe = item => {
    if (!item || !item.video_url) return false;
    let str = item;
    let arr = str.video_url.toString().trim().split(' ');

    if (arr.length < 2) {
        return item;
    }
    item.isIframe = true;
    return item;
};