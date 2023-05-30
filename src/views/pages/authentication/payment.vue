<template>
	<!-- Under maintenance-->
	<div class="misc-wrapper">
		<b-link class="brand-logo">
			<vuexy-logo />
		</b-link>
		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center pb-10">
				<!-- <h3 class="mb-1">Payment Means</h3> -->
			</div>
			<div class="row">
				<div class="col col-sm-6">
					<payment-card
						title="Stripe"
						text="Pay with Strip"
						variant="danger"
					/>
				</div>
				<div class="col col-sm-6">
					<payment-card
						title="Paystack"
						text="Pay with Pay stack"
						variant="secondary"
					/>
				</div>
				<div class="col col-sm-6">
					<payment-card
						title="Card"
						text="Pay with Card"
						variant="info"
					/>
				</div>
				<div class="col col-sm-6">
					<payment-card
						title="Bank Transfer"
						text="Pay with banck transfer"
						variant="warning"
					/>
				</div>
			</div>
		</div>
	</div>
	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
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
	} from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	// import { HollowDotsSpinner } from "epic-spinners";
	import store from "@/store/index";
	import PaymentCard from "@/views/components/paymentCard.vue";

	export default {
		components: {
			BLink,
			BFormInput,
			BButton,
			BForm,
			BImg,
			BCard,
			BCardText,
			BCardTitle,
			BAvatar,
			PaymentCard,

			VuexyLogo,
		},
		data() {
			return {
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
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
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-misc.scss";
</style>
