<template>
	<!-- Under maintenance-->
	<div class="misc-wrapper">
		<!-- <b-link class="brand-logo">
			<feather-icon
				icon="ArrowLeftIcon"
				size="16"
				class="mr-0 mr-sm-50"
			/>
		</b-link> -->

		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center">
				<h2 class="mb-1">Join Global Class room 🤝</h2>

				<p class="mb-3">
					<b-button
						v-ripple.400="'rgba(113, 102, 240, 0.15)'"
						variant="info"
						class="mb-1 btn-xl-block"
						type="submit"
						@click="toTelegram"
					>
						<feather-icon
							icon="SendIcon"
							size="16"
							class="mr-0 mr-sm-50"
						/>
						<span class="ml-1"> Connect on Telegram</span>
					</b-button>
				</p>

				<!-- <VueTelegramAuth /> -->

				<!-- img -->
				<b-img fluid :src="imgUrl" alt="Under maintenance page" />
			</div>
		</div>
	</div>
	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
	import Vue from "vue";
	import { BLink, BFormInput, BButton, BForm, BImg } from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	import store from "@/store/index";
	import Ripple from "vue-ripple-directive";
	// import VueTelegram from "vue-telegram-plugin";

	// Vue.use(VueTelegram, {
	// 	useTestDC: true,
	// 	useDatabase: true,
	// 	apiId: "26529152",
	// 	apiHash: "a067c6937a8bd0c2bace97cc6706c22e",
	// });
	// Vue.$vTelegram.init();
	export default {
		directives: {
			Ripple,
		},
		components: {
			BLink,
			BFormInput,
			BButton,
			BForm,
			BImg,
			VuexyLogo,
		},
		data() {
			return {
				downImg: require("@/assets/images/pages/coming-soon.svg"),
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
		methods: {
			toTelegram() {
				window.open("https://web.telegram.org/k/", "_blank");
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-misc.scss";
</style>
