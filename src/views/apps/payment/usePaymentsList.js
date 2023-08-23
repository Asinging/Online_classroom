import { ref, watch, computed, onBeforeMount } from '@vue/composition-api';
import store from '@/store';
import { title } from '@/@core/utils/filter';

// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

import { paginateCounteFromOne, countFromOne } from '@/helpers/number-helpers/numberIndex';
import { paginate } from '@/helpers/pagination-helpers/generalPagination';
import router from '@/router';
import Swal from 'sweetalert2';
import { serverTimestamp } from "firebase/firestore";
import { getAuth, deleteUser } from 'firebase/auth';
const auth = getAuth();

import { useRoute } from 'vue-router';

export default function useUsersList() {
    // Use toast
    const toast = useToast();
    const showLoading = ref(true);

    const responseObject = ref(null);

    const refPaymentListTable = ref(null);
    const refreshCard = ref(null);


    // Table Handlers
    const tableColumns = [
        { key: 'count', label: 'S/N', sortable: true },
        { key: 'email', sortable: true },
        { key: 'trans_token', label: 'Transaction Token' },
        { key: 'phone', label: 'Phone', sortable: true },
        {
            key: 'remark',
            label: 'Status',

            sortable: true
        },

        { key: 'actions' }
    ];
    const perPage = ref(50);
    const totalUsers = ref(0);
    const currentPage = ref(1);
    const perPageOptions = [50, 75, 100];
    const searchQuery = ref('');
    const sortBy = ref('count');
    const isSortDirDesc = ref(false);
    const isSortDirAsc = ref(true);



    const isBusy = ref(true);

    const returnSearchedPayment = ref([]);



    const statusOptions = [
        { label: 'Confirmed', value: 2 },
        { label: 'Pending', value: 1 },
        { label: 'Inactive', value: 0 }
    ];

    onBeforeMount(() => {
        fetchUsers();
    });

    //*************************************************************** */
    // ********************** COMPUTED ********************************//
    const dataMeta = computed(() => {
        const localItemsCount = refPaymentListTable.value ? refPaymentListTable.value.localItems.length : 0;

        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: totalUsers.value
        };
    });

    const computePayments = computed(() => {
        let getPaymentObj = store.getters['TransferPayment/allPaymentGetter'];
        let payments = searchQuery.value ? returnSearchedPayment.value : getPaymentObj;

        responseObject.value = getPaymentObj;

        payments = payments.map(item => {
            if (!item.phone) {
                item.phone = 'Nil';
            }
            return item;
        });
        return countFromOne(payments);
    });

    //*************************************************************** */
    // ********************** WATCHERS ********************************//

    watch([currentPage, perPage, responseObject], val => {
        refetchData(val);
    });
    watch(
        searchQuery,
        async val => {
            if (!val) {
                returnSearchedPayment.value = [];
                return false;
            }
            isBusy.value = true;
            let payload = {
                searchString: val.toLocaleLowerCase()
            };

            try {
                let response = await store.dispatch('TransferPayment/SEARCH_PAYMENTS', payload);
                returnSearchedPayment.value = response;
                debugger
                isBusy.value = false;
            } catch (err) {
                isBusy.value = false;
            }
        }, {
            immediate: false
        }
    );
    const reference = () => {
        let text = "";
        let possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 11; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }
        return text;
    }

    //*************************************************************** */
    // ********************** FUNCTIONS (MEHTODS) ********************************//
    const confirmPayment = item => {
        new Swal({
            title: ' 😕 Confirmation ',
            text: `You are about to confirm this payment, check transaction detail carefully`,
            icon: 'info',

            showCancelButton: true,
            confirmButtonText: 'Yes',
            showClass: {
                popup: 'animate__animated animate__flipInX'
            },
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(result => {
            if (result.value) {
                isBusy.value = true;
                let payload = {
                    data: {
                        remark: 2,
                        updated_at: serverTimestamp()
                    },
                    id: item.id
                };
                store
                    .dispatch('TransferPayment/UPDATE_SINGLE_PAYMENT', payload)
                    .then(resp => {
                        isBusy.value = false;
                        new Swal('Good job!', 'Transaction Confirmed!', 'success');
                        fetchUsers(1, 1);

                        let transactions = {
                            transRef: reference(),
                            transId: item.id,
                        };
                        let userUpdateRecord = {
                            data: {
                                transaction: transactions,
                                subscribed: true,
                                payment_details: item,
                                updated_at: serverTimestamp(),
                            },

                            id: item.user_id
                        };

                        store
                            .dispatch('Users/UPDATE_SINGLE_USER', userUpdateRecord)
                            .catch(err => {
                                console.log('err')
                            });

                    })
                    .catch(err => {
                        isBusy.value = false;
                    });
            }
        });
    };
    const nameShortener = name => {
        if (!name) return '';
        return name.length > 25 ? name.slice(0, 24) + '...' : name;
    };

    const fetchUsers = async(page, pageNumber) => {
        let payload = {
            page,
            pageNumber
        };
        try {
            let resp = await store.dispatch('TransferPayment/GET_PAYMENTS', payload);

            isBusy.value = false;
            totalUsers.value = resp.length;
            refreshCard.value.showLoading = false;
        } catch (err) {
            isBusy.value = false;
        }
    };

    const refreshStop = () => {
        if (isBusy.value) {
            refreshCard.value.showLoading = false;
            return false;
        }
        refreshCard.value.showLoading = true;
        refPaymentListTable.value.refresh();
        totalUsers.value = 0;

        fetchUsers();
    };

    const refetchData = ([currentPageValue, perPageValue, responseObjectValue]) => {
        refPaymentListTable.value.refresh();
    };




    const resolvePaymentStatusVariant = status => {
        if (status === 0) return 'info';
        if (status === 1) return 'danger';
        if (status === 2) return 'success';
        return 'info';
    };

    return {
        refreshCard,
        showLoading,

        isBusy,




        statusOptions,

        tableColumns,
        perPage,
        currentPage,
        totalUsers,
        dataMeta,
        perPageOptions,
        searchQuery,
        sortBy,
        isSortDirDesc,
        isSortDirAsc,
        refPaymentListTable,


        // *** computed ****//

        computePayments,

        // *** Fxn****//
        refreshStop,

        fetchUsers,


        resolvePaymentStatusVariant,
        refetchData,

        nameShortener,
        confirmPayment,


    };
}