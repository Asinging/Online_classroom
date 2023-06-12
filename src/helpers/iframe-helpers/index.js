export const checkIframe = item => {
   if (!item || !item.video_url) return false;
   let str = item.video_url.trim();

   let arr = str.split(' ');

   if (arr.length < 2) {
      return item;
   }

   arr = arr.filter(item => {
      return !item.includes('height') && !item.includes('width');
   });
   arr.splice(2, 0, 'width="1200"');
   str = arr.reduce((prev, curr) => {
      return prev + ' ' + curr;
   });
   debugger;
   item.isIframe = true;
   item.video_url = str;
   return item;
};
