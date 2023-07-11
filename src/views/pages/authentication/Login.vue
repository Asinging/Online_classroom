<template>
	<div class="auth-wrapper auth-v2">
		<b-row class="auth-inner m-0">
			<!-- Brand logo-->
			<b-link class="brand-logo"> </b-link>

			<b-col lg="8" class="d-none d-lg-flex align-items-center">
				<div
					class="w-100 d-lg-flex align-items-center justify-content-center fill-height"
				>
					<b-img fluid :src="imgUrl" alt="Login V2" />
				</div>
			</b-col>

			<b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
				<b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
					<b-link class="brand-logo-2 d-none">
						<logo />
					</b-link>

					<b-card-title
						title-tag="h3"
						class="font-weight-bold mb-1 text-center text-lg-left"
					>
						Welcome To Wealth Link
					</b-card-title>
					<b-card-text class="mb-2 text-center text-lg-left">
						Login to your account and start the adventure
					</b-card-text>

					<b-alert
						variant="danger"
						v-if="errorMessage"
						show
						class="text-center"
					>
						<div>{{ errorMessage }}</div>
						<!-- <div>
							<b-button
								@click="resendVerificationMail"
								v-if="emailNotVerified"
								:disabled="sendingVerificationEmail"
								class="mt-25"
								size="sm"
								variant="danger"
								block
							>
								<span>Resend Email Verification link</span>
								<span class="py-1">
									<b-spinner
										v-if="sendingVerificationEmail"
										class="ml-1"
										small
									/>
								</span>
							</b-button>
						</div> -->
					</b-alert>
					<validation-observer ref="loginForm">
						<b-form class="auth-login-form mt-2" @submit.prevent>
							<!-- email -->
							<b-form-group label="Email" label-for="login-email">
								<validation-provider
									#default="{ errors }"
									name="Email"
									rules="required|email"
								>
									<b-form-input
										id="login-email"
										v-model="userEmail"
										:state="
											errors.length > 0 ? false : null
										"
										name="login-email"
										placeholder="john@example.com"
									/>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>

							<!-- forgot password -->
							<b-form-group>
								<div class="d-flex justify-content-between">
									<label for="login-password">Password</label>
									<b-link
										:to="{
											name: 'auth-forgot-password',
										}"
										class="text-primary text-decoration-none"
									>
										<small>Forgot Password?</small>
									</b-link>
								</div>
								<validation-provider
									#default="{ errors }"
									name="Password"
									rules="required"
								>
									<b-input-group
										class="input-group-merge"
										:class="
											errors.length > 0
												? 'is-invalid'
												: null
										"
									>
										<b-form-input
											id="login-password"
											v-model="password"
											:state="
												errors.length > 0 ? false : null
											"
											class="form-control-merge"
											:type="passwordFieldType"
											name="login-password"
											placeholder="············"
										/>
										<b-input-group-append is-text>
											<feather-icon
												class="cursor-pointer"
												:icon="passwordToggleIcon"
												@click="
													togglePasswordVisibility
												"
											/>
										</b-input-group-append>
									</b-input-group>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>

							<!-- submit buttons -->
							<b-button
								type="submit"
								variant="primary"
								class="pb-1"
								block
								@click="login"
								:disabled="isLogining"
							>
								<span>Sign in</span>
								<span class="pl-1">
									<span v-if="!isLogining">
										<feather-icon icon="ChevronsRightIcon"
									/></span>
									<span v-else>
										<b-spinner
											label="Loading..."
											class="mr-25"
											small
										/>
									</span>
								</span>
							</b-button>
						</b-form>
					</validation-observer>

					<b-card-text class="text-center mt-2">
						<span>New on our platform? </span>
						<b-link
							@click="toCreateAccount"
							class="text-primary text-decoration-none"
						>
							<span>&nbsp;Create an account</span>
						</b-link>
					</b-card-text>

					<!-- divider -->
					<!-- <div class="divider my-2">
						<div class="divider-text">or</div>
					</div> -->

					<!-- social buttons -->
					<!-- <div class="auth-footer-btn d-flex justify-content-center">
						<b-button
							variant="google"
							@click="signWithGoogle"
							block
							v-b-tooltip.hover.bottom="'Sign In With Google'"
						>
							<feather-icon icon="MailIcon" class="mr-25" />
							<span>Google Sign In</span>
						</b-button>
					</div> -->
				</b-col>
			</b-col>
			<!-- /Login-->
		</b-row>
	</div>
</template>

