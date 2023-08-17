<template>
	<!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div class="row no-gutters">
		<div class="col col-12 col-md-3 col-lg-2">
			<b-sidebar
				id="sidebar-1"
				shadow
				bg-variant="dark"
				text-variant="light"
				sidebar-class="bg"
				width="250px"
				:visible="sidebarVisible"
				no-header
			>
				<template #default="{ hide }">
					<div
						class="p-25 my-1 mx-25 d-flex justify-content-between primary"
					>
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

		<div class="col col-12 col-md-9 col-lg-10">
			<div class="mx-1 ml-lg-3">
				<div
					class="d-flex align-items-center bg-light py-1 rounded-10 mb-25"
				>
					<div class="mr-1 mr-md-2 d-flex d-block d-lg-none">
						<feather-icon
							v-b-toggle.sidebar-1
							icon="ListIcon"
							size="21"
							aria-controls="sidebar-1"
							:aria-expanded="'true'"
							class="cursor-pointer text-dark"
						/>
					</div>
					<b-card-text
						class="text-capitalize h3 font-weight-bold text-dark video_title"
					>
						{{ `${computeCourseDisplay.title}` }}
					</b-card-text>
				</div>

				<div>
					<div
						v-if="isRequesting"
						class="align-items-center d-flex justify-content-center mt-2"
					>
						<b-spinner
							size="xl"
							class="text-center text-primary"
						></b-spinner>
					</div>

					<div
						v-else-if="course && computeCourseDisplay.isIframe"
						class="iframe2 p-0 m-0 embed-responsive embed-responsive-16by9"
						v-html="computeCourseDisplay.video_url"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import store from "@/store";

	import {
		ref,
		onUnmounted,
		onMounted,
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
			const sidebarVisible = ref(true);

			const windowWidth = ref(window.innerWidth);

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
			onMounted(() => {
				if (windowWidth.value > 780) {
					sidebarVisible.value = true;
				} else {
					sidebarVisible.value = false;
				}
				window.addEventListener("resize", handleResize);
			});

			onUnmounted(() => {
				window.removeEventListener("resize", handleResize);
			});

			// Route Params

			const perfectScrollbarSettings = {
				maxScrollbarLength: 150,
			};
			const handleResize = () => {
				windowWidth.value = window.innerWidth;

				if (windowWidth.value > 780) {
					sidebarVisible.value = true;
				} else {
					sidebarVisible.value = false;
				}
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

				return courseModules.value || [];
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
				sidebarVisible,

				// Left Sidebar Responsiveness
				mqShallShowLeftSidebar,
			};
		},
	};
</script>



<style lang="scss" scoped>
	// @import "~@core/scss/base/pages/app-email.scss";
	.video_title {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: 700;
	}

	.iframe2 {
		position: relative;
		overflow: hidden;
		padding-top: 56.25%;

		max-height: 500px;
	}
	.iframe2 iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 30px;
		// border-radius: 12px !important;

		border: 0; /* Remove iframe border */
	}
</style>
