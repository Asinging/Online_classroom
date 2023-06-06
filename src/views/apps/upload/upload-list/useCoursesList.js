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
import moment from 'moment';

import { useRoute } from 'vue-router';

export default function useCoursesList() {
   // Use toast
   const toast = useToast();
   const showLoading = ref(true);

   const responseObject = ref(null);

   const refCourseListTable = ref(null);
   const refreshCard = ref(null);

   // Table Handlers
   const tableColumns = [
      { key: 'count', label: 'S/N', sortable: true },
      { key: 'title', formatter: title, label: 'Title' },
      { key: 'modules', label: 'Modules', sortable: true },
      { key: 'created_at', label: 'Date Created', sortable: true },

      { key: 'actions' }
   ];
   const perPage = ref(50);
   const totalCourses = ref(0);
   const currentPage = ref(1);
   const perPageOptions = [ 50, 75, 100 ];
   const searchQuery = ref('');
   const sortBy = ref('id');
   const isSortDirDesc = ref(true);
   const isSortDirAsc = ref(true);

   const isBusy = ref(true);

   const returnSearchedCourses = ref([]);

   onBeforeMount(() => {
      fetchCourses();
   });

   //*************************************************************** */
   // ********************** COMPUTED ********************************//
   const dataMeta = computed(() => {
      const localItemsCount = refCourseListTable.value ? refCourseListTable.value.localItems.length : 0;

      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: totalCourses.value
      };
   });

   const computeCourses = computed(() => {
      let getCoursesObj = store.getters['Course/allCourseGetter'];
      let course = searchQuery.value ? returnSearchedCourses.value : getCoursesObj;

      if (!course) return [];
      course = course.map(item => {
         item.created_at = `${moment(item.created_at ? item.created_at.toDate() : Date.now()).format(
            'MMMM Do YYYY, h:mm:ss a'
         )}`;
         return item;
      });
      responseObject.value = getCoursesObj;

      return countFromOne(course);
   });

   //*************************************************************** */
   // ********************** WATCHERS ********************************//

   watch([ currentPage, perPage, responseObject ], val => {
      refetchData(val);
   });
   watch(
      searchQuery,
      async val => {
         if (!val) {
            returnSearchedCourses.value = [];
            return false;
         }
         isBusy.value = true;
         let payload = {
            searchString: val.toLocaleLowerCase()
         };
         try {
            let response = await store.dispatch('Course/SEARCH_COURSES', payload);
            returnSearchedCourses.value = response;
            isBusy.value = false;
         } catch (err) {
            isBusy.value = false;
         }
      },
      {
         immediate: false
      }
   );

   //*************************************************************** */
   // ********************** FUNCTIONS (MEHTODS) ********************************//
   const deleteUser = courseId => {
      new Swal({
         title: ' 😕 Carefull! ',
         text: `You are about to delete this course permanently`,
         icon: 'info',

         showCancelButton: true,
         confirmButtonText: 'Yes',
         showClass: {
            popup: 'animate__animated animate__bounceIn'
         },
         customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
         },
         buttonsStyling: false
      }).then(async result => {
         if (result.value) {
            try {
               let payload = {
                  signInUser: localStorage.getItem('signInUser'),
                  data: {
                     status: 0
                  },
                  id: userId
               };
               let doc = await store.dispatch('Course/UPDATE_SINGLE_USER', payload);
               fetchCourses();
               new Swal('Good job!', 'User successfully deleted!', 'success');
            } catch (err) {
               console.error(err);
            }
         }
      });
   };

   const fetchCourses = async (page, pageNumber) => {
      let payload = {
         page,
         pageNumber
      };
      try {
         let resp = await store.dispatch('Course/GET_COURSES', payload);
         isBusy.value = false;
         totalCourses.value = resp.length;
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
      refCourseListTable.value.refresh();
      totalCourses.value = 0;

      fetchCourses();
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

   const refetchData = ([ currentPageValue, perPageValue, responseObjectValue ]) => {
      refCourseListTable.value.refresh();
   };

   // *===============================================---*
   // *--------- UI ---------------------------------------*
   // *===============================================---*

   return {
      refreshCard,
      showLoading,

      isBusy,

      tableColumns,
      perPage,
      currentPage,
      totalCourses,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      isSortDirAsc,
      refCourseListTable,

      // *** computed ****//

      computeCourses,

      // *** Fxn****//
      refreshStop,

      avatarClick,
      detailsClick,
      editClick,
      deleteClick,

      fetchCourses,

      refetchData,
      deleteUser
   };
}
