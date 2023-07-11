<template>
	<div class="wrapper">
		<b-row class="">
			<b-col
				cols="12"
				md="12"
				lg="12"
				class="d-flex align-items-center mt-0 pt-0"
			>
				<b-col sm="12" md="12" lg="12" class="mx-auto pt-0">
					<b-card
						tag="article"
						v-if="currentUser"
						text-variant="center"
						variant="secondary"
						class="shadow-none rounded-100 mt-3 bg-secondary card border-0"
					>
						<div class="d-md-flex justify-content-between border-0">
							<b-img
								:src="
									require('@/assets/images/decore-right.png')
								"
								class="congratulations-img-left d-flex"
							/>
							<div
								class="text-danger d-flex justify-content-end text-md-right"
								v-if="notSubscribed"
							>
								<div class="d-flex">
									<span class="pr-1">
										<feather-icon
											icon="AlertTriangleIcon"
											class="text-danger"
											size="25"
										/>
									</span>
									<span
										class="font-weight-bold h4 text-danger"
										>Please Upgrade Account to access our
										premium services</span
									>
								</div>
							</div>
						</div>

						<div>
							<b-card-text
								class="mb-1 text-capitalize display-4 font-weight-bold text-white"
								style=""
							>
								{{
									new Date().getHours() > 12
										? "Good Day"
										: "Good Morning"
								}}
								{{ currentUser.username }}
							</b-card-text>
							<b-card-text
								class="mb-1 text-capitalize h1 text-white"
								style="font-size: 20px"
							>
								Welcome Back! Good to have you
							</b-card-text>
							<div
								class="mb-1 text-capitalize d-flex justify-content-between"
							>
								<div></div>

								<div class="d-flex justify-content-center">
									<b-button
										v-if="!emailVerified"
										@click="resendVerificationMail(false)"
										:disabled="
											sendingVerificationEmail ||
											verificationBtn > 0
										"
										class="mt-25"
										size="xl"
										:variant="
											verificationMsg ==
											'Please verify your email'
												? 'success'
												: 'danger'
										"
									>
										<span
											class="font-weight-bold h4 text-white"
											>{{ verificationMsg }}</span
										>
										<span class="py-1">
											<b-spinner
												v-if="sendingVerificationEmail"
												class="ml-1"
												small
											/>
										</span>
									</b-button>
									<b-button
										v-if="verificationBtn > 0"
										@click="resendVerificationMail(true)"
										:disabled="sendingVerificationEmail"
										class="ml-25"
										size="sm"
										:variant="'light'"
									>
										<span
											class="font-weight-bold h4 text-dark"
											>Resend</span
										>
									</b-button>
								</div>
								<div
									class="d-flex justify-content-end align-items-center"
								>
									<feather-icon
										size="28"
										icon="HomeIcon"
										color="white"
										@click="home"
										class="cursor-pointer"
										v-b-tooltip.hover.bottom
										title="Go to home"
									/>
								</div>
							</div>
						</div>
					</b-card>
				</b-col>
			</b-col>
			<b-col lg="12" cols="12" md="12" class="d-flex p-0 m-0 my-10">
				<b-card
					class="vw-100 shadow-none rounded-20 bg-light card border-0"
					tag="article"
				>
					<b-row align-h="center">
						<b-col cols="12" class="p-0 ma-0">
							<b-card
								class="d-flex justify-content-start shadow-none bg-light border-0"
								tag="article"
								style="min-height: 400px"
							>
								<div
									v-if="isRequesting"
									class="align-items-center d-flex justify-content-start"
								>
									<div class="container text-center">
										<b-spinner
											size="xl"
											class="text-center text-primary"
										></b-spinner>
									</div>
								</div>
								<div class="container" v-else-if="course">
									<div
										v-if="computeCourseDisplay.isIframe"
										class="iframe d-flex embed-responsive-item rounded-100 p-0 m-0"
										style="height: 70vh; width: 100%"
										v-html="computeCourseDisplay.video_url"
									></div>
									<div v-else class="iframe p-0 m-0">
										<b-embed
											class="embed-responsive-item"
											type="iframe"
											aspect="16by9"
											:src="
												computeCourseDisplay.video_url
											"
											allowfullscreen
										/>
									</div>
								</div>

								<b-card
									class="container d-flex align-items-center card p-0 m-0 border-0"
									v-else
									tag="div"
								>
									<div class="video-container">
										<b-alert
											variant="danger"
											show
											class="text-center"
										>
											<div
												class="alert-body text-center d-flex justify-content-between"
											>
												<span
													>No intro video uploaded
													yet.
												</span>
											</div>
										</b-alert>
									</div>
								</b-card>
							</b-card>
						</b-col>
						<b-col cols="12" class="mt-0">
							<b-card
								class="card w-auto d-flex align-items-center justify-content-center border-0"
								style="
									width: 100%;
									min-height: 150px;
									background-color: #acb3d9;
									margin-top: 0px;
								"
							>
								<b-card-text
									class="h2 font-weight-normal text-center text-white"
									>Watch Introduction and have a test of what
									we offer. This introduce you our effective
									training, teaching and mentorship on
									financial freedom</b-card-text
								>
							</b-card>
						</b-col>
					</b-row>
				</b-card>

				<!-- </div> -->
			</b-col>
		</b-row>
		<b-card
			class="card card_payment shadow-none bg-primary border-0"
			variant="primary"
		>
			<b-card-text
				class="h1 font-weight-normal text-center text-white mb-5 mt-3"
				>Pay with any of our verify payment Gateway</b-card-text
			>
			<div class="row">
				<div class="col-12 col-md-4">
					<payment-card
						v-b-modal.modal-flutterwave
						title="Flutterwave"
						text="Pay with flutter, with ease, you can pay with dollar"
						variant="danger"
					/>
				</div>
				<div class="col-12 col-md-4">
					<payment-card
						v-b-modal.modal-scrollable
						title="Paystack"
						text="Pay Using Paystack, The best we have verified here in nigeria"
						variant="secondary"
					/>
				</div>

				<div class="col-12 col-sm-12 col-md-4">
					<payment-card
						v-b-modal.modal-transfer
						title="Transfer"
						text="Pay with transfer, For the ease of transfer, make payment using bank transfer request for confirmation"
						variant="warning"
					/>
				</div>
			</div>
		</b-card>

		<b-modal
			ref="modalFlutterWave"
			id="modal-flutterwave"
			cancel-variant="outline-secondary"
			title="Pay Using flutterwave"
			ok-title="Submit"
		>
			<template slot="modal-ok">
				<flutterwave-pay-button
					v-bind="flutterwavePaymentData"
					variant="primary"
					class="btn btn-primary btn-sm"
				>
					Click To Pay
				</flutterwave-pay-button>
			</template>
			<div class="d-flex justify-content-center my-3">
				<div>
					<div class="font-weight-bold text-success h1">
						{{ numbFormat(1000, "en-US", "USD") }}
					</div>
				</div>
			</div>

			<validation-observer ref="payWithFlutterwave">
				<b-form>
					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Full Name"
							rules="required"
						>
							<b-form-input
								v-model="fulName"
								:state="errors.length > 0 ? false : null"
								placeholder="Agba John Doe"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Email"
							rules="required|email"
						>
							<b-form-input
								v-model="email"
								:state="errors.length > 0 ? false : null"
								type="email"
								placeholder="Your Email"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>

					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Phone"
							rules="required"
						>
							<b-form-input
								v-model="phone"
								:state="errors.length > 0 ? false : null"
								placeholder="Your Phone Number"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-form>
			</validation-observer>
		</b-modal>

		<b-modal
			id="modal-scrollable"
			title="Pay with PayStack"
			cancel-variant="outline-secondary"
		>
			<template slot="modal-ok">
				<paystack
					class="btn btn-primary btn-sm"
					:amount="amount * 100"
					:email="email"
					:paystackkey="paystackPublicKey"
					:reference="reference"
					:callback="processPaystackPayment"
					:close="closePayment"
				>
				</paystack>
			</template>
			<div class="d-flex justify-content-center my-3">
				<div>
					<div class="font-weight-bold text-success h1">
						{{ numbFormat(1000, "en-US", "USD") }}
					</div>
				</div>
			</div>
			<validation-observer ref="simpleRules">
				<b-form>
					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Email"
							rules="required|email"
						>
							<b-form-input
								v-model="email"
								:state="errors.length > 0 ? false : null"
								type="email"
								placeholder="Your Email"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-form>
			</validation-observer>
		</b-modal>

		<b-modal
			ref="modalTransferCash"
			id="modal-transfer"
			cancel-variant="outline-secondary"
			title="Submit Your Details"
			ok-title="Submit"
			@ok="handleOk"
		>
			<template slot="modal-ok">
				<b-button
					v-ripple.400="'rgba(234, 84, 85, 0.15)'"
					variant="primary"
					class="mt-0 text-right d-flex justify-content-end"
					:disabled="isSendingTransfer"
				>
					<feather-icon
						v-if="!isSendingTransfer"
						icon="UploadIcon"
						class="mr-25"
					/>
					<b-spinner v-else class="mr-25" small />
					<span>Ok</span>
				</b-button>
			</template>
			<div class="alert alert-success pa-2 my-2 text-center">
				Payment using transfers may take a while before confirmation,
				please bear with us as we resolve this issues
			</div>
			<div class="d-flex justify-content-center my-3">
				<div>
					<div class="font-weight-bold text-success h1">
						{{ numbFormat(1000, "en-US", "USD") }}
					</div>
				</div>
			</div>
			<validation-observer ref="transfersCash">
				<b-form>
					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Email"
							rules="required|email"
						>
							<b-form-input
								v-model="email"
								:state="errors.length > 0 ? false : null"
								type="email"
								placeholder="Your Email"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>

					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Phone"
							rules="required"
						>
							<b-form-input
								v-model="phone"
								:state="errors.length > 0 ? false : null"
								placeholder="Your Phone Number"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>

					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Transaction Reference"
							rules="required"
						>
							<b-form-input
								v-model="transRef"
								:state="errors.length > 0 ? false : null"
								placeholder="Paste Transaction Refs"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>

					<b-form-group>
						<validation-provider
							#default="{ errors }"
							name="Brief Description"
							rules="required"
						>
							<b-form-textarea
								v-model="body"
								rows="2"
								placeholder="Brief Description"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-form>
			</validation-observer>
		</b-modal>
	</div>

	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
	import { FlutterwavePayButton } from "flutterwave-vue-v3";
	import AnalyticsCongratulation from "@/views/dashboard/analytics/AnalyticsCongratulation.vue";
	import {
		BEmbed,
		BSpinner,
		BFormTextarea,
		BLink,
		BFormInput,
		BButton,
		BForm,
		BImg,
		BCard,
		BCardText,
		BCardTitle,
		BAvatar,
		BAlert,
		VBTooltip,
		BModal,
		VBModal,
		BFormGroup,
		BInputGroup,
		BRow,
		BCol,
	} from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	// import { HollowDotsSpinner } from "epic-spinners";
	import store from "@/store/index";
	import PaymentCard from "@/views/components/paymentCard.vue";
	import Ripple from "vue-ripple-directive";
	import paystack from "vue-paystack";
	// import {FlutterwavePayButton} from "flutterwave-vue-v3"
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { serverTimestamp } from "firebase/firestore";
	import { required, email } from "@validations";
	import { numbFormat } from "@/helpers/number-helpers/numberIndex";
	import { checkIframe } from "@/helpers/iframe-helpers";
	import { getAuth, sendEmailVerification } from "firebase/auth";
	const auth = getAuth();

	export default {
		directives: {
			Ripple,
			"b-tooltip": VBTooltip,
			"b-modal": VBModal,
		},
		components: {
			BEmbed,
			AnalyticsCongratulation,

			FlutterwavePayButton,
			BSpinner,
			BFormTextarea,
			ToastificationContent,
			BLink,
			BFormInput,
			BInputGroup,
			BButton,
			BForm,
			BImg,
			BCard,
			BCardText,
			BCardTitle,
			BAvatar,
			PaymentCard,
			BModal,
			VuexyLogo,
			BModal,
			BFormGroup,
			BAlert,

			BRow,
			BCol,
			ValidationProvider,
			ValidationObserver,
			paystack,
		},
		data() {
			return {
				notSubscribed: false,
				sendingVerificationEmail: false,
				verificationMsg: "Please verify your email",
				verificationBtn: 0,

				emailVerified: true,
				courseDisplay: null,
				course: null,
				isRequesting: true,
				isNotVerify: true,
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
				required,
				numbFormat,
				fulName: "",
				email: "",
				amount: 15000,
				paystackPublicKey:
					"pk_test_2682ed4a145e5a19e2ebe0d09c6ed25230130cad",
				transRef: "",
				phone: "",
				nameState: null,
				isSendingTransfer: false,
				body: "",
				flutterwavePaymentData: {
					tx_ref: this.generateReference(),
					amount: 15000,
					currency: "NGN",
					payment_options: "card,ussd",
					redirect_url: "",
					meta: {
						counsumer_id: "7898",
						consumer_mac: "kjs9s8ss7dd",
					},
					customer: {
						name: "10figuresacademy",
						email: "10figuresacademy@mail.com",
						phone_number: "0818450***44",
					},
					customizations: {
						title: "Payment testing",
						description: "Use this as payment testing",
						logo: "https://flutterwave.com/images/logo-colored.svg",
					},
					callback: this.makePaymentWithFlutterwave,
					onclose: this.closedPaymentModal,
				},
			};
		},
		created() {
			this.isRequesting = true;
			this.$store
				.dispatch("Course/GET_SINGLE_COURSE", {
					field: "intro_video",
					value: 1,
				})
				.then((response) => {
					this.isRequesting = false;
					if (!response) {
						return false;
					}
					this.courseDisplay = response.mudules[0];

					this.course = response;
				})
				.catch((err) => {
					this.isRequesting = false;
					console.log(err);
				});

			this.$store
				.dispatch("Users/GET_SINGLE_USER_BY_Id", {
					id: this.$store.getters["Auth/currentUserGetter"].id,
				})
				.then((resp) => {
					if (!resp.subscribed) {
						this.notSubscribed = true;
					}
				});

			if (auth) {
				let user = auth?.currentUser;
				this.emailVerified = user?.emailVerified;
			}
		},

		computed: {
			computeCourseDisplay() {
				return this.courseDisplay ? checkIframe(this.courseDisplay) : null;
			},

			currentUser() {
				let x = this.$store.getters["Auth/currentUserGetter"];

				return x;
			},

			currenUserId() {
				return this.$store.getters["Auth/currentUserGetter"].id;
			},

			reference() {
				let text = "";
				let possible =
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for (let i = 0; i < 10; i++) {
					text += possible.charAt(
						Math.floor(Math.random() * possible.length)
					);
				}
				return text;
			},
		},

		methods: {
			home() {
				this.$router.push("/welcome");
			},
			resendVerificationMail(resendEmail) {
				if (this.verificationBtn < 1 || resendEmail) {
					this.sendingVerificationEmail = true;

					sendEmailVerification(auth?.currentUser)
						.then((resp) => {
							this.verificationBtn = this.verificationBtn + 1;
							this.sendingVerificationEmail = false;

							this.verificationMsg =
								"Now check your mailbox for verification guides";
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
				}
			},
			makePaymentWithFlutterwave(response) {
				if (!val) {
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "Error",
							text: `An Error has occurred`,
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
					return false;
				}
				this.$toast({
					component: ToastificationContent,
					props: {
						title: "Oops, Service not available",
						text: `Please we have issues with payment using transfers, please use paystack while we resolve the issue, thanks for understanding`,
						icon: "XIcon",
						variant: "danger",
					},
				});

				if (val.status === "success") {
					localStorage.setItem("isValid", 1);
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "All Good",
							text: `Payment successfull`,
							icon: "CheckIcon",
							variant: "success",
						},
					});
					let transactions = {
						transRef: val.trxref,
						transId: val.trans,
					};

					let payload = {
						id: this.currenUserId,
						data: {
							transaction: transactions,
							subscribed: true,
						},
					};
					this.$store
						.dispatch("Users/UPDATE_SINGLE_USER", payload)
						.then((resp) => {
							this.$router.push("/");
						})
						.cath((err) => {
							console.log(err);
						});
					this.email = "";
					return false;
				}
			},
			closedPaymentModal() {
				console.log("payment is closed");
			},
			generateReference() {
				let date = new Date();
				return date.getTime().toString();
			},
			payWithTransfer() {
				this.$refs.transfersCash.validate().then((success) => {
					if (!success) {
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Oops",
								text: `One of the required field has been forgotten, please check!`,
								icon: "AlertTriagleIcon",
								variant: "danger",
							},
						});
						return false;
					}
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "Oops, Service not available",
							text: `Please we have issues with payment using transfers, please use paystack while we resolve the issue, thanks for understanding`,
							icon: "XIcon",
							variant: "danger",
						},
					});
					return false;

					let data = {
						create_at: serverTimestamp(),
						status: 1,
						subject: "Subscription Payment with Transfer",
						tag: "subscription, payment, transfer",
						category: "payment",
						email: this.email,
						user_id: this.currenUserId,
					};

					this.isSendingTransfer = true;
					this.$store
						.dispatch("Ticket/CREATE_TICKET", { data })
						.then((resp) => {
							this.$refs["modalTransferCash"].hide();

							this.isSendingTransfer = false;
							if (!resp) return false;
							this.subject = "";
							this.email = "";
							this.body = "";
							this.$toast({
								component: ToastificationContent,
								props: {
									title: "All Good",
									text: `Ticket created successfully! Issues will be addresss accordingly`,
									icon: "CheckIcon",
									variant: "success",
								},
							});
							this.$router.push({ name: "dashboard-analytics" });
						})
						.catch((err) => {
							this.isSendingTransfer = false;
							console.log(err);
						});
				});
			},

			checkFormValidity() {
				const valid = this.$refs.form.checkValidity();
				this.nameState = valid;
				return valid;
			},

			handleOk(bvModalEvent) {
				// Prevent modal from closing
				bvModalEvent.preventDefault();
				// Trigger submit handler
				this.payWithTransfer();
			},

			skipButton() {
				this.$router.push({ name: "dashboard-analytics" });
			},

			processPaystackPayment(val) {
				if (!val) {
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "Error",
							text: `An Error has occurred`,
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
					return false;
				}

				if (val.status === "success") {
					localStorage.setItem("isValid", 1);
					this.$toast({
						component: ToastificationContent,
						props: {
							title: "All Good",
							text: `Payment successfull`,
							icon: "CheckIcon",
							variant: "success",
						},
					});
					let transactions = {
						transRef: val.trxref,
						transId: val.trans,
					};

					let payload = {
						id: this.currenUserId,
						data: {
							transaction: transactions,
							subscribed: true,
						},
					};
					this.$store
						.dispatch("Users/UPDATE_SINGLE_USER", payload)
						.then((resp) => {
							this.$router.push({ name: "dashboard-analytics" });
						})
						.cath((err) => {
							console.log(err);
						});
					this.email = "";
					return false;
				}
			},

			closePayment(val) {
				this.$toast({
					component: ToastificationContent,
					props: {
						title: "Oh no",
						text: `The subscription proccess has been terminated, You can re-initiate again`,
						icon: "AlertTriangleIcon",
						variant: "danger",
					},
				});
				return false;
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-auth.scss";

	.wrapper {
		margin: 10px;
		// padding: 5px;
	}
	.card_payment {
		margin-top: 100px !important;
		margin-bottom: 100px !important;
	}

	.container {
		position: relative;
		display: flex;
		justify-content: center;
		max-width: 1000px !important; /* Adjust the value as per your preference */
		margin: 0 auto;
	}
	.video-container {
		position: relative;
	}

	.container_loader {
		height: 30vh;
	}
	.card {
		border-radius: 25px !important;
		margin: 0px !important;
		padding: 0px !important;
		margin-top: 35px !important;
		// margin-bottom:20px !important;
	}
	.introCard {
		border-radius: 25px !important;
	}
	iframe {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		margin: 0;
		width: 100%;

		height: 100%;

		border: 0px !important;
		border-radius: 30px !important;
	}
</style>
