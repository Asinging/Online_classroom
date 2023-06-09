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
						text="Pay in Paystack"
						variant="secondary"
						@click="handlePayment('ps')"
					/>
				</div>

				<div class="col col-sm-4">
					<payment-card
						v-b-modal.modal-transfer
						title="Bank Transfer"
						text="Pay with transfer"
						variant="warning"
						@click="handlePayment('bt')"
					/>
				</div>

				<div class="col col-sm-12 d-flex justify-content-end">
					<b-button
						v-ripple.400="'rgba(255, 255, 255, 0.15)'"
						variant="success"
						@click="skipButton"
						v-b-tooltip.hover.bottom="'Skip Payment'"
					>
						<span>Skip</span>
					</b-button>
				</div>
			</div>

			<b-modal
				id="modal-scrollable"
				scrollable
				title="Pay with PayStack"
				cancel-variant="outline-secondary"
			>
				<template slot="modal-ok">
					<paystack
						class="btn btn-primary btn-sm"
						:amount="amount * 100"
						:email="email"
						:paystackkey="PUBLIC_KEY"
						:reference="reference"
						:callback="processPayment"
						:close="closePayment"
					>
					</paystack>
				</template>
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

						<b-input-group
							prepend="$"
							append=".00"
							class="input-group-merge"
						>
							<b-form-input
								v-model="amount"
								placeholder="100"
								disabled
							/>
						</b-input-group>
					</b-form>
				</validation-observer>
			</b-modal>

			<b-modal
				id="modal-transfer"
				cancel-variant="outline-secondary"
				title="Submit Your Details"
				ok-title="Submit"
				@ok="handleOk"
			>
				<div class="alert alert-success pa-2 my-2 text-center">
					Payment using transfers may take a while before
					confirmation, please bear with us as we resolve this issues
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
						<b-input-group
							prepend="$"
							append=".00"
							class="input-group-merge"
						>
							<b-form-input
								v-model="amount"
								placeholder="100"
								disabled
							/>
						</b-input-group>
					</b-form>
				</validation-observer>
			</b-modal>
		</div>
	</div>
	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
	// import Flutterwave from  'flutterwave-vue-v3'
	import {
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

	import { required, email } from "@validations";

	export default {
		directives: {
			Ripple,
			"b-tooltip": VBTooltip,
			"b-modal": VBModal,
		},
		components: {
			// FlutterwavePayButton,
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

				email: "",
				amount: 1000,
				PUBLIC_KEY: "pk_test_c610dd4b558b5813504dab0bf26eee446c7c5b29",
				transRef: "",
				phone: "",
				nameState: null,
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
			checkFormValidity() {
				const valid = this.$refs.form.checkValidity();
				this.nameState = valid;
				return valid;
			},
			handleOk(bvModalEvt) {
				this.$refs.transfersCash.validate().then((success) => {
					if (!success) {
						this.$toast({
							component: ToastificationContent,
							props: {
								title: "Oops",
								text: `Some required field are empty. please check!`,
								icon: "AlertTriangleIcon",
								variant: "danger",
							},
						});
						return false;
					}

					this.$toast({
						component: ToastificationContent,
						props: {
							title: "All Sent",
							text: `Transaction Details succefully submitted`,
							icon: "CheckIcon",
							variant: "Success",
						},
					});
				});
			},
			skipButton() {
				this.$router.push("/");
			},
			processPayment(val) {
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
				}
				if (val.staus === "success") {
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
					this.store
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

			validationForm() {
				this.$refs.simpleRules.validate().then((success) => {
					if (success) {
						// eslint-disable-next-line
						alert("form submitted!");
					}
				});
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-misc.scss";
</style>
