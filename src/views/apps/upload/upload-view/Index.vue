<template>
	<!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div style="height: inherit">
		<div
			v-if="!computeCourseDisplay"
			class="text-center d-flex justify-content-center align-items-center"
			style="height: 100%"
		>
			<b-spinner size="xl" class="text-center text-primary" />
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
					:courseTitles="courseModules"
				/>
				<!-- @close-left-sidebar="mqShallShowLeftSidebar = false" -->
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
	import EventBus from "@/helpers/eventBus";

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
		created() {
			EventBus.$on("courseModuleClick", this.courseModuleClick);
			EventBus.$on("close-left-sidebar", this.closeLeftSidebar());
		},
		beforeDestroy() {
			localStorage.removeItem("courseDisplay");
			EventBus.$off();
		},
		methods: {
			courseModuleClick(item) {
				debugger;
				if (!item) return false;

				this.courseDisplay = item;
				localStorage.getItem("courseDisplay", JSON.stringify(item));
			},
			closeLeftSidebar(item) {},
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
				let storage = localStorage.getItem("courseDisplay");

				try {
					let response = await store.dispatch(
						"Course/GET_SINGLE_COURSE_BY_Id",
						{
							id: courseId,
						}
					);
					if (response) {
						courseDisplay.value = storage
							? JSON.parse(storage)
							: response.mudules[0];
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
				courseDisplay,

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
</style>
