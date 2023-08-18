<template>
	<div id="app" class="h-100" :class="[skinClasses]">
		<component :is="layout">
			<router-view />
		</component>

		<scroll-to-top v-if="enableScrollToTop" />
	</div>
</template>

<script>
	import ScrollToTop from "@core/components/scroll-to-top/ScrollToTop.vue";

	// This will be populated in `beforeCreate` hook
	import { $themeColors, $themeBreakpoints, $themeConfig } from "@themeConfig";
	import { provideToast } from "vue-toastification/composition";
	import { watch, ref } from "@vue/composition-api";
	import useAppConfig from "@core/app-config/useAppConfig";

	import { useWindowSize, useCssVar } from "@vueuse/core";
	import { onAuthStateChanged } from "firebase/auth";
	import { authentication } from "@/config/firebase.js";
	import { setLocalstorage } from "@/helpers/user-helpers";

	import store from "@/store";

	const LayoutVertical = () => import("@/layouts/vertical/LayoutVertical.vue");

	const LayoutFull = () => import("@/layouts/full/LayoutFull.vue");

	export default {
		components: {
			// Layouts

			LayoutVertical,
			LayoutFull,

			ScrollToTop,
		},
		// ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
		// Currently, router.currentRoute is not reactive and doesn't trigger any change
		computed: {
			layout() {
				if (this.$route.meta.layout === "full") return "layout-full";
				return `layout-${this.contentLayoutType}`;
			},
			contentLayoutType() {
				return this.$store.state.appConfig.layout.type;
			},
		},

		beforeCreate() {
			// sessionStorage.setItem("signInUser", "3C8tguIQdKYrR7WqcaL2");

			// Set colors in theme
			const colors = [
				"primary",
				"secondary",
				"success",
				"info",
				"warning",
				"danger",
				"light",
				"dark",
			];

			// eslint-disable-next-line no-plusplus
			for (let i = 0, len = colors.length; i < len; i++) {
				$themeColors[colors[i]] = useCssVar(
					`--${colors[i]}`,
					document.documentElement
				).value.trim();
			}

			// Set Theme Breakpoints
			const breakpoints = ["xs", "sm", "md", "lg", "xl"];

			// eslint-disable-next-line no-plusplus
			for (let i = 0, len = breakpoints.length; i < len; i++) {
				$themeBreakpoints[breakpoints[i]] = Number(
					useCssVar(
						`--breakpoint-${breakpoints[i]}`,
						document.documentElement
					).value.slice(0, -2)
				);
			}

			// Set RTL
			const { isRTL } = $themeConfig.layout;
			document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
		},

		setup() {
			const { skin, skinClasses } = useAppConfig();
			const { enableScrollToTop } = $themeConfig.layout;

			// If skin is dark when initialized => Add class to body
			if (skin.value === "dark") document.body.classList.add("dark-layout");

			// Provide toast for Composition API usage
			// This for those apps/components which uses composition API
			// Demos will still use Options API for ease
			provideToast({
				hideProgressBar: true,
				closeOnClick: false,
				closeButton: false,
				icon: false,
				timeout: 3000,
				transition: "Vue-Toastification__fade",
			});
			const isAdmin = store.getters["appConfig/whoIsinGetter"];

			// Set Window Width in store
			store.commit("appConfig/UPDATE_USER_SUBSCRIPTION", true);
			store.commit("appConfig/UPDATE_WHO_IS_IN", isAdmin);
			store.commit("app/UPDATE_WINDOW_WIDTH", window.innerWidth);
			const { width: windowWidth } = useWindowSize();
			watch(windowWidth, (val) => {
				store.commit("app/UPDATE_WINDOW_WIDTH", val);
			});

			onAuthStateChanged(authentication, (user) => {
			
				initUser(user);
			});

			const initUser = (val) => {
				if (!val) return false;

				store
					.dispatch("Users/GET_SINGLE_USER_BY_Id", {
						id: val.uid,
					})
					.then((resp) => {
						
						let formObject = setLocalstorage(
							authentication.currentUser,
							resp
						);

						store.commit("Auth/mCurrentUser", formObject);

						let isAdminIn = resp.user_type < 2 ? true : false;

						store.commit("appConfig/UPDATE_WHO_IS_IN", isAdminIn);

						if (resp.user_type < 2) {
							store.commit("appConfig/UPDATE_WHO_IS_IN", true);
						}

						if (resp.subscribed) {
							store.commit(
								"appConfig/UPDATE_USER_SUBSCRIPTION",
								true
							);
						} else {
							store.commit(
								"appConfig/UPDATE_USER_SUBSCRIPTION",
								false
							);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			};
			return {
				skinClasses,
				enableScrollToTop,
			};
		},
	};
</script>
<style>
	li {
		text-decoration: none !important;
	}
	li list {
		text-decoration: none !important;
	}
	li .btn-group .btn {
		text-decoration: none !important;
	}
	a .btn-group .btn:hover {
		text-decoration: none !important;
	}
</style>
