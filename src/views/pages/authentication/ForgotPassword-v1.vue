<template>
	<div class="auth-wrapper auth-v1 px-2">
		<div class="auth-inner py-2">
			<!-- Forgot Password v1 -->
			<b-card class="mb-0">
				<b-link class="brand-logo">
					<!-- logo -->
					<vuexy-logo />

					<!-- <h2 class="brand-text text-primary ml-1">O.C</h2> -->
				</b-link>

				<b-card-title class="mb-1 text-center">
					Forgot Password? 🔒
				</b-card-title>
				<b-card-text class="mb-2">
					Enter your email address and we'll send you instructions to
					reset your password
				</b-card-text>

				<b-alert
					variant="success"
					v-if="passwordResetLinkSent"
					show
					class="text-center"
				>
					<div class="alert-body text-center">
						Check your mailbox for password reset link!!!
					</div>
				</b-alert>
				<!-- form -->
				<validation-observer ref="simpleRules">
					<b-form
						class="auth-forgot-password-form mt-2"
						@submit.prevent="validationForm"
					>
						<!-- email -->
						<b-form-group
							label="Email"
							label-for="forgot-password-email"
						>
							<validation-provider
								#default="{ errors }"
								name="Email"
								rules="required|email"
							>
								<b-form-input
									id="forgot-password-email"
									v-model="userEmail"
									:state="errors.length > 0 ? false : null"
									name="forgot-password-email"
									placeholder="john@example.com"
								/>
								<small class="text-danger">{{
									errors[0]
								}}</small>
							</validation-provider>
						</b-form-group>

						<!-- submit button -->
						<b-button
							variant="primary"
							block
							type="submit"
							:disabled="isSending || passwordResetLinkSent"
						>
							Send reset link
							<span class="pl-1">
								<span v-if="!isSending">
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
					<b-link :to="{ name: 'auth-login-v1' }">
						<feather-icon icon="ChevronLeftIcon" /> Back to login
					</b-link>
				</b-card-text>
			</b-card>
			<!-- /Forgot Password v1 -->
		</div>
	</div>
</template>

<script>
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	import {
		BSpinner,
		BCard,
		BLink,
		BCardText,
		BCardTitle,
		BFormGroup,
		BFormInput,
		BForm,
		BButton,
		BAlert,
	} from "bootstrap-vue";
	import { required, email } from "@validations";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

	export default {
		components: {
			BAlert,
			BSpinner,
			VuexyLogo,
			BCard,
			BLink,
			BCardText,
			BCardTitle,
			BFormGroup,
			BFormInput,
			BButton,
			BForm,
			ValidationProvider,
			ValidationObserver,
		},
		data() {
			return {
				userEmail: "",
				isSending: false,
				passwordResetLinkSent: false,
				// validation
				required,
				email,
			};
		},
		methods: {
			validationForm() {
				this.passwordResetLinkSent = false;
				this.$refs.simpleRules.validate().then((success) => {
					if (!success) return false;
					this.isSending = true;
					let userEmail = this.userEmail;
					this.$store
						.dispatch("Auth/FORGOT_PASSWORD", { userEmail })
						.then((resp) => {
							this.isSending = false;
							this.passwordResetLinkSent = true;
							this.userEmail = "";
							this.$toast({
								component: ToastificationContent,
								position: "top-right",
								props: {
									title: `Email Sent`,
									icon: "CoffeeIcon",
									variant: "success",
									text: `Check you email box and follow instructions how to reset it`,
								},
							});
							this.$router.push({
								name: "auth-login",
							});
						})
						.catch((err) => {
							this.isSending = false;
							this.$toast({
								component: ToastificationContent,
								props: {
									title: "Error",
									text: `${err?.code || err?.message}`,
									icon: "AlertTriangleIcon",
									variant: "danger",
								},
							});
						});
				});
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-auth.scss";
</style>
