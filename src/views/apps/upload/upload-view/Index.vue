<template>
	<!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div style="height: inherit">
		<div v-if="!computeCourseDisplay">
			<b-spinner label="Loading..." class="mr-25" large />
		</div>
		<div v-else>
			<div
				class="body-content-overlay"
				:class="{ show: mqShallShowLeftSidebar }"
				@click="mqShallShowLeftSidebar = false"
			/>

			<!-- Email List -->
			<div class="email-app-list">
				<!-- App Searchbar Header -->
				<div class="app-fixed-search d-flex align-items-center">
					<!-- Toggler -->
					<div class="sidebar-toggle d-block d-lg-none ml-1">
						<feather-icon
							icon="MenuIcon"
							size="21"
							class="cursor-pointer"
							@click="mqShallShowLeftSidebar = true"
						/>
					</div>
				</div>

				<!-- App Action Bar -->
				<div class="app-action">
					<div class="action-left">
						<b-card-text
							class="text-capitalize h3 font-weight-bold"
							>{{ `${computeCourseDisplay.title}` }}</b-card-text
						>
					</div>
				</div>

				<!-- Emails List -->
				<vue-perfect-scrollbar
					:settings="perfectScrollbarSettings"
					class="email-user-list scroll-area"
				>
					<b-card>
						<div
							v-if="computeCourseDisplay.isIframe"
							height="100"
							class="video-container d-flex justify-content-center align-center"
							v-html="computeCourseDisplay.video_url"
						></div>
						<div v-else>
							<b-embed
								type="iframe"
								aspect="16by9"
								:src="computeCourseDisplay.video_url"
								allowfullscreen
							/>
						</div>
					</b-card>
				</vue-perfect-scrollbar>
			</div>

			<portal to="content-renderer-sidebar-left">
				<email-left-sidebar
					:class="{ show: mqShallShowLeftSidebar }"
					@close-left-sidebar="mqShallShowLeftSidebar = false"
					:courseTitles="courseModules"
				/>
			</portal>
		</div>
	</div>
</template>

<script>
	import store from "@/store";

	import router from "@/router";
	import {
		ref,
		onUnmounted,
		computed,
		watch,
		onBeforeMount,
	} from "@vue/composition-api";
	import {
		BSpinner,
		BEmbed,
		BFormInput,
		BInputGroup,
		BInputGroupPrepend,
		BDropdown,
		BDropdownItem,
		BFormCheckbox,
		BMedia,
		BMediaAside,
		BMediaBody,
		BAvatar,
		BCard,
		BCardTitle,
		BCardText,
	} from "bootstrap-vue";
	import VuePerfectScrollbar from "vue-perfect-scrollbar";

	import { useRouter } from "@core/utils/utils";
	import { useResponsiveAppLeftSidebarVisibility } from "@core/comp-functions/ui/app";
	import EmailLeftSidebar from "./EmailLeftSidebar.vue";
	import { checkIframe } from "@/helpers/iframe-helpers";

	export default {
		components: {
			BSpinner,
			BEmbed,
			BFormInput,
			BInputGroup,
			BInputGroupPrepend,
			BDropdown,
			BDropdownItem,
			BFormCheckbox,
			BMedia,
			BMediaAside,
			BMediaBody,
			BAvatar,
			BCard,
			BCardTitle,
			BCardText,

			// 3rd Party
			VuePerfectScrollbar,

			// App SFC
			EmailLeftSidebar,
		},
		setup() {
			const { route, router } = useRouter();
			const courseDisplay = ref(null);
			const courseModules = ref([]);
			const course = ref(null);
			const courseTitles = [
				{
					title: "Personal",
					color: "success",
				},
				{
					title: "Company",
					color: "primary",
				},
				{
					title: "Important",
					color: "warning",
				},
				{
					title: "Private",
					color: "danger",
				},
			];

			// Route Params

			const perfectScrollbarSettings = {
				maxScrollbarLength: 150,
			};
			const computeCourseDisplay = computed(() => {
				if (!courseDisplay.value) return null;
				return checkIframe(courseDisplay.value);
			});

			// Left Sidebar Responsiveness
			const { mqShallShowLeftSidebar } =
				useResponsiveAppLeftSidebarVisibility();

			onBeforeMount(async () => {
				let courseId = route.value.params.id;

				try {
					let response = await store.dispatch(
						"Course/GET_SINGLE_COURSE_BY_Id",
						{
							id: courseId,
						}
					);
					if (response) {
						courseDisplay.value = response.mudules[0];
						courseModules.value = response.mudules;
						course.value = response;
					}
				} catch (err) {
					console.log(err);
				}
			});

			return {
				courseTitles,
				// UI
				perfectScrollbarSettings,
				computeCourseDisplay,
				courseModules,

				// Left Sidebar Responsiveness
				mqShallShowLeftSidebar,
			};
		},
	};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
	@import "~@core/scss/base/pages/app-email.scss";
	.video-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	iframe {
		position: absolute;
		top: -10%;
		width: 100vw;
		height: 117vh;
		pointer-events: none;
	}
</style>
