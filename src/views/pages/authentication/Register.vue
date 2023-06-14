<template>
	<div class="auth-wrapper auth-v2">
		<b-row class="auth-inner m-0">
			<b-link class="brand-logo">
				<logo />
			</b-link>

			<b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
				<div
					class="w-100 d-lg-flex align-items-center justify-content-center px-5"
				>
					<b-img fluid :src="imgUrl" alt="Register V2" />
				</div>
			</b-col>

			<!-- Left Text-->
			<!-- <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
				<div
					class="w-100 d-lg-flex align-items-center justify-content-center px-5"
				>
					<b-img fluid :src="imgUrl" alt="Register V2" />
				</div>
			</b-col> -->
			<!-- /Left Text-->

			<!-- Register-->
			<b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
				<b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
					<b-link class="brand-logo-2 d-none">
						<logo />
					</b-link>
					<b-card-title class="font-weight-bold mb-1 text-center">
						Sign Up to begin 🚀
					</b-card-title>
					<b-card-text class="mb-2 text-center">
						The possibilities are endless!
					</b-card-text>

					<b-alert
						variant="danger"
						v-if="emailVerificationSent"
						show
						class="text-center"
					>
						<div class="alert-body text-center d-flex justify-content-between">
							<span>Check your mailbox for verification link!!! </span>
							<b-link
							variant="danger"
								@click="resendVerificationMail"
								class="text-danger cursor-pointer"
							>
							Resend	
							</b-link>
						</div>
					</b-alert>

					<!-- form -->
					<validation-observer
						ref="registerUserForm"
						#default="{ invalid }"
					>
						<b-form
							class="auth-register-form mt-2"
							@submit.prevent="registerUser"
						>
							<!-- username -->
							<b-form-group
								label="Username"
								label-for="register-username"
							>
								<validation-provider
									#default="{ errors }"
									name="Username"
									vid="username"
									rules="required"
								>
									<b-form-input
										id="register-username"
										v-model="username"
										name="register-username"
										lazy-formatter
										:formatter="formatter"
										:state="
											errors.length > 0 ? false : null
										"
										placeholder="johndoe"
									/>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>

							<!-- email -->
							<b-form-group
								label="Email"
								label-for="register-email"
							>
								<validation-provider
									#default="{ errors }"
									name="Email"
									vid="email"
									rules="required|email"
								>
									<b-form-input
										id="register-email"
										v-model="userEmail"
										name="register-email"
										:state="
											errors.length > 0 ? false : null
										"
										placeholder="john@example.com"
									/>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>

							<!-- password -->
							<b-form-group
								label-for="register-password"
								label="Password"
							>
								<validation-provider
									#default="{ errors }"
									name="Password"
									vid="password"
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
											id="register-password"
											v-model="password"
											class="form-control-merge"
											:type="passwordFieldType"
											:state="
												errors.length > 0 ? false : null
											"
											name="register-password"
											placeholder="············"
										/>
										<b-input-group-append is-text>
											<feather-icon
												:icon="passwordToggleIcon"
												class="cursor-pointer"
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

							<!-- <b-form-group>
								<validation-provider
									#default="{ errors }"
									name="Privacy Policies"
									vid="PrivacyPolicy"
									rules="required"
								>
									<b-form-checkbox
										id="register-privacy-policy"
										v-model="status"
										name="checkbox-1"
										:state="
											errors.length > 0 ? false : null
										"
									>
										I agree to
										<b-link>privacy policy & terms</b-link>
									</b-form-checkbox>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group> -->
							<b-button
								type="submit"
								variant="primary"
								class="pb-1"
								block
								@click="registerUser"
								:disabled="
									isSigningUp ||
									invalid ||
									emailVerificationSent
								"
							>
								<span>Sign Up</span>
								<span class="pl-1">
									<span v-if="!isSigningUp">
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

					<p class="text-center mt-2">
						<span>Already have an account?</span>
						<b-link :to="{ name: 'auth-login' }">
							<span>&nbsp;Sign in instead</span>
						</b-link>
					</p>
				</b-col>
			</b-col>
			<!-- /Register-->
		</b-row>
	</div>
</template>

<script>
	/* eslint-disable global-require */
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import Logo from "@core/layouts/components/Logo.vue";
	import { authentication } from "@/config/firebase.js";
	import {
		BSpinner,
		BRow,
		BCol,
		BLink,
		BButton,
		BForm,
		BFormCheckbox,
		BFormGroup,
		BFormInput,
		BInputGroup,
		BInputGroupAppend,
		BImg,
		BCardTitle,
		BCardText,
		BAlert,
	} from "bootstrap-vue";
	import { required, email } from "@validations";
	import { togglePasswordVisibility } from "@core/mixins/ui/forms";
	import store from "@/store/index";
	import { serverTimestamp } from "firebase/firestore";
	import { onAuthStateChanged, sendEmailVerification, getAuth } from "firebase/auth";


	import { setLocalstorage } from "@/helpers/user-helpers";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
