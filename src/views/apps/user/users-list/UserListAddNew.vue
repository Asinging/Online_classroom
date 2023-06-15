<template>
	<b-sidebar
		id="add-new-user-sidebar"
		:visible="isAddNewUserSidebarActive"
		bg-variant="white"
		sidebar-class="sidebar-lg"
		shadow
		backdrop
		no-header
		right
		@hidden="resetForm"
		@change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
	>
		<template #default="{ hide }">
			<!-- Header -->
			<div
				class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
			>
				<h5 class="mb-0">Add New User</h5>

				<feather-icon
					class="ml-1 cursor-pointer"
					icon="XIcon"
					size="16"
					@click="hide"
				/>
			</div>

			<!-- BODY -->
			<validation-observer
				#default="{ handleSubmit }"
				ref="refFormObserver"
			>
				<!-- Form -->
				<b-form
					class="p-2"
					@submit.prevent="handleSubmit(onSubmit)"
					@reset.prevent="resetForm"
				>
					<!-- Full Name -->
					<validation-provider
						#default="validationContext"
						name="Full Name"
						rules="required"
					>
						<b-form-group label="Full Name" label-for="full-name">
							<b-form-input
								id="full-name"
								v-model="userData.f_name"
								autofocus
								:state="getValidationState(validationContext)"
								trim
								placeholder="John Doe"
							/>

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<!-- Username -->
					<validation-provider
						#default="validationContext"
						name="Username"
						rules="required|alpha-num"
					>
						<b-form-group label="Username" label-for="username">
							<b-form-input
								id="username"
								v-model="userData.username"
								:state="getValidationState(validationContext)"
								trim
							/>

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<!-- Email -->
					<validation-provider
						#default="validationContext"
						name="Email"
						rules="required|email"
					>
						<b-form-group label="Email" label-for="email">
							<b-form-input
								id="email"
								v-model="userData.email"
								:state="getValidationState(validationContext)"
								disabled
								trim
							/>

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<!-- User Role -->
					<validation-provider
						#default="validationContext"
						name="User Role"
						rules="required"
					>
						<b-form-group
							label="User Role"
							label-for="user-role"
							:state="getValidationState(validationContext)"
						>
							<v-select
								v-model="userData.user_type"
								:dir="
									$store.state.appConfig.isRTL ? 'rtl' : 'ltr'
								"
								:options="roleOptions"
								:reduce="(val) => val.value"
								:clearable="false"
								input-id="user-role"
							/>
							<b-form-invalid-feedback
								:state="getValidationState(validationContext)"
							>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<validation-provider
						#default="validationContext"
						name="Password"
						rules="required"
					>
						<b-form-group label="Password" label-for="password">
							<b-form-input
								id="password"
								v-model="userData.password"
								:state="getValidationState(validationContext)"
								type="password"
								min="6"
							/>

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<validation-provider
						#default="validationContext"
						name="Retype Password"
						rules="required|"
					>
						<b-form-group
							label="Retype Password"
							label-for="retypePassword"
						>
							<b-form-input
								id="retypePassword"
								v-model="userData.retypePassword"
								:state="getValidationState(validationContext)"
								type="password"
								min="6"
							/>

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>

					<div class="d-flex mt-2">
						<b-button
							v-ripple.400="'rgba(255, 255, 255, 0.15)'"
							variant="primary"
							class="mr-2"
							type="submit"
							:disabled="isCreatingUser"
						>
							<span class="pr-25 pt-25">Add </span>
							<span>
								<span v-if="!isCreatingUser"
									><feather-icon icon="PlusIcon" size="16"
								/></span>
								<span v-else
									><b-spinner small class=""></b-spinner
								></span>
							</span>
						</b-button>
						<b-button
							v-ripple.400="'rgba(186, 191, 199, 0.15)'"
							type="button"
							variant="outline-secondary"
							@click="hide"
						>
							Cancel
						</b-button>
					</div>
				</b-form>
			</validation-observer>
		</template>
	</b-sidebar>
</template>

<script>
	import {
		BSpinner,
		BSidebar,
		BForm,
		BFormGroup,
		BFormInput,
		BFormInvalidFeedback,
		BButton,
	} from "bootstrap-vue";
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import { ref } from "@vue/composition-api";
	import { required, alphaNum, email } from "@validations";
	import formValidation from "@core/comp-functions/forms/form-validation";
	import Ripple from "vue-ripple-directive";
	import vSelect from "vue-select";

	import store from "@/store";

	import { serverTimestamp } from "firebase/firestore";
	import { useToast } from "vue-toastification/composition";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

	export default {
		components: {
			BSpinner,
			BSidebar,
			BForm,
			BFormGroup,
			BFormInput,
			BFormInvalidFeedback,
			BButton,
			vSelect,

			// Form Validation
			ValidationProvider,
			ValidationObserver,
		},
		directives: {
			Ripple,
		},
		model: {
			prop: "isAddNewUserSidebarActive",
			event: "update:is-add-new-user-sidebar-active",
		},
		props: {
			isAddNewUserSidebarActive: {
				type: Boolean,
				required: true,
			},
			roleOptions: {
				type: Array,
				required: true,
			},
		},
		data() {
			return {
				required,
				alphaNum,
				email,
			};
		},
		setup(props, { emit }) {
			const toast = useToast();
			const isCreatingUser = ref(false);
			const blankUserData = {
				f_name: "",
				username: "",
				email: "",
				user_type: "",
				password: "",
				retypePassword: "",
			};

			const userData = ref(JSON.parse(JSON.stringify(blankUserData)));
			const resetuserData = () => {
				userData.value = JSON.parse(JSON.stringify(blankUserData));
			};

			const onSubmit = async () => {
				let val = userData.value;
				if (
					val.password.length &&
					val.retypePassword.length &&
					val.password !== val.retypePassword
				) {
					toast({
						component: ToastificationContent,
						props: {
							title: "Password do no match",
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
					return;
				}
				let emptyfield = false;

				Object.values(userData.value).forEach((val) => {
					if (!val) {
						emptyfield = true;
					}
				});
				if (emptyfield) {
					toast({
						component: ToastificationContent,
						props: {
							title: "Some of the fields are empty",
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
					return;
				}

				isCreatingUser.value = true;

				try {
					let data = Object.assign({}, userData.value);
					data.created_at = serverTimestamp();
					data.created_by = "admin";
					data.updated_at = null;
					data.is_root = false;
					data.subscribed = false;
					data.enabled = true;
					data.status = 1;

					data.who_create = localStorage.getItem("signInUser");
					delete data.retypePassword;
					let payload = {
						data,
					};
					let resp = await store.dispatch("Users/CREATE_USER", payload);
					isCreatingUser.value = false;
					store
						.dispatch("Users/GET_USERS", payload)
						.catch((err) => console.log(err));
					emit("refetch-data");
					emit("update:is-add-new-user-sidebar-active", false);
				} catch (err) {
					console.error(err);
					isCreatingUser.value = false;
				}
			};

			const { refFormObserver, getValidationState, resetForm } =
				formValidation(resetuserData);

			return {
				isCreatingUser,

				userData,
				onSubmit,

				refFormObserver,
				getValidationState,
				resetForm,
			};
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";

	#add-new-user-sidebar {
		.vs__dropdown-menu {
			max-height: 200px !important;
		}
	}
</style>
