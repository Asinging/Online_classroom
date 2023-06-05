<template>
	<!-- Under maintenance-->
	<div class="misc-wrapper">
		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center pb-10">
				<h2
					class="mb-1 text-info"
					:class="{
						'text-primary': counter === 0,
						'text-danger': counter === 1,
						'text-success': counter >= 2,
					}"
				>
					{{ computeRelayMessages }} ⭕
				</h2>

				<pulse-loader
					:loading="loading"
					:color="color"
					:size="size"
				></pulse-loader>

				<!-- img -->
			</div>
			<b-img :src="imgUrl" alt="initialize app" height="300" />
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
		VBHover,
	} from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	// import { HollowDotsSpinner } from "epic-spinners";
	import PulseLoader from "vue-spinner/src/PulseLoader.vue";

	import { onAuthStateChanged } from "firebase/auth";
	import { authentication } from "@/config/firebase.js";
	import store from "@/store";

	export default {
		components: {
			BLink,
			BFormInput,
			BButton,
			BForm,
			BImg,
			VuexyLogo,
			PulseLoader,
		},
		data() {
			return {
				loading: true,
				colorArr: ["#5dc596", "#fe1114", "#000000"],
				color: "#5dc596",

				size: "13px",
				user: null,
				relayMessages: "Initialising Application",
				timer: null,
				messages: [
					"Initializing Application",
					"Checking user Credentials",
					"Login user in",
				],
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
				counter: 0,
			};
		},
		watch: {
			counter: {
				immediate: true,
				handler(val) {
					if (this.counter >= 2) {
						onAuthStateChanged(authentication, (user, err) => {
							this.user = user;
						});
					}
				},
			},
			user: {
				deep: true,
				immediate: false,
				handler(val) {
					if (!val) return false;
					this.$store
						.dispatch("Users/GET_SINGLE_USER_BY_Id", {
							id: val.uid,
						})
						.then((resp) => {
							store.commit("Auth/mCurrentUser", resp || null);
							let isAdminIn = resp.user_type < 2 ? true : false;

							this.$store.commit(
								"appConfig/UPDATE_WHO_IS_IN",
								isAdminIn
							);

							localStorage.setItem(
								"isAdminIn",
								JSON.stringify(isAdminIn)
							);

							store.commit("appConfig/UPDATE_SKIN", "light");
							store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
								backgroundColor: "primary",
								type: "floating",
							});
							store.commit("appConfig/UPDATE_FOOTER_CONFIG", {
								type: "static",
							});

							if (resp.user_type < 2) {
								store.commit("appConfig/UPDATE_SKIN", "semi-dark");
								store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
									backgroundColor: "dark",
									type: "sticky",
								});
								store.commit("appConfig/UPDATE_FOOTER_CONFIG", {
									type: "sticky",
								});
								this.$router.push("/admin/dashboard");
								return true;
							}

							if (!resp.subscribed) {
								this.$router.push({
									name: "payment",
								});
								return false;
							}
							this.$router.push("/dashboard");
						})
						.catch((err) => {
							console.log(err);
						});
				},
			},
		},

		mounted() {
			this.timer = setInterval(() => {
				if (this.counter > 2) {
					clearInterval(this.timer);
					return false;
				}
				this.relayMessages =
					this.messages[this.counter > 2 ? 2 : this.counter];
				this.counter = this.counter + 1;
			}, 1500);
			// setTimeout(() => {
			// 	this.counter = 2;
			// }, 3000);
		},

		computed: {
			computeRelayMessages() {
				return this.relayMessages;
			},
			computeColor() {
				let a = this.colorArr[this.counter];

				return a;
			},
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
