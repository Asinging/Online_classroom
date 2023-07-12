<template>
	<b-card>
		<b-row>
			<!-- User Info: Left col -->
			<b-col
				cols="12"
				xl="6"
				class="d-flex justify-content-between flex-column"
			>
				<!-- User Avatar & Action Buttons -->
				<div class="d-flex justify-content-start">
					<b-avatar
						:src="userData.avatar"
						:text="avatarText(userData.f_name || userData.username)"
						:variant="`light-${resolveUserRoleVariant(
							userData.user_type == 1 ? 'admin' : 'student'
						)}`"
						size="104px"
						rounded
					/>
					<div class="d-flex flex-column ml-1">
						<div class="mb-1">
							<h4 class="mb-0 text-capitalize">
								{{ userData.f_name || userData.username }}
							</h4>
							<span class="card-text">{{ userData.email }}</span>
						</div>
						<div class="d-flex flex-wrap">
							<b-button
								@click="toUserEdit(userData)"
								variant="primary"
							>
								Update Profile
							</b-button>
							<b-button
								v-if="isAdmin"
								variant="outline-danger"
								class="ml-1"
								@click="deleteUser(userData)"
								:disabled="isDeletingUser"
							>
								<span class="mr-1 d-none d-sm-inline mr-sm-25"
									>Delete</span
								>
								<span class="d-inline">
									<span v-if="!isDeletingUser"
										><feather-icon icon="TrashIcon"
									/></span>
									<span v-else
										><b-spinner class="mr-25" small
									/></span>
								</span>
							</b-button>
						</div>
					</div>
				</div>

				<!-- User Stats -->
				<div class="d-flex align-items-center mt-2">
					<!-- <div class="d-flex align-items-center mr-2">
						<b-avatar variant="light-primary" rounded>
							<feather-icon icon="DollarSignIcon" size="18" />
						</b-avatar>
					</div> -->

					<!-- <div class="d-flex align-items-center">
						<b-avatar variant="light-success" rounded>
							<feather-icon icon="TrendingUpIcon" size="18" />
						</b-avatar>
					</div> -->
				</div>
			</b-col>

			<!-- Right Col: Table -->
			<b-col cols="12" xl="6">
				<table class="mt-2 mt-xl-0 w-100">
					<tr>
						<th class="pb-50">
							<feather-icon icon="UserIcon" class="mr-75" />
							<span class="font-weight-bold">Username</span>
						</th>
						<td class="pb-50 text-capitalize">
							{{ userData.username }}
						</td>
					</tr>	<tr>
						<th class="pb-50">
							<feather-icon icon="UserIcon" class="mr-75" />
							<span class="font-weight-bold">Phone</span>
						</th>
						<td class="pb-50 text-capitalize">
							{{ userData.phone || "Nil" }}
						</td>
					</tr>
					<tr>
						<th class="pb-50">
							<feather-icon icon="CheckIcon" class="mr-75" />
							<span class="font-weight-bold">Status</span>
						</th>
						<td class="pb-50 text-capitalize">
							{{ userData.enabled ? "Enabled" : "Disabled" }}
						</td>
					</tr>
					<tr>
						<th class="pb-50">
							<feather-icon icon="StarIcon" class="mr-75" />
							<span class="font-weight-bold">Role</span>
						</th>
						<td class="pb-50 text-capitalize">
							{{ userData.user_type == 1 ? "Admin" : "Student" }}
						</td>
					</tr>
				</table>
			</b-col>
		</b-row>
		<b-card-text
			v-if="!userData.subscribed && !isAdmin"
			class="text-danger text-center h3 d-flex justify-content-center"
		>
			Subscribe to the platform to enjoy the full benefits</b-card-text
		>
	</b-card>
</template>

<script>
	import {
		BCard,
		BButton,
		BAvatar,
		BRow,
		BCol,
		BCardText,
		BSpinner,
	} from "bootstrap-vue";
	import { avatarText } from "@core/utils/filter";
	import useUsersList from "../users-list/useUsersList";
	import router from "@/router";
	import Swal from "sweetalert2";
	import { ref, computed } from "@vue/composition-api";
	import store from "@/store";

	export default {
		components: {
			BSpinner,
			BCardText,
			BCard,
			BButton,
			BRow,
			BCol,
			BAvatar,
		},
		props: {
			userData: {
				type: Object,
				required: true,
			},
		},
		setup() {
			const { resolveUserRoleVariant } = useUsersList();
			const isDeletingUser = ref(false);

			const toUserEdit = (userData) => {
				let isAdmin = JSON.parse(
					localStorage.getItem("isAdminIn") || "false"
				);
				router.push({
					name: isAdmin ? "apps-users-edit" : "users-edit",
					params: { id: userData.id },
				});
			};

			const isAdmin = computed(() => {
				return store.getters["appConfig/whoIsinGetter"];
			});

			const deleteUser = (user) => {
				new Swal({
					title: " 😕 Hey Carefull! ",
					text: `You are about to delete this user permanently`,
					icon: "info",

					showCancelButton: true,
					confirmButtonText: "Yes",
					showClass: {
						popup: "animate__animated animate__flipInX",
					},
					customClass: {
						confirmButton: "btn btn-primary",
						cancelButton: "btn btn-outline-danger ml-1",
					},
					buttonsStyling: false,
				}).then((result) => {
					if (result.value) {
						let payload = {
							data: {
								status: 0,
							},
							id: user.id,
						};
						store
							.dispatch("Users/UPDATE_SINGLE_USER", payload)
							.then((resp) => {
								new Swal(
									"Good job!",
									"User successfully deleted!",
									"success"
								);
								let id = router.currentRoute.params.id;
								store.dispatch("Users/GET_SINGLE_USER_BY_Id", {
									id,
								});
							});
					}
				});
			};
			return {
				isDeletingUser,
				isAdmin,
				deleteUser,
				toUserEdit,
				avatarText,
				resolveUserRoleVariant,
			};
		},
	};
</script>

<style>
</style>