<script>
	/* eslint-disable global-require */
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import Logo from "@core/layouts/components/Logo.vue";
	import {
		BSpinner,
		BRow,
		BCol,
		BLink,
		BFormGroup,
		BFormInput,
		BInputGroupAppend,
		BInputGroup,
		BFormCheckbox,
		BCardText,
		BCardTitle,
		BImg,
		BForm,
		BButton,
		BAlert,
		VBTooltip,
	} from "bootstrap-vue";

	import { required, email } from "@validations";
	import { togglePasswordVisibility } from "@core/mixins/ui/forms";
	import store from "@/store/index";
	// import { getHomeRouteForLoggedInUser } from "@/auth/utils";
	import { setLocalstorage } from "@/helpers/user-helpers";

	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { sendEmailVerification, getAuth } from "firebase/auth";
	const auth = getAuth();
	export default {
		directives: {
			"b-tooltip": VBTooltip,
		},
		components: {
			BSpinner,
			BRow,
			BCol,
			BLink,
			BFormGroup,
			BFormInput,
			BInputGroupAppend,
			BInputGroup,
			BFormCheckbox,
			BCardText,
			BCardTitle,
			BImg,
			BForm,
			BButton,
			BAlert,
			Logo,
			ValidationProvider,
			ValidationObserver,
		},
		mixins: [togglePasswordVisibility],
		data() {
			return {
				status: "",
				password: "",
				userEmail: "",
				// sideImg: require("@/assets/images/pages/login-v2.svg"),
				sideImg: require("@/assets/images/fromtony/loginview.jpg"),
				isLogining: false,
				errorMessage: null,
				emailNotVerified: false,
				sendingVerificationEmail: false,

				// validation rules
				required,
				email,
			};
		},
		mounted() {
			// this.$store.dispatch("Auth/LOG_OUT").catch((err) => {});
			localStorage.removeItem("userData");
			localStorage.removeItem("isValid");
			localStorage.removeItem("isAdminIn");
		},

		computed: {
			passwordToggleIcon() {
				return this.passwordFieldType === "password"
					? "EyeIcon"
					: "EyeOffIcon";
			},
			imgUrl() {
				if (store.state.appConfig.layout.skin === "dark") {
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					// this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
					this.sideImg = require("@/assets/images/fromtony/loginview.jpg");
					return this.sideImg;
				}
				return this.sideImg;
			},
		},
		methods: {
			async signWithGoogle() {
				try {
					let response = await this.$store.dispatch(
						"Auth/SIGN_IN_WITH_GOOGLE"
					);

					if (response) {
						let resp2 = await this.$store.dispatch(
							"Users/GET_SINGLE_USER_BY_Id",
							{ id: response.user.uid }
						);

						let formObject = setLocalstorage(response.user, resp2);
						this.$store.commit("Auth/mCurrentUser", formObject);
						this.$toast({
							component: ToastificationContent,
							position: "top-right",
							props: {
								title: `All Good `,
								icon: "CoffeeIcon",
								variant: "success",
								text: `You have successfully signed in`,
							},
						});
						console.log(localStorage);
						this.$router.push({
							name: "auth-init",
						});
					}
				} catch (err) {
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "Error",
							text: `${err?.code || err?.message}`,
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
				}
			},
			toCreateAccount() {
				this.$router.push({
					name: "auth-register",
				});
			},
			resendVerificationMail() {
				this.sendingVerificationEmail = true;

				sendEmailVerification(auth?.currentUser)
					.then((resp) => {
						this.sendingVerificationEmail = false;
						this.emailNotVerified = false;
						this.errorMessage = null;
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Success",
								text: `Please check your email box, Verification instructions sent successfully `,
								icon: "CheckIcon",
								variant: "success",
							},
						});
					})
					.catch((err) => {
						this.sendingVerificationEmail = false;
					});
			},

			login() {
				this.$refs.loginForm.validate().then(async (success) => {
					if (!success) {
						this.$toast({
							component: ToastificationContent,
							position: "top-right",
							props: {
								title: `Opss`,
								icon: "AlertTriangleIcon",
								variant: "danger",
								text: `A required input box is empty, please check`,
							},
						});
						return false;
					}
					this.isLogining = true;
					let payload = {
						email: this.userEmail,
						password: this.password,
					};
					this.emailNotVerified = false;
					this.errorMessage = null;
					this.$store
						.dispatch("Auth/SIGN_IN", payload)
						.then((resp) => {
							if (!resp) {
								return false;
							}

							this.$store
								.dispatch("Users/GET_SINGLE_USER_BY_Id", {
									id: resp.user.uid,
								})
								.then((resp2) => {
									this.isLogining = false;
									let formObject = setLocalstorage(
										resp.user,
										resp2
									);

									this.$store.commit(
										"Auth/mCurrentUser",
										formObject
									);

									this.$router.push({
										name: "auth-init",
									});
								})
								.catch((err) => {
									console.log(err);
									this.isLogining = false;
								});
						})
						.catch((err) => {
							this.$toast({
								component: ToastificationContent,
								props: {
									title: "Error",
									text: `${err?.code || err?.message}`,
									icon: "AlertTriangleIcon",
									variant: "danger",
								},
							});
							this.errorMessage = err?.message;

							this.isLogining = false;
						});
				});
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-auth.scss";
	.brand-logo {
		@media only screen and (max-width: 992px) {
			display: none !important;
		}
	}
	.brand-logo-2 {
		@media only screen and (max-width: 991px) {
			padding-top: 2rem;
			padding-bottom: 2rem;
			display: flex !important;
			justify-content: center !important;
		}
	}
</style>
