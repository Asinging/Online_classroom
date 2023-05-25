<template>
	<div>
		<!-- Media -->
		<b-media class="mb-2">
			<template #aside>
				<b-avatar
					ref="previewEl"
					:src="computeUserData.avatar"
					:text="avatarText(computeUserData.f_name)"
					:variant="`light-${resolveUserRoleVariant(
						computeUserData.user_type
					)}`"
					size="90px"
					rounded
				/>
			</template>
			<h4 class="mb-1 text-capitalize">
				{{ computeUserData.f_name }}
			</h4>
			<div class="d-flex flex-wrap">
				<b-button variant="primary" @click="$refs.refInputEl.click()">
					<input
						ref="refInputEl"
						type="file"
						class="d-none"
						@input="inputImageRenderer"
					/>
					<span class="d-none d-sm-inline">Update</span>
					<feather-icon icon="EditIcon" class="d-inline d-sm-none" />
				</b-button>
				<b-button variant="outline-secondary" class="ml-1">
					<span class="d-none d-sm-inline">Remove</span>
					<feather-icon icon="TrashIcon" class="d-inline d-sm-none" />
				</b-button>
			</div>
		</b-media>

		<!-- User Info: Input Fields -->
		<b-form>
			<b-row>
				<!-- Field: Username -->
				<b-col cols="12" md="4">
					<b-form-group label="Username" label-for="username">
						<b-form-input
							id="username"
							v-model="computeUserData.username"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Full Name -->
				<b-col cols="12" md="4">
					<b-form-group label="Name" label-for="full-name">
						<b-form-input
							id="full-name"
							v-model="computeUserData.f_name"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Email -->
				<b-col cols="12" md="4">
					<b-form-group label="Email" label-for="email">
						<b-form-input
							id="email"
							v-model="computeUserData.email"
							type="email"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Status -->
				<b-col cols="12" md="4">
					<b-form-group label="Status" label-for="user-status">
						<v-select
							v-model="computeUserData.enabled"
							:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							:options="statusOptions"
							:reduce="(val) => val.value"
							:clearable="false"
							input-id="user-status"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Role -->
				<b-col cols="12" md="4">
					<b-form-group label="User Role" label-for="user-role">
						<v-select
							v-model="computeUserData.user_type"
							:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							:options="roleOptions"
							:reduce="(val) => val.value"
							:clearable="false"
							input-id="user-role"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Email -->
			</b-row>
		</b-form>

		<!-- Action Buttons -->
		<b-button
			variant="primary"
			class="mb-1 mb-sm-0 mr-0 mr-sm-1"
			:block="$store.getters['app/currentBreakPoint'] === 'xs'"
			@click="saveRecord"
			:disabled="isEditingRecord"
		>
			<span class="mr-1">Save Changes</span>
			<span>
				<span v-if="!isEditingRecord"
					><feather-icon icon="SaveIcon"
				/></span>
				<span v-else><b-spinner class="mr-25" small /></span>
			</span>
		</b-button>

		<b-button
			variant="outline-secondary"
			type="reset"
			:block="$store.getters['app/currentBreakPoint'] === 'xs'"
			@click="resetField"
			:disabled="isEditingRecord || isResetRecord"
		>
			<span class="mr-1">Reset</span>
			<span>
				<span v-if="!isResetRecord"
					><feather-icon icon="RefreshCwIcon"
				/></span>
				<span v-else><b-spinner class="mr-25" small /></span>
			</span>
		</b-button>
	</div>
</template>

<script>
	import {
		BSpinner,
		BButton,
		BMedia,
		BAvatar,
		BRow,
		BCol,
		BFormGroup,
		BFormInput,
		BForm,
		BTable,
		BCard,
		BCardHeader,
		BCardTitle,
		BFormCheckbox,
	} from "bootstrap-vue";
	import { avatarText } from "@core/utils/filter";
	import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
	import vSelect from "vue-select";
	import { ref, computed } from "@vue/composition-api";
	import useUsersList from "../users-list/useUsersList";
	import { serverTimestamp } from "firebase/firestore";
	import router from "@/router";
	import store from "@/store";

	export default {
		components: {
			BSpinner,
			BButton,
			BMedia,
			BAvatar,
			BRow,
			BCol,
			BFormGroup,
			BFormInput,
			BForm,
			BTable,
			BCard,
			BCardHeader,
			BCardTitle,
			BFormCheckbox,
			vSelect,
		},
		props: {
			userData: {
				type: Object,
				required: true,
			},
		},

		setup(props) {
			const { resolveUserRoleVariant } = useUsersList();
			const isRemovingProfilePhoto = ref(false);
			const isUpdateProfilePhoto = ref(false);
			const isEditingRecord = ref(false);
			const isResetRecord = ref(false);

			const roleOptions = [
				{ label: "Admin", value: 1 },
				{ label: "Student", value: 2 },
			];

			const statusOptions = [
				{ label: "Pending", value: 2 },
				{ label: "Active", value: 1 },
				{ label: "Inactive", value: 0 },
			];

			// ? Demo Purpose => Update image on click of update
			const refInputEl = ref(null);
			const previewEl = ref(null);

			const computeUserData = computed(() => {
				let obj = Object.assign({}, props.userData);
				return obj;
			});

			const resetField = () => {
				if (!isEditingRecord.value) {
					isResetRecord.value = true;
					setTimeout(() => {
						let obj = {};
						// Object.entries(props.computeUserData).forEach((item) => {
						// 	obj[item[0]] = "";
						// });
						// computeUserData = obj;

						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Cool",
								text: "Records Successfully refreshed",
								icon: "InfoIcon",
								variant: "info",
							},
						});
						return false;
					}, 1000);
				}
			};

			const removeProfilePhoto = function () {
				isRemovingProfilePhoto.value = true;
				setTimeout(() => {
					isRemovingProfilePhoto.value = false;
					toast({
						component: ToastificationContent,
						props: {
							title: "Good",
							text: `You have successfully remove the Profile photo`,
							icon: "CheckIcon",
							variant: "success",
						},
					});
					props.computeUserData.avatar = "";
				}, 1000);
			};

			const saveRecord = async () => {
				isEditingRecord.value = true;
				let userId = router.currentRoute.params.id;

				try {
					let data = Object.assign({}, computeUserData.value);

					data.updated_at = serverTimestamp();

					let payload = {
						data,
						id: userId,
					};
					await store.dispatch("Users/UPDATE_SINGLE_USER", payload);
					isEditingRecord.value = false;
				} catch (err) {
					console.error(err);
					isEditingRecord.value = false;
				}
			};

			const { inputImageRenderer } = useInputImageRenderer(
				refInputEl,
				(file) => {
					let channelId = store.getters["User/channelIdGetter"];
					let userId = router.currentRoute.params.id;

					props.computeUserData.avatar = "";

					if (file.size > 6000000) {
						toast({
							component: ToastificationContent,
							props: {
								title: "Oh no",
								text: `File size is greater than the required size (Max 6mb)`,
								icon: "AlertTriangleIcon",
								variant: "warning",
							},
						});
						return false;
					}

					isUpdateProfilePhoto.value = true;
					let query = new FormData();
					query.append("image", file);
					query.append("user_id", userId);
					query.append("channel_id", channelId);
					// eslint-disable-next-line no-param-reassign
					store
						.dispatch("User/USER_PROFILE_UPLOAD", { query })
						.then((resp) => {
							isUpdateProfilePhoto.value = false;
							if (!resp) {
								return false;
							}
							toast({
								component: ToastificationContent,
								props: {
									title: "All Good",
									text: `Profile photo Successfully uploaded`,
									icon: "CheckIcon",
									variant: "success",
								},
							});

							store.dispatch("User/GET_SINGLE_USER", {
								id: userId,
							});
						})
						.catch((err) => {
							isUpdateProfilePhoto.value = false;
							console.log(err);
							toast({
								component: ToastificationContent,
								props: {
									title: "Error",
									text: `An Error Occured`,
									icon: "XIcon",
									variant: "danger",
								},
							});
						});
				}
			);

			return {
				saveRecord,
				inputImageRenderer,
				avatarText,
				isRemovingProfilePhoto,
				isUpdateProfilePhoto,
				resolveUserRoleVariant,
				removeProfilePhoto,
				computeUserData,
				resetField,
				roleOptions,
				statusOptions,
				isEditingRecord,
				isResetRecord,

				//  ? Demo - Update Image on click of update button
				refInputEl,
				previewEl,
			};
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
