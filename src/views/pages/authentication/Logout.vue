<template>
	<!-- Error page-->
	<div class="misc-wrapper">
		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center">
				<h2 class="mb-1">LOGGED OUT !🔻</h2>
				<p class="mb-2">
					Bye!. Do have a great day ahead from Wealth Think
				</p>
				<p class="">
					<b-button
						variant="primary"
						class="mb-2 btn-sm-block"
						:to="{ path: '/login' }"
					>
						Login
					</b-button>
				</p>

				<!-- image -->
				<b-img fluid :src="imgUrl" alt="Error page" />
			</div>
		</div>
	</div>
	<!-- / Error page-->
</template>

<script>
	/* eslint-disable global-require */
	import { BLink, BButton, BImg } from "bootstrap-vue";
	import VuexyLogo from "@/@core/layouts/components/Logo.vue";
	import store from "@/store/index";

	export default {
		components: {
			VuexyLogo,
			BLink,
			BButton,
			BImg,
		},
		data() {
			return {
				downImg: require("@/assets/images/pages/error.svg"),
			};
		},
		mounted() {
			this.$store.dispatch("Auth/LOG_OUT").catch((err) => console.log(er));

			// Remove userData from localStorage
			localStorage.removeItem("userData");

			// Reset ability
			// this.$ability.update(initialAbility);
		},

		computed: {
			imgUrl() {
				if (store.state.appConfig.layout.skin === "dark") {
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.downImg = require("@/assets/images/pages/error.svg");
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