const auth = getAuth();
	export default {
		components: {
			BAlert,
			BSpinner,
			Logo,
			BRow,
			BImg,
			BCol,
			BLink,
			BButton,
			BForm,
			BCardText,
			BCardTitle,
			BFormCheckbox,
			BFormGroup,
			BFormInput,
			BInputGroup,
			BInputGroupAppend,
			// validations
			ValidationProvider,
			ValidationObserver,
			ToastificationContent,
		},
		mixins: [togglePasswordVisibility],
		data() {
			return {
				status: "",
				username: "",
				userEmail: "",
				password: "",
				isSigningUp: false,
				sideImg: require("@/assets/images/pages/register-v2.svg"),
				// validation
				required,
				email,
				user: null,
				emailVerificationSent: false,
				events: ["click", "mousedown", "scroll", "keypress", "mouseover"],
			};
		},
		watch: {
			user: {
				deep: true,
				handler(val) {
					if (!val) return false;

					if (val.emailVerified) {

						this.events.forEach((event) => {
							window.removeEventListener(event, this.runTimer);
						});
						this.emailVerificationSent = false

						this.userEmail = "";
						this.userName = "";
						this.password = "";

						this.$router.push({
							name: "auth-init",
						});


						
						return false;
					}

					if (!this.emailVerificationSent) {
						this.emailVerificationSent = true;
						sendEmailVerification(auth?.currentUser)
							.then(() => {
								
							})
							.catch((err) => console.log(err));

					}
					return false
				},
			},
		},
		mounted() {
			this.events.forEach((event) => {
				window.addEventListener(event, this.runTimer);
			});
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
					this.sideImg = require("@/assets/images/pages/register-v2-dark.svg");
					return this.sideImg;
				}
				return this.sideImg;
			},
		},
		methods: {
		formatter(value){
				if(!value) return ''
					return value.toLowerCase().trim()
			}, 
			resendVerificationMail(){
				this.emailVerificationSent = true;
				sendEmailVerification(auth?.currentUser)
						.then(() => {
						})
						.catch((err) => console.log(err));
				
			},
			registerUser() {
				this.$refs.registerUserForm.validate().then(async (success) => {
					if (!success) {
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Some Fields are still empty",
								icon: "AlertTriangleIcon",
								variant: "danger",
							},
						});
						return;
					}
					if (this.password.length < 6) {
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Passwords Length",
								text: "Passwords must be at least 6 characters long",
								icon: "AlertTriangleIcon",
								variant: "danger",
							},
						});
						return;
					}
					let payload = {
						email: this.userEmail,
						password: this.password,
						displayName: this.username,
					};
					this.isSigningUp = true;

					this.$store
						.dispatch("Auth/SIGN_UP", payload)
						.then((resp) => {
							// this.emailVerificationSent = true;

							let formObject = setLocalstorage(
								authentication.currentUser,
								{
									user_type: 2,
								}
							);

							this.$store.commit("Auth/mCurrentUser", formObject);
							let data = {};
							data.created_at = serverTimestamp();
							data.created_by = "admin";
							data.updated_at = null;
							data.is_root = false;
							data.subscribed = false;
							data.enabled = 1;
							data.status = 1;

							data.email = this.userEmail;
							data.username = this.username;
							data.f_name = "";
							data.who_create = "";
							data.user_type = 2;

							data.user_UID = resp?.user.uid;
							// this.userEmail = "";
							// this.userName = "";
							// this.password = "";

							this.$store
								.dispatch("Users/CREATE_USER", {
									createUserWithEmail: true,
									data,
								})
								.then(async (resp2) => {
									this.isSigningUp = false;
								})
								.catch((err) => {
									console.log(err);
								});

							// this.events.forEach((event) => {
							// 	window.addEventListener(event, this.runTimer);
							// });
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
							
							this.isSigningUp = false;
							console.log(err);
						});
				});
			},
			runTimer() {
			
				onAuthStateChanged(auth, (user) => {
				
			if(!user) return false
					this.user = user;
				});
			},

			logout() {
				this.$store
					.dispatch("Auth/LOG_OUT")
					.catch((err) => console.log(er));
			},
		},
	};
	/* eslint-disable global-require */
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
