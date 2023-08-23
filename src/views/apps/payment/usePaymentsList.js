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

    const refUserListTable = ref(null);
    const refreshCard = ref(null);
    const navUserDiff = ref(0);

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
    const roleFilter = ref(null);
    const planFilter = ref(null);
    const statusFilter = ref(null);
    const companyContactType = ref(null);
    const isAddNewUserSidebarActive = ref(false);

    const isBusy = ref(true);
    const countries = ref([]);
    const contactType = { name: 'Customers', value: 1 };
    const returnSearchedUser = ref([]);

    const roleOptions = [{ label: 'Admin', value: 1 }, { label: 'Student', value: 2 }];

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
        const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0;

        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: totalUsers.value
        };
    });

    const computePayments = computed(() => {
        let getPaymentObj = store.getters['TransferPayment/allPaymentGetter'];
        let payments = searchQuery.value ? returnSearchedUser.value : getPaymentObj;
        debugger
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
                returnSearchedUser.value = [];
                return false;
            }
            isBusy.value = true;
            let payload = {
                searchString: val.toLocaleLowerCase()
            };
            try {
                let response = await store.dispatch('TransferPayment/SEARCH_USERS', payload);
                returnSearchedUser.value = response;
                isBusy.value = false;
            } catch (err) {
                isBusy.value = false;
            }
        }, {
            immediate: false
        }
    );

    //*************************************************************** */
    // ********************** FUNCTIONS (MEHTODS) ********************************//
    const confirmPayment = user => {
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
                    id: user.id
                };
                store
                    .dispatch('TransferPayment/UPDATE_SINGLE_PAYMENT', payload)
                    .then(resp => {
                        isBusy.value = false;
                        new Swal('Good job!', 'Transaction Confirmed!', 'success');
                        fetchUsers(1, 1);
                        let user = auth ? auth.currentUser : 0;

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
        refUserListTable.value.refresh();
        totalUsers.value = 0;

        fetchUsers();
    };

    const refetchData = ([currentPageValue, perPageValue, responseObjectValue]) => {
        refUserListTable.value.refresh();
    };

    // *===============================================---*
    // *--------- UI ---------------------------------------*
    // *===============================================---*

    const resolveUserRoleVariant = role => {
        if (role === 'student') return 'primary';
        if (role === 'admin') return 'danger';
        return 'primary';
    };

    const resolveUserRoleIcon = role => {
        if (role === 2) return 'BookmarkIcon'; // for admin
        if (role === 1) return 'SettingsIcon'; // for student

        return 'BookmarkIcon';
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
        countries,
        navUserDiff,
        isBusy,
        contactType,
        isAddNewUserSidebarActive,
        roleOptions,

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
        refUserListTable,
        companyContactType,

        // *** computed ****//

        computePayments,

        // *** Fxn****//
        refreshStop,

        fetchUsers,

        resolveUserRoleVariant,
        resolveUserRoleIcon,
        resolvePaymentStatusVariant,
        refetchData,

        nameShortener,
        confirmPayment,

        // Extra Filters
        roleFilter,
        planFilter,
        statusFilter
    };
}