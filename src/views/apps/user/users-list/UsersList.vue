<template>
	<b-card-actions
		ref="refreshCard"
		action-refresh
		showLoading
		@refresh="refreshStop"
		title="All Users"
	>
		<div>
			<user-list-add-new
				:is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
				:role-options="roleOptions"
				@refetch-data="refetchData"
			/>

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
								<b-button
									variant="primary"
									@click="isAddNewUserSidebarActive = true"
								>
									<span class="text-nowrap">Add User</span>
								</b-button>
							</div>
						</b-col>
					</b-row>
				</div>

				<b-table
					ref="refUserListTable"
					class="position-relative"
					:items="computeUsers"
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

					<!-- Column: Name -->
					<template #cell(f_name)="data">
						<b-media vertical-align="center">
							<template #aside>
								<b-avatar
									size="32"
									:src="data.item.avatar"
									:text="avatarText(data.item.f_name)"
									:variant="`light-${resolveUserRoleVariant(
										data.item.user_type == 1
											? 'admin'
											: 'student'
									)}`"
									:to="{
										name: 'apps-users-view',
										params: { id: data.item.id },
									}"
								/>
							</template>
							<b-link
								:to="{
									name: 'apps-users-view',
									params: { id: data.item.id },
								}"
								class="font-weight-bold d-block text-nowrap text-capitalize"
							>
								{{ data.item.f_name }}
							</b-link>
							<small class="text-muted text-lighten-blue"
								>@{{ data.item.username }}</small
							>
						</b-media>
					</template>

					<!-- Column: Role -->
					<template #cell(user_type)="data">
						<div class="text-nowrap">
							<feather-icon
								:icon="resolveUserRoleIcon(data.item.user_type)"
								size="18"
								class="mr-50"
								:class="`text-${resolveUserRoleVariant(
									data.item.user_type == 1
										? 'admin'
										: 'student'
								)}`"
							/>
							<span class="align-text-top text-capitalize">{{
								data.item.user_type == 1 ? "Admin" : "Student"
							}}</span>
						</div>
					</template>
					<!-- Column: Role -->
					<template #cell(subscribed)="data">
						<div class="text-nowrap">
							<span class="align-text-top text-capitalize">{{
								data.item.subscribed == true
									? "Subscribed"
									: "Not subscribed"
							}}</span>
						</div>
					</template>

					<!-- Column: Status -->
					<template #cell(enabled)="data">
						<b-badge
							pill
							:variant="`light-${resolveUserStatusVariant(
								data.item.enabled
							)}`"
							class="text-capitalize"
						>
							{{
								data.item.enabled == true
									? "active"
									: "disabled"
							}}
						</b-badge>
					</template>

					<!-- Column: Actions -->
					<template #cell(actions)="data">
						<b-dropdown
							variant="link"
							no-caret
							:right="$store.state.appConfig.isRTL"
						>
							<template #button-content>
								<feather-icon
									icon="MoreVerticalIcon"
									size="16"
									class="align-middle text-body"
								/>
							</template>
							<b-dropdown-item
								:to="{
									name: 'apps-users-view',
									params: { id: data.item.id },
								}"
							>
								<feather-icon icon="FileTextIcon" />
								<span class="align-middle ml-50">Details</span>
							</b-dropdown-item>

							<b-dropdown-item
								:to="{
									name: 'apps-users-edit',
									params: { id: data.item.id },
								}"
							>
								<feather-icon icon="EditIcon" />
								<span class="align-middle ml-50">Edit</span>
							</b-dropdown-item>

							<b-dropdown-item @click="deleteUser(data.item.id)">
								<feather-icon icon="TrashIcon" />
								<span class="align-middle ml-50">Delete</span>
							</b-dropdown-item>
						</b-dropdown>
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
								:total-rows="totalUsers"
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
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import store from "@/store";
	import { ref, onUnmounted } from "@vue/composition-api";
	import { avatarText } from "@core/utils/filter";
	import UsersListFilters from "./UsersListFilters.vue";
	import useUsersList from "./useUsersList";
	import userStoreModule from "../userStoreModule";
	import UserListAddNew from "./UserListAddNew.vue";
	import BCardActions from "@core/components/b-card-actions/BCardActions.vue";

	export default {
		components: {
			BSpinner,
			BCardActions,
			UsersListFilters,
			UserListAddNew,

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
				isAddNewUserSidebarActive,
				tableColumns,
				perPage,
				currentPage,
				totalUsers,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refUserListTable,
				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computeUsers,
				// ****************  FXN *****
				refreshStop,

				changeContactType,
				avatarClick,
				detailsClick,
				editClick,
				deleteClick,
				fetchUsers,
				refetchData,

				resolveUserRoleVariant,
				resolveUserRoleIcon,
				resolveUserStatusVariant,
				deleteUser,

				// Extra Filters
				roleFilter,
				planFilter,
				statusFilter,
				roleOptions,
			} = useUsersList();

			return {
				// Sidebar
				refreshCard,
				isAddNewUserSidebarActive,

				tableColumns,
				perPage,
				currentPage,
				totalUsers,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refUserListTable,
				roleOptions,

				// Extra Filters
				roleFilter,
				planFilter,
				statusFilter,
				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computeUsers,

				// ******* FXN *******
				refreshStop,
				changeContactType,
				avatarClick,
				detailsClick,
				editClick,
				deleteClick,
				refetchData,
				fetchUsers,
				deleteUser,
				// Filter
				avatarText,
				resolveUserRoleVariant,
				resolveUserRoleIcon,
				resolveUserStatusVariant,
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
