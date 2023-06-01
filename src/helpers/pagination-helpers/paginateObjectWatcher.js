import store from 'srcsss/store';
export function paginationResponseObjectWatcher(val) {
    return new Promise((resolve, reject) => {
        let watch = val.watch;
        let currentPageFromServer = watch.meta.current_page;

        let lastPageFromServer = watch.meta.last_page;
        let serverPayload = val.serverPayload;

        if (val.tableData.data.length > val.pageLength) {
            return reject(false);
        }
        if (val.pageLength >= watch.meta.per_page && currentPageFromServer < lastPageFromServer) {
            store
                .dispatch(
                    `${val.storeDispatchString}`,
                    serverPayload
                    // {
                    //    channelId: val.channelId,
                    //    page: currentPageFromServer + 1
                    // }
                )
                .then(res => {
                    if (res) {
                        let arrConc = res.data.concat(val.tableData.data);
                        val.tableData.data = arrConc;
                        resolve({
                            responseObject: res,
                            tableData: val.tableData
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        } else {
            resolve(false);
        }
    });
}