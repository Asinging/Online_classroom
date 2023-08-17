<template>
	<!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div class="row">
		<div class="col col-12 col-lg-2">
			<b-sidebar
				id="sidebar-1"
				shadow
				bg-variant="dark"
				text-variant="light"
				width="230px"
				visible
				no-header
			>
				<template #default="{ hide }">
					<div class="p-25 my-1 d-flex justify-content-between">
						<span class="font-weight-bolder h3 text-light pr-25">
							Course Modules
						</span>
						<span
							class="d-flex justify-content-end text-right align-items-center d-block d-lg-none"
						>
							<feather-icon
								icon="XIcon"
								size="15"
								@click="hide"
								class="cursor-pointer text-white font-weight-bolder"
							/>
						</span>
					</div>
					<div class="primary">
						<Menu :menu="computeCourseModules" />
					</div>
				</template>
			</b-sidebar>
		</div>

		<div class="col col-12 col-lg-10">
			<div class="d-flex align-items-center bg-dark p-1">
				<div class="mr-1 d-flex p-25 d-block d-lg-none">
					<feather-icon
						v-b-toggle.sidebar-1
						icon="ListIcon"
						size="21"
						aria-controls="sidebar-1"
						:aria-expanded="'true'"
						class="cursor-pointer text-white"
					/>
				</div>
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
		BSidebar,
		BButton,
		VBToggle,
	} from "bootstrap-vue";
	import VuePerfectScrollbar from "vue-perfect-scrollbar";

	import { useRouter } from "@core/utils/utils";
	import { useResponsiveAppLeftSidebarVisibility } from "@core/comp-functions/ui/app";

	import { checkIframe } from "@/helpers/iframe-helpers";
	import EventBus from "@/helpers/eventBus";
	import router from "@/router";
	import Ripple from "vue-ripple-directive";
	import Menu from "./Menu.vue";

	export default {
		directives: {
			"b-toggle": VBToggle,
			Ripple,
		},
		components: {
			Menu,
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
			BSidebar,
			BButton,
			VBToggle,

			// 3rd Party
			VuePerfectScrollbar,

			// App SFC
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
				let counter = 1;
				if (!courseDisplay.value) {
					let storage = JSON.parse(
						localStorage.getItem("courseModuleDisplay") || "null"
					);
					if (!storage) return null;
					courseDisplay.value = storage.mudules[counter][0];

					course.value = storage;
					return checkIframe(storage?.mudules[counter][0]);
				}
				return checkIframe(courseDisplay.value);
			});

			const courseModulesTotal = computed(() => {
				if (!courseDisplay.value) return 0;
				return courseDisplay.value.length;
			});

			const computeCourseModules = computed(() => {
				if (!courseModules.value) return [];

				return courseModules.value;
			});

			// Left Sidebar Responsiveness
			const { mqShallShowLeftSidebar } =
				useResponsiveAppLeftSidebarVisibility();

			onBeforeMount(() => {
				let courseId = route.value.params.id;
				let storage = JSON.parse(
					localStorage.getItem("courseModuleDisplay") || "null"
				);
				isRequesting.value = true;
				store
					.dispatch("Course/GET_SINGLE_COURSE_BY_Id", {
						id: courseId,
					})
					.then((response) => {
						isServerResponse.value = true;
						isRequesting.value = false;
						let counter = 1;
						if (!response) {
							courseDisplay.value = storage.mudules[counter][0];
							let x = Object.values(storage.mudules);

							courseModules.value = x.map((item, index) => {
								return {
									title: index + 1,

									children: item.map((i) => {
										i.index = index;
										return i;
									}),
								};
							});

							course.value = storage;
							return false;
						}

						localStorage.setItem(
							"courseModuleDisplay",
							JSON.stringify(response)
						);

						courseDisplay.value = storage.mudules[counter][0];
						let x = Object.values(storage.mudules);

						courseModules.value = x.map((item, index) => {
							return {
								title: index + 1,
								index: index + 1,
								children: item.map((i) => {
									i.index = index;
									return i;
								}),
							};
						});
						console.log(courseModules.value);
						course.value = response;
					})
					.catch((err) => {
						isServerResponse.value = true;
						isRequesting.value = false;

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
				computeCourseModules,
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
