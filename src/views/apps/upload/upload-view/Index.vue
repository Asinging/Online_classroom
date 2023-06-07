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
					<b-card class="container">
						<div
							id="iframeContainer"
							v-if="computeCourseDisplay.isIframe"
						>
							<div
								class="video-container d-flex justify-content-center align-center iframe"
								v-html="computeCourseDisplay.video_url"
							></div>
						</div>
						<div v-else class="iframe">
							<b-embed
								type="iframe"
								aspect="16by9"
								:src="computeCourseDisplay.video_url"
								allowfullscreen
							/>
						</div>
						<div class="d-flex justify-content-between controls">
							<div class="d-flex justify-content-start">
								<b-form-checkbox :checked="markAsWatch">
									Mark as watched
								</b-form-checkbox>
							</div>
							<!-- <div class="d-flex justify-content-end">
								<b-pagination
									v-model="currentPage"
									:total-rows="courseModulesTotal"
									:per-page="perPage"
									first-text="⏮"
									prev-text="⏪"
									next-text="⏩"
									align="left"
									last-text="⏭"
									class="mt-2"
								/>
							</div> -->
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
		BPagination,
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
			BPagination,
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
			const markAsWatch = ref(false);
			const currentPage = ref(1);
			const perPage = ref(50);
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

			const courseModulesTotal = computed(() => {
				if (!courseDisplay.value) return 0;
				return courseDisplay.value.length;
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
			watch(markAsWatch, (val) => {
				let payload = {
					id: route.value.params.id,
					data: {
						watched: val,
					},
				};
				store.dispatch("Course/UPDATE_SINGLE_COURSE", payload);
			});
			return {
				courseTitles,
				markAsWatch,
				currentPage,
				perPage,
				// UI
				perfectScrollbarSettings,
				computeCourseDisplay,
				courseModules,
				courseDisplay,
				courseModulesTotal,

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
		height: 100vh;
		overflow: hidden;
		position: relative;
	}
	#iframeContainer {
		height: 300px; /* Adjust the height as needed */
	}

	#iframeContainer .iframe {
		height: 100%;
	}
</style>
