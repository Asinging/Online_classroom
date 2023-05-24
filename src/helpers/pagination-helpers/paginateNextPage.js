import store from '@/store';
export function paginateNextPage(value) {
   return new Promise((resolve, reject) => {
      let { currentPage, total, perPage } = value.pages;
      let responseMetaObject = value.responseObject.meta;
      let currentPageFromServer = responseMetaObject.current_page;
      let lastPageFromServer = responseMetaObject.last_page;
      let serverPayload = value.serverPayload;

      if (currentPage * perPage >= total && currentPageFromServer < lastPageFromServer) {
         // let serverPayload = {
         //    channelId: value.channelId,
         //    page: currentPageFromServer + 1
         // };
         store
            .dispatch(`${value.storeDispatchString}`, serverPayload)
            .then(res => {
               if (res) {
                  let arrConc = res.data.concat(value.tableData.data);
                  value.tableData.data = arrConc;
                  resolve({
                     responseObject: res,
                     tableData: value.tableData
                  });
               }
            })
            .catch(err => {
               reject(err);
            });
      }
      else {
         resolve(false);
      }
   });
}
