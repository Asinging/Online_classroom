import store from 'srcsss/store';

export function changePerPageChange(val) {
    return new Promise((resolve, reject) => {
        let { currentPerPage, tableTotal } = val.perPage;
        let responseMetaObject = val.responseObject.meta;
        let currentPageFromServer = responseMetaObject.current_page;
        let lastPageFromServer = responseMetaObject.last_page;

        if (parseInt(currentPerPage) >= tableTotal && currentPageFromServer < lastPageFromServer) {
            let serverPayload = val.serverPayload;
            store
                .dispatch(`${val.storeDispatchString}`, serverPayload)
                .then(res => {
                    if (res) {
                        val.tableData.data.unshift(res.data);
                        resolve({
                            responseObject: res,
                            tableData: val.tableData
                        });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            resolve(false);
        }
    });
}