<template>
	<div class="wrapper">
		<b-row class="">
			<b-col
				cols="12"
				md="12"
				lg="12"
				class="d-flex align-items-center mt-0 pt-0"
			>
				<!-- v-if="currentUser" -->
				<b-col sm="12" md="12" lg="12" class="mx-auto pt-0">
					<b-card
						tag="article"
						text-variant="center"
						class="shadow-none rounded-100 mt-1 bg-secondary card border-0 header-card"
					>
						<div class="d-md-flex justify-content-between">
							<b-img
								:src="
									require('@/assets/images/decore-right.png')
								"
								class="congratulations-img-left d-none d-md-block"
							/>
							<div
								class="text-md-right my-1 mt-md-0"
								v-if="notSubscribed"
							>
								<div
									class="d-flex bg-light px-25 rounded-5 subscription-alert justify-content-start"
								>
									<span class="pr-1">
										<feather-icon
											icon="AlertTriangleIcon"
											class="text-danger"
											size="25"
										/>
									</span>
									<span
										class="font-weight-bold h4 text-danger text-left"
										>Please Upgrade Account to access our
										premium services</span
									>
								</div>
							</div>
							<div class="" v-else>
								<button
									type="button"
									class="btn btn-outline-light btn-sm p-auto"
									v-ripple.400="'rgba(113, 102, 240, 0.15)'"
									@click="toDashboard"
								>
									<feather-icon
										icon="GridIcon"
										class="mr-50"
										size="18"
									/>
									<span
										class="align-middle font-weight-bold"
										size="sm"
										>Go to Dashboard</span
									>
								</button>
							</div>
						</div>

						<div class="my-3 my-md-0">
							<b-card-text
								class="mb-1 text-capitalize display-3 text-responsive font-weight-bold text-white"
								style=""
							>
								{{
									new Date().getHours() > 12
										? "Good Day"
										: "Good Morning"
								}}
								{{ currentUser ? currentUser.username : "" }}
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
												? 'danger'
												: 'success'
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
											class="font-weight-bold h5 text-dark"
											>Resend</span
										>
									</b-button>
								</div>
								<div
									class="d-flex justify-content-end align-items-center px-1"
								>
									<b-avatar
										variant="secondary"
										v-b-tooltip.hover.bottom
										title="Go to home"
										class="cursor-pointer"
									>
										<feather-icon
											size="18"
											icon="HomeIcon"
											color="white"
											v-ripple.400="
												'rgba(234, 84, 85, 0.15)'
											"
											@click="home"
										/>
									</b-avatar>
								</div>
							</div>
						</div>
					</b-card>
				</b-col>
			</b-col>
			<b-col lg="12" cols="12" md="12" class="d-flex p-0 m-0 mx-auto">
				<b-card
					class="shadow-none rounded-20 bg-light card border-0 body-card mx-2"
					tag="article"
				>
					<b-row align-h="center">
						<b-col cols="12">
							<div class="body-card-div my-3 mb-5">
								<p
									class="display-4 body-card-div-text text-dark text-black text-center"
								>
									This is the best platform you can be at the
									moment, You can watch our Introduction video
								</p>
							</div>
						</b-col>

						<b-col cols="12" class="p-0 ma-0 my-5 mt-5">
							<b-row>
								<b-col cols="12" md="6">
									<div class="human-intro d-flex">
										<b-img
											:src="
												require('@/assets/images/introducevideo.ac68531f.png')
											"
											class="img-responsive img-fluid"
										/>
									</div>
								</b-col>
								<b-col cols="12" md="6">
									<div
										style="hieght: 100%"
										class="align-items-md-center my-1 my-md-0 mx-1"
									>
										<div
											v-if="isRequesting"
											class="align-items-center d-flex justify-content-center mt-2"
										>
											<b-spinner
												size="xl"
												class="text-center text-primary"
											></b-spinner>
										</div>

										<div
											v-else-if="
												course &&
												computeCourseDisplay.isIframe
											"
											class="iframe2 p-0 m-0 embed-responsive embed-responsive-16by9"
											v-html="
												computeCourseDisplay.video_url
											"
										></div>
									</div>
								</b-col>
							</b-row>
						</b-col>
						<b-col cols="12" class="my-2 mt-md-5">
							<b-row>
								<b-col cols="12" md="6">
									<div
										class="footer-card d-flex justify-content-center"
									>
										<div
											style="hieght: 100%"
											class="d-flex align-items-center justify-content-center"
										>
											<p
												class="footer-card-text text-center font-weight-bold text-dark h2"
											>
												One of the greatest ways, our
												students optimally utilized our
												platform is by ensuring they
												learn from the comfort of their
												study space! With this the
												platform has welcome more
												student that we can mention!
											</p>
										</div>
									</div>
								</b-col>
								<b-col cols="12" md="6">
									<div
										class="footer-card d-flex my-1 justify-content-center justify-content-md-end"
									>
										<div class="people_reading">
											<b-img
												:src="
													require('@/assets/images/peopleLearning.webp')
												"
												style="max-height: 270px"
												class="img-responsive img-fluid"
											/>
										</div>
									</div>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</b-card>
			</b-col>
		</b-row>
		<b-card
			class="card card_payment shadow-none bg-primary border-0"
			v-if="notSubscribed"
			variant="primary"
		>
			<b-card-text
				class="h1 font-weight-normal text-center text-white mb-5 mt-3 payment-text"
				>Pay with any of our verified payment Gateway</b-card-text
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
					<div class="font-weight-bold text-primary display-4">
						{{ numbFormat(15, "en-US", "USD") }}
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
					<div class="font-weight-bold text-primary display-4">
						{{ numbFormat(15, "en-US", "USD") }}
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
			size="md"
			v-b-modal.modal-md
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
			<div class="pa-2 my-2 text-center font-weight-bold h4">
				Payment using transfers may take a while before confirmation,
				please bear with us as we resolve this issues
			</div>

			<div class="d-flex justify-content-center my-3">
				<div>
					<div class="font-weight-bold text-primary display-4">
						{{ numbFormat(15, "en-US", "USD") }}
					</div>
				</div>
			</div>
			<div
				class="d-flex justify-content-center primary bg-primary py-1 rounded-1 card"
			>
				<div class="mx-1">
					<p class="d-flex font-weight-bold">
						<span class="text-white font-weight-bold">
							Account Name :</span
						>
						<span class="pl-1 text-white font-weight-bold">
							Pounds Klassik Premium Project
						</span>
					</p>
					<p class="d-flex font-weight-bold">
						<span class="text-white font-weight-bold">
							Account Number :</span
						>
						<span class="text-white font-weight-bold pl-1">
							1015469540
						</span>
					</p>
					<p class="d-flex font-weight-bold">
						<span class="text-white font-weight-bold">
							Bank Name :</span
						>
						<span class="text-white font-weight-bold pl-1">
							Zenith Bank
						</span>
					</p>
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
				notSubscribed: true,
				sendingVerificationEmail: false,
				verificationMsg: "Please verify your email",
				verificationBtn: 0,

				emailVerified: false,
				courseDisplay: null,
				course: null,
				isRequesting: true,
				isNotVerify: true,
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
				required,
				numbFormat,
				fulName: "",
				email: "",
				amount: 15,
				paystackPublicKey:
					// "pk_test_2682ed4a145e5a19e2ebe0d09c6ed25230130cad", demo
					"pk_live_2b9a5b4f237c04ace3b3f328950d078a0a41f67a",
				transRef: "",
				phone: "",
				nameState: null,
				isSendingTransfer: false,
				body: "",
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
			let id = this.$store.getters["Auth/currentUserGetter"].id;

			this.$store
				.dispatch("Users/GET_SINGLE_USER_BY_Id", {
					id: id,
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
			flutterwavePaymentData() {
				return {
					tx_ref: this.generateReference(),
					amount: 15,
					currency: "USD",
					payment_options: "card,ussd",
					redirect_url: "",
					meta: {
						counsumer_id: this.currenUserId,
						consumer_mac: "kjs9s8ss7dd",
					},
					customer: {
						name: "Our Highly esteem customer",
						email: this.email,
						phone_number: this.phone,
					},
					customizations: {
						title: "Wealth Link Platform Payment",
						description:
							"This payment allows you acces to the Wealth link platform",
						logo: "https://flutterwave.com/images/logo-colored.svg",
					},
					callback: this.makePaymentWithFlutterwave,
					onclose: this.closedPaymentModal,
				};
			},
			computeCourseDisplay() {
				return this.courseDisplay ? checkIframe(this.courseDisplay) : null;
			},

			currentUser() {
				let x = this.$store.getters["Auth/currentUserGetter"];
				return x;
			},

			currenUserId() {
				let x = this.$store.getters["Auth/currentUserGetter"];
				return x ? x.id : "1111";
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
			toDashboard() {
				let isAdmin = store.getters["appConfig/whoIsinGetter"];
				if (isAdmin) {
					this.$router.push("/admin/dashboard");
					return true;
				}

				this.$router.push("/");
			},
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
					sessionStorage.setItem("isValid", true);
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
							this.$store.commit(
								"appConfig/UPDATE_USER_SUBSCRIPTION",
								true
							);
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
					sessionStorage.setItem("isValid", true);
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
							this.$store.commit(
								"appConfig/UPDATE_USER_SUBSCRIPTION",
								true
							);
							this.$router.push("/");
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

<style lang="scss" scoped  >
	.wrapper {
		margin: 10px;
		margin-top: 0px;
		// background:red
		// padding: 5px;
	}

	.header-card {
		background-image: url("../../../assets/images/cardBackgound.jpg");
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
	}
	.body-card {
		background-image: url("../../../assets/images/background4.4ab67b51.jpg");
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
	}
	.subscription-alert {
		border-radius: 5px;
	}
	// .people_reading {
	// 	background-image: url("../../../assets/images/peopleLearning.webp");
	// 	background-repeat: no-repeat;
	// 	background-position: center center;
	// 	background-size: cover;
	// }

	.footer-card-text {
		line-height: 2;
		font-weight: 800 !important;
		font-family: Arial, Helvetica, sans-serif;
	}
	.body-card-div-text {
		font-weight: 500 !important;
		font-family: Arial, Helvetica, sans-serif;
	}
	.card_payment {
		margin-top: 0px;
		margin-bottom: 100px;
	}

	.iframe2 {
		position: relative;
		overflow: hidden;
		padding-top: 56.25%;

		max-height: 500px;
	}
	.iframe2 iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 30px;
		// border-radius: 12px !important;

		border: 0; /* Remove iframe border */
	}
	.payment-text {
		font-weight: 800 !important;
		font-family: Arial, Helvetica, sans-serif;
	}
</style>
