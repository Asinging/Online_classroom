<template>
	<b-card-actions
		ref="refreshCard"
		action-refresh
		showLoading
		@refresh="refreshStop"
		:title="isComponent ? 'Payments' : 'All Payments'"
		class="border-0"
	>
		<div>
			<!-- Table Container Card -->
			<b-card no-body class="mb-0 border-0" title>
				<div class="m-2 border-0">
					<!-- Table Top -->
					<b-row v-if="!isComponent">
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
					ref="refPaymentListTable"
					class="position-relative border-0"
					:items="computePayments"
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
							No rows to display!
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
					<template #cell(remark)="data">
						<b-badge
							v-b-tooltip.hover
							:title="`Transaction is   ${
								data.item.remark == 1 ? 'Pending' : 'Confirmed'
							}`"
							pill
							:variant="`light-${resolvePaymentStatusVariant(
								data.item.remark
							)}`"
							class="text-capitalize"
						>
							{{
								data.item.remark == 1 ? "Pending" : "Confirmed"
							}}
						</b-badge>
					</template>

					<!-- Column: Actions -->
					<template #cell(actions)="data">
						<div class="text-nowrap">
							<b-button
								class="btn icon-btn bg-primary"
								size="sm"
								variant="primary"
								:disabled="data.item.remark == 2"
							>
								<feather-icon
									:id="`invoice-row-${data.item.id}-send-icon`"
									icon="CheckIcon"
									class="cursor-pointer text-light"
									v-b-tooltip.hover
									size="16"
									title="Confirm Payment"
									@click="confirmPayment(data.item)"
								/>
							</b-button>
						</div>
					</template>
				</b-table>

				<div class="mx-2 mb-2" v-if="!isComponent">
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
								:total-rows="totalPayments"
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

	import usePaymentsList from "./usePaymentsList";

	import BCardActions from "@core/components/b-card-actions/BCardActions.vue";

	export default {
		directives: {
			"b-tooltip": VBTooltip,
		},
		props: {
			isComponent: {
				type: Boolean,

				default: false,
			},
		},
		components: {
			BSpinner,
			BCardActions,

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
				isAddNewPaymentSidebarActive,
				tableColumns,
				perPage,
				currentPage,
				totalPayments,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refPaymentListTable,
				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computePayments,
				// ****************  FXN *****
				refreshStop,

				changeContactType,
				avatarClick,
				detailsClick,
				editClick,
				deleteClick,
				fetchPayments,
				refetchData,

				resolvePaymentRoleVariant,
				resolvePaymentRoleIcon,
				resolvePaymentStatusVariant,
				deleteOrdPayment,
				nameShortener,

				// Extra Filters
				roleFilter,
				planFilter,
				statusFilter,
				confirmPayment,
			} = usePaymentsList();

			return {
				// Sidebar
				refreshCard,
				isAddNewPaymentSidebarActive,

				tableColumns,
				perPage,
				currentPage,
				totalPayments,
				dataMeta,
				perPageOptions,
				searchQuery,
				sortBy,
				isSortDirDesc,
				refPaymentListTable,

				// Extra Filters
				roleFilter,
				planFilter,
				statusFilter,
				isBusy,
				showLoading,
				// ************** WATCHERS *********
				computePayments,

				// ******* FXN *******
				refreshStop,
				changeContactType,
				avatarClick,
				detailsClick,
				editClick,
				deleteClick,
				refetchData,
				fetchPayments,
				deleteOrdPayment,
				nameShortener,
				// Filter
				avatarText,
				resolvePaymentRoleVariant,
				resolvePaymentRoleIcon,
				resolvePaymentStatusVariant,
				confirmPayment,
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
