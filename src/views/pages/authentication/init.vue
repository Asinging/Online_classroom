<template>
	<!-- Under maintenance-->
	<div class="misc-wrapper">
		<div class="misc-inner p-2 p-sm-3">
			<div class="w-100 text-center pb-10">
				<h4 class="mb-1 text-info">{{ computeRelayMessages }} 🔄</h4>
				<!-- <hollow-dots-spinner
					:animation-duration="1000"
					:dot-size="15"
					:dots-num="3"
					color="#ff1d5e"
				/> -->

				<!-- img -->
			</div>
			<b-img :src="imgUrl" alt="initialize app" height="300" />
		</div>
	</div>
	<!-- / Under maintenance-->
</template>

<script>
	/* eslint-disable global-require */
	import { BLink, BFormInput, BButton, BForm, BImg } from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	// import { HollowDotsSpinner } from "epic-spinners";
	import store from "@/store/index";
	import { onAuthStateChanged } from "firebase/auth";
	import { auth } from "@/config/firebase.js";

	export default {
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
				user: null,
				relayMessages: "Initialising Application",
				timer: null,
				messages: [
					"Initializing Application",
					"Checking user Credentials",
					"Login user in",
				],
				downImg: require("@/assets/images/pages/under-maintenance.svg"),
			};
		},
		watch: {
			user: {
				deep: true,
				handler(val) {
					if (!val) return false;

					this.$store
						.dispatch("Users/GET_SINGLE_USER", {
							field: "user_UID",
							value: val.uid,
						})
						.then((resp) => {
							clearInterval(this.timer);
							let isClientIn = resp.user_type === 2 ? true : false;
							this.$store.commit(
								"appConfig/UPDATE_WHO_IS_IN",
								isClientIn
							);

							localStorage.setItem(
								"isClientIn",
								JSON.stringify(isClientIn)
							);

							if (resp.user_type < 2) {
								this.$router.push("/");
								return true;
							}

							if (!resp.subscribed) {
								this.$router.push({
									name: "payment",
								});
								return false;
							}
							this.$router.push("/");
						})
						.catch((err) => {
							console.log(err);
						});
				},
			},
		},

		beforeMount() {
			onAuthStateChanged(auth, (user) => {
				this.user = user;
			});
		},
		mounted() {
			let count = 1;
			this.timer = setInterval(() => {
				this.relayMessages = this.messages[count > 2 ? 2 : count];
				console.log(count);
				count = count + 1;
			}, 3000);
		},

		computed: {
			computeRelayMessages() {
				return this.relayMessages;
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
