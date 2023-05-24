import { ref, watch, computed, onBeforeMount } from '@vue/composition-api';
import store from '@/store';
import { title } from '@core/utils/filter';

// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { db } from '@/config/firebase.js';
import { getDocs, collection } from 'firebase/firestore';

import { paginateCounteFromOne, countFromOne } from '@/helpers/number-helpers/numberIndex';
import { paginate } from '@/helpers/pagination-helpers/generalPagination';
import router from '@/router';

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
        { key: 'f_name', formatter: title, label: 'Full Name', sortable: true },
        { key: 'email', sortable: true },
        { key: 'user_type', label: 'User type', sortable: true },
        {
            key: 'subscribed',
            label: 'Subscribed',

            sortable: true
        },
        { key: 'enabled', label: 'Status', sortable: true },
        { key: 'actions' }
    ];
    const perPage = ref(50);
    const totalUsers = ref(0);
    const currentPage = ref(1);
    const perPageOptions = [50, 75, 100];
    const searchQuery = ref('');
    const sortBy = ref('id');
    const isSortDirDesc = ref(true);
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
    const filteredUserObject = ref([]);

    const roleOptions = [{ label: 'Admin', value: 'admin' }, { label: 'Student', value: 'student' }];

    const planOptions = [
        { label: 'Basic', value: 'basic' },
        { label: 'Company', value: 'company' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'Team', value: 'team' }
    ];

    const statusOptions = [
        { label: 'Pending', value: 2 },
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
    ];
    const CompanyContactType = [{ name: 'Customers', value: 1 }, { name: 'Vendors | Suppliers', value: 2 }];

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

    const computeUsers = computed(() => {
        let getUsersObj = filteredUserObject.value;

        let users = searchQuery.value ? returnSearchedUser.value : getUsersObj;

        responseObject.value = getUsersObj;
        totalUsers.value = users.length;

        // let payload = {
        //     data: paginate(users, currentPage.value, perPage.value),
        //     perPage: perPage.value,
        //     currentPage: currentPage.value
        // };
        // return paginateCounteFromOne(payload);
        return countFromOne(users);
    });

    //*************************************************************** */
    // ********************** WATCHERS ********************************//

    watch([currentPage, perPage, responseObject], val => {
        // refetchData(val);
    });
    watch(
        searchQuery,
        val => {
            if (!val) {
                returnSearchedUser.value = [];
                return false;
            }
            isBusy.value = true;
            let channelId = store.getters['User/channelIdGetter'];
            let _storeActionPayload = '';
            let _storeActionUrl = '';
            if (navUserDiff.value == 2) {
                _storeActionUrl = 'User/SEARCH_CUSTOMERS_NAME';
                _storeActionPayload = {
                    channelId,
                    search: val
                };
            } else {
                _storeActionUrl = 'User/SEARCH_EMPLOYEE_OR_USER';
                _storeActionPayload = {
                    search: val
                };
            }

            store.dispatch(_storeActionUrl, _storeActionPayload).then(resp => {
                if (!resp) {
                    returnSearchedUser.value = [];
                    return false;
                }
                let payload = {
                    data: paginate(resp.data, currentPage.value, perPage.value),
                    perPage: perPage.value,
                    currentPage: currentPage.value
                };
                let _resolveData = paginateCounteFromOne(payload);

                isBusy.value = false;
            });
        }, {
            immediate: false
        }
    );

    //*************************************************************** */
    // ********************** FUNCTIONS (MEHTODS) ********************************//

    const fetchUsers = async(page, pageNumber) => {
        const listOfUsers = collection(db, 'Users');
        let filteredData = [];
        try {
            let fetcheData = await getDocs(listOfUsers);
            filteredUserObject.value = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));
            totalUsers.value = fetcheData.size;
            console.log(filteredUserObject.value);
            isBusy.value = false;
            return filteredData;
        } catch (err) {
            isBusy.value = false;
            console.log(err);
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

    const avatarClick = val => {
        router.push({
            name: navUserDiff.value === 2 ? 'apps-contact-view' : 'apps-users-view',
            params: { id: val.item.id }
        });
    };

    const detailsClick = val => {
        router.push({
            name: navUserDiff.value === 2 ? 'apps-contact-view' : 'apps-users-view',
            params: { id: val.item.id }
        });
    };

    const editClick = val => {
        router.push({
            name: navUserDiff.value === 2 ? 'apps-contact-edit' : 'apps-users-edit',
            params: { id: val.item.id }
        });
    };

    const deleteClick = val => {
        router.push({
            name: navUserDiff.value === 2 ? 'apps-contact-view' : 'apps-users-view',
            params: { id: val.item.id }
        });
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

    const resolveUserStatusVariant = status => {
        if (status === true) return 'success';
        if (status === false) return 'danger';
        return 'primary';
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
        planOptions,
        statusOptions,
        CompanyContactType,

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

        computeUsers,

        // *** Fxn****//
        refreshStop,

        avatarClick,
        detailsClick,
        editClick,
        deleteClick,

        fetchUsers,

        resolveUserRoleVariant,
        resolveUserRoleIcon,
        resolveUserStatusVariant,
        refetchData,

        // Extra Filters
        roleFilter,
        planFilter,
        statusFilter
    };
}