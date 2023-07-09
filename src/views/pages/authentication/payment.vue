<template>
	<!-- Under maintenance-->
	<div class="misc-wrapper">
		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center pb-10">
				<!-- <h3 class="mb-1">Payment Means</h3> -->
			</div>
			<div class="row">
				<div class="col col-sm-4">
					<payment-card
						v-b-modal.modal-flutterwave
						title="Flutterwave"
						text="Pay with Stripe"
						variant="danger"
						@click="handlePayment('st')"
					/>
				</div>
				<div class="col col-sm-4">
					<payment-card
						v-b-modal.modal-scrollable
						title="Paystack"
						text="Pay with Paystack"
						variant="secondary"
						@click="handlePayment('ps')"
					/>
				</div>

				<div class="col col-sm-4">
					<payment-card
						v-b-modal.modal-transfer
						title="Transfer"
						text="Pay with transfer"
						variant="warning"
						@click="handlePayment('bt')"
					/>
				</div>

				<div class="col col-sm-12 d-flex justify-content-end">
					<!-- <b-button
						v-ripple.400="'rgba(255, 255, 255, 0.15)'"
						variant="success"
						@click="skipButton"
						v-b-tooltip.hover.bottom="'Skip Payment'"
					>
						<span>Skip</span>
					</b-button> -->
				</div>
			</div>

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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
					Payment using transfers may take a while before
					confirmation, please bear with us as we resolve this issues
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
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
								<small class="text-danger">{{
									errors[0]
								}}</small>
							</validation-provider>
						</b-form-group>
					</b-form>
				</validation-observer>
			</b-modal>
		</div>
	</div>
	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
	import { FlutterwavePayButton } from "flutterwave-vue-v3";
	import {
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

	export default {
		directives: {
			Ripple,
			"b-tooltip": VBTooltip,
			"b-modal": VBModal,
		},
		components: {
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

			BRow,
			BCol,
			ValidationProvider,
			ValidationObserver,
			paystack,
		},
		data() {
			return {
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
				required,
				numbFormat,
				fulName: "",
				email: "",
				amount: 1000,
				paystackPublicKey:
					"pk_test_2682ed4a145e5a19e2ebe0d09c6ed25230130cad",
				transRef: "",
				phone: "",
				nameState: null,
				isSendingTransfer: false,
				body: "",
				flutterwavePaymentData: {
					tx_ref: this.generateReference(),
					amount: 1000,
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

		computed: {
			imgUrl() {
				if (store.state.appConfig.layout.skin === "dark") {
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.downImg = require("@/assets/images/pages/under-maintenance-dark.svg");
					return this.downImg;
				}
				return this.downImg;
			},

			currenUserId() {
				return this.$store.getters["Auth/currentUserGetter"].id;
			},

			reference() {
				let text = "";
				let possible =
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for (let i = 0; i < 10; i++)
					text += possible.charAt(
						Math.floor(Math.random() * possible.length)
					);

				return text;
			},
		},
		methods: {
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
	@import "@core/scss/vue/pages/page-misc.scss";
</style>
q