<template>
	<b-card-actions
		ref="refreshCard"
		action-refresh
		showLoading
		@refresh="refreshStop"
		title="All Courses"
	>
		<div>
			<!-- Table Container Card -->
			<b-card no-body class="mb-0" title>
				<div class="m-2">
					<!-- Table Top -->
					<b-row>
						<!-- Per Page -->
						<b-col
							cols="12"
							md="6"
							class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
						>
							<label>Show</label>
							<v-select
								v-model="perPage"
								:dir="
									$store.state.appConfig.isRTL ? 'rtl' : 'ltr'
								"
								:options="perPageOptions"
								:clearable="false"
								class="per-page-selector d-inline-block mx-50"
							/>
							<label>entries</label>
						</b-col>

						<!-- Search -->
						<b-col cols="12" md="6">
							<div
								class="d-flex align-items-center justify-content-end"
							>
								<b-form-input
									v-model="searchQuery"
									class="d-inline-block mr-1"
									placeholder="Search..."
								/>
							</div>
						</b-col>
					</b-row>
				</div>

				<b-table
					ref="refCourseListTable"
					class="position-relative"
					:items="computeCourses"
					:fields="tableColumns"
					primary-key="id"
					:sort-by.sync="sortBy"
					show-empty
					empty-text="No matching records found"
					:sort-desc.sync="isSortDirDesc"
					sticky-header="500px"
					:responsive="true"
				>
					<!-- :busy.sync="isBusy" -->
					<template slot="empty">
						<div v-if="isBusy" class="text-center">
							<b-spinner
								class="align-middle primary"
								v-if="isBusy"
							></b-spinner>
						</div>
						<div v-else class="text-center text-primary">
							No rows to displayd!
						</div>
					</template>

					<!-- Column: Title -->
					<template #cell(title)="data">
						<b-media vertical-align="center">
							<template #aside>
								<b-avatar
									size="32"
									:src="data.item.cover_photo_url"
									:text="avatarText(data.item.title)"
									variant="secondary"
								/>
							</template>
							<b-link
								:to="{
									name: 'view-course',
									params: { id: data.item.id },
								}"
								class="font-weight-bold d-block text-nowrap text-capitalize"
							>
								{{ data.item.title }}
							</b-link>
						</b-media>
					</template>

					<!-- Column: Module -->
					<template #cell(modules)="data">
						<div class="text-nowrap">
							<feather-icon
								icon="BoxIcon"
								size="18"
								class="mr-50 text-info"
							/>
							<span class="align-text-top text-capitalize">{{
								data.item.tracks + " " + "Tracks"
							}}</span>
						</div>
					</template>
					<template #cell(created_at)="data">
						<div class="text-nowrap">
							<span class="align-text-top text-capitalize">{{
								data.item.created_at
							}}</span>
						</div>
					</template>

					<template #cell(actions)="data">
						<div class="text-nowrap">
							<feather-icon
								:id="`invoice-row-${data.item.id}-send-icon`"
								icon="EditIcon"
								class="cursor-pointer text-primary"
								v-b-tooltip.hover
								size="16"
								title="Edit Course"
								@click="
									editCourse(data.item)
								"
							/>
							<!-- <b-tooltip
								title="Edit Course"
								:target="`invoice-row-${data.item.id}-preview-icon`"
							/> -->

							<feather-icon
								v-b-tooltip.hover
								:id="`invoice-row-${data.item.id}-preview-icon`"
								icon="EyeIcon"
								size="16"
								title="Watch Course"
								class="text-success cursor-pointer mx-25"
								@click="viewCourse(data.item)"
							/>

							<feather-icon
								v-b-tooltip.hover
								:id="`invoice-row-${data.item.id}-preview-icon`"
								icon="TrashIcon"
								title="Delete Course"
								size="16"
								class="text-danger cursor-pointer"
								@click="deleteCourse(data.item)"
							/>
							<!-- <b-tooltip
								title="Print Invoice"
								:target="`invoice-row-${data.item.id}-preview-icon`"
							/> -->
						</div>
					</template>
				</b-table>

				<div class="mx-2 mb-2">
					<b-row>
						<b-col
							cols="12"
							sm="6"
							class="d-flex align-items-center justify-content-center justify-content-sm-start"
						>
							<span class="text-muted"
								>Showing {{ dataMeta.from }} to
								{{ dataMeta.to }} of
								{{ dataMeta.of }} entries</span
							>
						</b-col>
						<!-- Pagination -->
						<b-col
							cols="12"
							sm="6"
							class="d-flex align-items-center justify-content-center justify-content-sm-end"
						>
							<b-pagination
								v-model="currentPage"
								:total-rows="totalCourses"
								:per-page="perPage"
								first-number
								last-number
								class="mb-0 mt-1 mt-sm-0"
								prev-class="prev-item"
								next-class="next-item"
							>
								<template #prev-text>
									<feather-icon
										icon="ChevronLeftIcon"
										size="18"
									/>
								</template>
								<template #next-text>
									<feather-icon
										icon="ChevronRightIcon"
										size="18"
									/>
								</template>
							</b-pagination>
						</b-col>
					</b-row>
				</div>
			</b-card>
		</div>
	</b-card-actions>
</template>

<script>
	import {
		BSpinner,
		BCard,
		BRow,
		BCol,
		BFormInput,
		BButton,
		BTable,
		BMedia,
		BAvatar,
		BLink,
		BBadge,
		BDropdown,
		BDropdownItem,
		BPagination,
		VBTooltip,
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import store from "@/store";
	import { ref, onUnmounted } from "@vue/composition-api";
	import { avatarText } from "@core/utils/filter";
	// import UsersListFilters from "./UsersListFilters.vue";

	import useCoursesList from "./useCoursesList";

	import BCardActions from "@core/components/b-card-actions/BCardActions.vue";

	export default {
		directives: {
			"b-tooltip": VBTooltip,
		},
		components: {
			BSpinner,
			BCardActions,
			// UsersListFilters,
			// UserListAddNew,

			BCard,
			BRow,
			BCol,
			BFormInput,
			BButton,
			BTable,
			BMedia,
			BAvatar,
			BLink,
			BBadge,
			BDropdown,
			BDropdownItem,
			BPagination,

			vSelect,
		},
		setup() {
			const {
				refreshCard,

				tableColumns,
				perPage,
				currentPage,
				totalCourses,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refCourseListTable,
				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computeCourses,
				// ****************  FXN *****
				refreshStop,

				avatarClick,
				deleteCourse,
				editCourse,
				viewCourse,
				fetchCourses,
				refetchData,
			} = useCoursesList();

			return {
				// Sidebar
				refreshCard,

				tableColumns,
				perPage,
				currentPage,
				totalCourses,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refCourseListTable,

				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computeCourses,

				// ******* FXN *******
				refreshStop,

				avatarClick,
				deleteCourse,
				editCourse,
				viewCourse,
				refetchData,
				fetchCourses,

				// Filter
				avatarText,
			};
		},
	};
</script>

<style lang="scss" scoped>
	.per-page-selector {
		width: 90px;
	}
</style>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
