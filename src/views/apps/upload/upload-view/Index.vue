<template>
	<!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div style="height: inherit; margin-bottom: 10px">
		<div
			v-if="!computeCourseDisplay"
			class="text-center d-flex justify-content-center align-items-center align-content-center"
			style="height: 100%"
		>
			<b-alert variant="danger" v-if="isServerResponse" show>
				<h4 class="alert-heading">Error fetching Video Data</h4>
				<div class="alert-body">
					No Video found with this data. please Check
					<b-link class="alert-link" @click="courseList">
						Video List
					</b-link>
				</div>
			</b-alert>
			<div
				v-else
				class="text-center d-flex justify-content-center align-items-center"
				style="height: 100%"
			>
				<b-spinner size="xl" class="text-center text-primary" />
			</div>
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
				<div class="app-fixed-search d-flex align-items-center bg-dark">
					<div class="sidebar-toggle d-block d-lg-none ml-1">
						<feather-icon
							icon="ListIcon"
							size="21"
							class="cursor-pointer text-white"
							@click="mqShallShowLeftSidebar = true"
						/>
					</div>
				</div>

				<!-- App Action Bar -->
				<div class="app-action bg-dark">
					<b-card-text
						class="text-capitalize h3 font-weight-bold text-white"
						>{{ `${computeCourseDisplay.title}` }}</b-card-text
					>
				</div>

				<!-- Emails List -->
				<vue-perfect-scrollbar
					:settings="perfectScrollbarSettings"
					class="email-user-list scroll-area"
				>
					<!-- <b-card class="containing">
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
						</div>
					</b-card> -->

					<b-card
						class="d-flex justify-content-start shadow-none bg-light border-0"
						tag="article"
						style="min-height: 300px"
					>
						<div
							v-if="isRequesting"
							class="align-items-center d-flex justify-content-start"
						>
							<div class="containing_container text-center">
								<b-spinner
									size="xl"
									class="text-center text-primary"
								></b-spinner>
							</div>
						</div>
						<div class="containing_container" v-else-if="course">
							<div
								v-if="computeCourseDisplay.isIframe"
								class="iframe d-flex embed-responsive-item rounded-100 p-0 m-0"
								style="height: 60vh; width: 100%"
								v-html="computeCourseDisplay.video_url"
							></div>
							<div v-else class="iframe p-0 m-0">
								<b-embed
									class="embed-responsive-item"
									type="iframe"
									aspect="16by9"
									:src="computeCourseDisplay.video_url"
									allowfullscreen
								/>
							</div>
						</div>
					</b-card>
				</vue-perfect-scrollbar>
			</div>

			<portal to="content-renderer-sidebar-left">
				<module-side-bar-title
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

	import {
		ref,
		onUnmounted,
		computed,
		watch,
		onBeforeMount,
	} from "@vue/composition-api";
	import {
		BAlert,
		BLink,
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
	import ModuleSideBarTitle from "./moduleSideBarTitle.vue";
	import { checkIframe } from "@/helpers/iframe-helpers";
	import EventBus from "@/helpers/eventBus";
	import router from "@/router";

	export default {
		components: {
			BAlert,
			BLink,
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
			ModuleSideBarTitle,
		},
		created() {
			EventBus.$on("courseModuleClick", this.courseModuleClick);
			EventBus.$on("close-left-sidebar", this.closeLeftSidebar());
		},
		beforeDestroy() {
	
			EventBus.$off();
		},
		methods: {
			courseModuleClick(item) {
				if (!item) return false;

				this.courseDisplay = item;
				localStorage.setItem("courseDisplay", JSON.stringify(item));
			},
			closeLeftSidebar(item) {},
		},
		setup() {
			const { route } = useRouter();
			const courseDisplay = ref(null);
			const courseModules = ref([]);
			const markAsWatch = ref(false);
			const currentPage = ref(1);
			const perPage = ref(50);
			const course = ref(null);
			const isServerResponse = ref(false);
			const isRequesting = ref(true);
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

			const courseList = () => {
				let isAdmin = JSON.parse(
					localStorage.getItem("isAdminIn") || "false"
				);
				router.push({
					name: isAdmin ? "course-list" : "courses-card",
				});
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

			onBeforeMount(() => {
				let courseId = route.value.params.id;
				let storage = localStorage.getItem("courseDisplay");
				isRequesting.value = true;
				store
					.dispatch("Course/GET_SINGLE_COURSE_BY_Id", {
						id: courseId,
					})
					.then((response) => {
						
						courseDisplay.value =JSON.parse(storage)
						isServerResponse.value = true;
						isRequesting.value = false;

						if (response) {
							courseDisplay.value = response.mudules[0];
							courseModules.value = response.mudules;
							course.value = response;
							localStorage.setItem("courseDisplay", JSON.stringify(response.mudules[0]));
						}
					})
					.catch((err) => {
						
						isServerResponse.value = true;
						isRequesting.value = false;
						courseDisplay.value =JSON.parse(storage)
						console.log(err);
					});
			});

			watch(markAsWatch, (val) => {
				let payload = {
					id: route.value.params.id,
					data: {
						watched: val,
					},
				};
				store
					.dispatch("Course/UPDATE_SINGLE_COURSE", payload)
					.catch((err) => {});
			});

			return {
				isRequesting,
				isServerResponse,
				courseTitles,
				markAsWatch,
				currentPage,
				perPage,
				course,
				// UI
				perfectScrollbarSettings,
				computeCourseDisplay,
				courseModules,
				courseDisplay,
				courseModulesTotal,
				courseList,

				// Left Sidebar Responsiveness
				mqShallShowLeftSidebar,
			};
		},
	};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss" >
	@import "~@core/scss/base/pages/app-email.scss";
	// .container {
	// 	height: 65vh !important;
	// 	width: 100% !important;
	// }
	// .video-container {
	// 	position: relative;
	// }

	// .container_loader {
	// 	height: 30vh;
	// }
	// .iframeContainer {
	// 	position: relative;
	// }
	// .iframe {
	// 	position: absolute;
	// 	top: 0;
	// 	right: 0;
	// 	padding: 0;
	// 	margin: 0;
	// 	width: 100%;
	// 	height: 100%;
	// 	border: 0;
	// }

	.containing_container {
		position: relative;
		display: flex;
		justify-content: center;
		max-width: 1000px !important; /* Adjust the value as per your preference */
		margin: 0 auto;
	}
	.video-container {
		position: relative;
	}

	.container_loader {
		height: 30vh;
	}

	
	iframe {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		margin: 0;
		width: 100%;

		height: 100%;

		border: 0px !important;
		border-radius: 10px !important;
	}
</style>
