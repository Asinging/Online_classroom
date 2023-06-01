<template>
	<div class="auth-wrapper auth-v2">
		<b-row class="auth-inner m-0">
			<!-- Brand logo-->
			<b-link class="brand-logo">
				<logo />
			</b-link>

			<b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
				<div
					class="w-100 d-lg-flex align-items-center justify-content-center px-5"
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
						title-tag="h2"
						class="font-weight-bold mb-1 text-center text-lg-left"
					>
						Welcome to O.C 👋
					</b-card-title>
					<b-card-text class="mb-2 text-center text-lg-left">
						Please sign-in to your account and start the adventure
					</b-card-text>
					<!-- <network-checker /> -->
					<!-- form -->
					<b-alert variant="danger" v-if="errorMessage">
						{{ errorMessage }}
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
											name: 'auth-forgot-password-v2',
										}"
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
						<b-link @click="toCreateAccount">
							<span>&nbsp;Create an account</span>
						</b-link>
					</b-card-text>

					<!-- divider -->
					<div class="divider my-2">
						<div class="divider-text">or</div>
					</div>

					<!-- social buttons -->
					<div class="auth-footer-btn d-flex justify-content-center">
						<b-button variant="facebook" href="javascript:void(0)">
							<feather-icon icon="FacebookIcon" />
						</b-button>
						<b-button variant="twitter" href="javascript:void(0)">
							<feather-icon icon="TwitterIcon" />
						</b-button>
						<b-button variant="google" href="javascript:void(0)">
							<feather-icon icon="MailIcon" />
						</b-button>
					</div>
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
	import useJwt from "@/auth/jwt/useJwt";
	import { required, email } from "@validations";
	import { togglePasswordVisibility } from "@core/mixins/ui/forms";
	import store from "@/store/index";
	import { getHomeRouteForLoggedInUser } from "@/auth/utils";

	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { onAuthStateChanged } from "firebase/auth";

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
				password: "admin",
				userEmail: "admin@demo.com",
				sideImg: require("@/assets/images/pages/login-v2.svg"),
				isLogining: false,
				errorMessage: null,

				// validation rules
				required,
				email,
			};
		},
		mounted() {
			this.$store.dispatch("Auth/LOG_OUT").catch((err) => {});
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
					this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
					return this.sideImg;
				}
				return this.sideImg;
			},
		},
		methods: {
			toCreateAccount() {
				this.$router.push({
					name: "auth-register",
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
					this.$store
						.dispatch("Auth/SIGN_IN", payload)
						.then((resp) => {
							this.isLogining = false;
							if (!resp) {
								return false;
							}

							this.$router.push({
								name: "auth-init",
							});
						})
						.catch((err) => {
							this.$toast({
								component: ToastificationContent,
								props: {
									title: "Error",
									text: `${err?.message}`,
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
