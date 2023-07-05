export const checkIframe = item => {
   if (!item || !item.video_url) return false;
   let str = item.video_url;

   let arr = str.split(' ');

   if (arr.length < 2) {
      item.video_url = _itemManipulate(item.video_url);
      return item;
   }
   arr = arr
      .filter(item => {
         return !item.includes('height') && !item.includes('width');
      })
      .map(item => {
         if (item.includes('src')) {
            return _itemManipulate(item);
         }
         return item;
      });
   arr.splice(2, 0, 'width="1200"');
   str = arr.reduce((prev, curr) => {
      return prev + ' ' + curr;
   });
   item.isIframe = true;
   item.video_url = str;
   return item;
};

const _itemManipulate = item => {
   let arr = item.split('/');
   let lastEle = arr.slice(-1)[0];

   lastEle = lastEle.replace(/\"/g, '?rel=0');

   arr.splice(arr.length - 1, 1, lastEle);
   let str = arr.reduce((prev, ele) => prev + '/' + ele);

   return str;
};
