<template>
	<div v-if="computeUserData">
		<!-- Media -->
		<b-media class="mb-2">
			<template #aside>
				<b-avatar
					ref="refPreviewEl"
					:src="computeUserData.avatar"
					:text="
						avatarText(
							computeUserData.f_name || computeUserData.username
						)
					"
					:variant="`light-${resolveUserRoleVariant(
						computeUserData.user_type
					)}`"
					size="90px"
					rounded
				/>
			</template>
			<h4 class="text-capitalize">
				{{ computeUserData.f_name || computeUserData.username }}
			</h4>
			<small class="text-muted text-italic"
				>(Recommended image resolution 800x400, max-image size
				2mb.)</small
			>
			<div class="d-flex flex-wrap">
				<b-button
					variant="primary"
					@click="$refs.refInputEl.click()"
					title="Update Photo"
					:disabled="isUpdateProfilePhoto"
				>
					<input
						ref="refInputEl"
						type="file"
						class="d-none"
						@input="inputImageRenderer"
						:disabled="isUpdateProfilePhoto"
					/>

					<span class="d-none d-sm-inline mr-sm-25">Update</span>
					<span class="d-inline">
						<span v-if="!isUpdateProfilePhoto">
							<feather-icon icon="EditIcon" class="d-inline" />
						</span>
						<span v-else><b-spinner class="mr-25" small /></span>
					</span>
				</b-button>
				<b-button
					variant="outline-secondary"
					class="ml-1"
					@click="removeProfilePhoto"
					:disabled="!computeUserData.avatar"
					title="Remove Photo"
				>
					<span class="mr-1 d-none d-sm-inline mr-sm-25">Remove</span>
					<span class="d-inline">
						<span v-if="!isRemovingProfilePhoto"
							><feather-icon icon="XIcon"
						/></span>
						<span v-else><b-spinner class="mr-25" small /></span>
					</span>
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
						lazy-formatter
						:formatter="formatter"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Full Name -->
				<b-col cols="12" md="4">
					<b-form-group label="Full Name" label-for="full-name">
						<b-form-input
							id="full-name"
							v-model="computeUserData.f_name"
						lazy-formatter
						:formatter="formatter"
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
							disabled
						/>
					</b-form-group>
				</b-col>
				<b-col cols="12" md="4">
					<b-form-group label="Phone" label-for="phone">
						<b-form-input
							id="phone"
							v-model="computeUserData.phone"
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
				<b-col cols="12" md="4" v-if="isAdmin">
					<b-form-group label="User Role" label-for="user-role">
						<v-select
							v-model="computeUserData.userType"
							:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							:options="roleOptions"
							:reduce="(val) => val.value"
							:clearable="false"
							input-id="user-role"
						/>
					</b-form-group>
				</b-col>
				<b-col cols="12" md="4" v-if="isAdmin">
					<b-form-group label="Subscription" label-for="subcribed">
						<v-select
							v-model="computeUserData.subscription"
							:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
							:options="subscriptionOptions"
							:reduce="(val) => val.value"
							:clearable="false"
							input-id="subcribed"
						/>
					</b-form-group>
				</b-col>

				<!-- Field: Email -->
			</b-row>
		</b-form>

		<!-- Action Buttons -->
		<b-button
			variant="success"
			class="mb-1 mb-sm-0 mr-0 mr-sm-1"
			:block="$store.getters['app/currentBreakPoint'] === 'xs'"
			@click="saveRecord"
			:disabled="isEditingRecord || isUpdateProfilePhoto"
		>
			<span class="mr-1">Save Changes</span>
			<span>
				<span v-if="!isEditingRecord"
					><feather-icon icon="SaveIcon"
				/></span>
				<span v-else><b-spinner class="mr-25" small /></span>
			</span>
		</b-button>

		<!-- <b-button
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
		</b-button> -->
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
	import { getDownloadURL } from "firebase/storage";
	import { useToast } from "vue-toastification/composition";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

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

		setup() {
			const toast = useToast();
			const { resolveUserRoleVariant } = useUsersList();
			const isRemovingProfilePhoto = ref(false);
			const isUpdateProfilePhoto = ref(false);
			const isEditingRecord = ref(false);
			const isResetRecord = ref(false);
			const coverArtUrl = ref(null);

			const roleOptions = [
				{ label: "Admin", value: 1 },
				{ label: "Student", value: 2 },
			];
			const subscriptionOptions = [
				{ label: "Subcribed", value: 1 },
				{ label: "Not Subscribed", value: 2 },
			];

			const statusOptions = [
				{ label: "Active", value: 1 },
				{ label: "Inactive", value: 0 },
			];

			// ? Demo Purpose => Update image on click of update
			const refInputEl = ref(null);
			const refPreviewEl = ref(null);
			const userData = ref(null);

			const isAdmin = computed(() => {
				return store.getters["appConfig/whoIsinGetter"];
			});

			const computeUserData = computed(() => {
				let x = store.getters["Users/singleUserGetter"];

				coverArtUrl.value = x.avatar;
				if (!x) return false;

				if (x.enabled == 1) {
					x.enabled = { label: "Active", value: 1 };
				}
				if (x.enabled == 0) {
					x.enabled = { label: "Inactive", value: 0 };
				}

				if (!x.subscribed) {
					x.subscription = { label: "Not Subscribed", value: 2 };
				}
				if (x.subscribed) {
					x.subscription = { label: "Subcribed", value: 1 };
				}
				if (x.user_type == 2) {
					x.userType = { label: "Student", value: 2 };
				}
				if (x.user_type == 1) {
					x.userType = { label: "Admin", value: 1 };
				}
				return x;
			});

			const formatter = (value) =>{
				if(!value) return ''
					return value.toLowerCase().trim()
			}
			const resetField = () => {
				if (!isEditingRecord.value) {
					isResetRecord.value = true;
					setTimeout(() => {
						let obj = {};
						Object.entries(computeUserData).forEach((item) => {
							obj[item[0]] = "";
						});
						isResetRecord.value = false;
						toast({
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

			const removeProfilePhoto = async () => {
				isRemovingProfilePhoto.value = true;
				let userId = router.currentRoute.params.id;

				try {
					let payload = {
						data: {
							avatar: "",
							updated_at: serverTimestamp(),
						},
						id: userId,
					};

					await store.dispatch("Users/UPDATE_SINGLE_USER", payload);
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

					store
						.dispatch("Users/DELETE_PROFILE_UPLOAD", {
							path: coverArtUrl.value,
						})

						.catch((err) => {
						
						});
					store
						.dispatch("Users/GET_SINGLE_USER_BY_Id", {
							id: userId,
						})
						.catch((err) => {});
				} catch (err) {
				
					isRemovingProfilePhoto.value = false;
				}
			};

			const saveRecord = async () => {
				isEditingRecord.value = true;
				let userId = router.currentRoute.params.id;

				try {
					let data = Object.assign({}, computeUserData.value);
					data.enabled = data.enabled.value;
					data.updated_at = serverTimestamp();
					data.avatar = coverArtUrl.value;
					data.subscribed = data.subscription.value === 1 ? true : false;
					data.user_type = data.userType.value;

					let payload = {
						data,
						id: userId,
					};
				
					await store.dispatch("Users/UPDATE_SINGLE_USER", payload);
					isEditingRecord.value = false;
					store
						.dispatch("Users/GET_SINGLE_USER_BY_Id", {
							id: router.currentRoute.params.id,
						})
						.catch((err) => {});
					toast({
						component: ToastificationContent,
						props: {
							title: "All Good",
							text: `Profile  Successfully updated`,
							icon: "CheckIcon",
							variant: "success",
						},
					});
				} catch (err) {
					console.error(err);
					isEditingRecord.value = false;
				}
			};

			const { inputImageRenderer } = useInputImageRenderer(
				refInputEl,
				async (file, base64) => {
					// refPreviewEl.value.src = base64;

					let userId = router.currentRoute.params.id;

					// computeUserData.value.avatar = base64;

					if (file.size > 2000000) {
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

					store
						.dispatch("Users/USER_PROFILE_UPLOAD", { image: file })
						.then((resp) => {
							isUpdateProfilePhoto.value = false;
							if (!resp) {
								return false;
							}
							toast({
								component: ToastificationContent,
								props: {
									title: "All Good",
									text: `Avatar successfully selected`,
									icon: "CheckIcon",
									variant: "info",
								},
							});

							if (coverArtUrl.value) {
								store
									.dispatch("Users/DELETE_PROFILE_UPLOAD", {
										path: coverArtUrl.value,
									})

									.catch((err) => {
										
									});
							}

							getDownloadURL(resp.ref)
								.then((resp) => {
									coverArtUrl.value = resp;
								})
								.catch();

							store.dispatch("Users/GET_SINGLE_USER_BY_Id", {
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
				isAdmin,
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
				subscriptionOptions,
				formatter,

				//  ? Demo - Update Image on click of update button
				refInputEl,
				refPreviewEl,
			};
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
</style>
