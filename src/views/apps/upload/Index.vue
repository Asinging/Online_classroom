<template>
	<b-card title="Upload Content">
		<app-timeline>
			<!-- 12 INVOICES HAVE BEEN PAID -->
			<app-timeline-item icon="ImageIcon" class="mb-10">
				<div
					class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-10 mb-sm-0"
				>
					<h4>Cover Image For the courses</h4>
				</div>

				<div class="border rounded p-2">
					<h4 class="mb-1">Featured Image</h4>
					<b-media
						no-body
						vertical-align="center"
						class="flex-column flex-md-row"
					>
						<b-media-aside>
							<b-img
								ref="refPreviewEl"
								:src="blogEdit.featuredImage"
								height="110"
								width="170"
								class="rounded mr-2 mb-1 mb-md-0"
							/>
						</b-media-aside>
						<b-media-body>
							<small class="text-muted"
								>Recommended image resolution 800x400, max-image
								size 2mb.</small
							>
							<b-card-text class="my-50">
								<b-link id="blog-image-text">
									\{{
										blogFile ? blogFile.name : "banner.jpg"
									}}
								</b-link>
							</b-card-text>
							<div class="d-inline-block">
								<b-form-file
									ref="refInputEl"
									v-model="blogFile"
									accept=".jpg, .png, .gif"
									placeholder="Choose file"
									@input="inputImageRenderer"
								/>
							</div>
						</b-media-body>
					</b-media>
				</div>
			</app-timeline-item>

			<app-timeline-item
				variant="secondary"
				icon="LinkIcon"
				class="mt-md-5"
			>
				<!-- <div
					class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0"
				>	 -->
				<div class="mb-1 mb-sm-1">
					<div class="d-flex justify-content-between">
						<h4>Course Propertise</h4>

						<b-form-group v-if="!isEditPage">
							<b-form-checkbox
								id="remember-me"
								v-model="introVideo"
								name="checkbox-1"
							>
								Mark as intro clip
							</b-form-checkbox>
						</b-form-group>
					</div>
					<p class="text-primary">
						Go to the YouTube video or playlist you want to add.
						From the list of Share options, click Embed. From the
						box that appears, copy the HTML code. Paste the code
						into the Below marked for youtube video.
					</p>
					<div>
						<div class="pl-md-3 pl-0 mb-2 mb-md-0">
							<b-form
								ref="form"
								:style="{ height: trHeight }"
								class="repeater-form"
								@submit.prevent="repeateAgain"
							>
								<!-- Row Loop -->
								<b-row
									v-for="(item, index) in items"
									:id="item.id"
									:key="item.id"
									ref="row"
								>
									<!-- Course Title-->
									<b-col md="4">
										<b-form-group>
											<b-form-textarea
												v-model="
													items[index].courseTitle
												"
												rows="2"
												placeholder="Title of Course"
											lazy-formatter
											:formatter="formatter"
											/>
										</b-form-group>
									</b-col>

									<!-- Cost -->
									<b-col md="4" class="mb-0 mb-sm-1">
										<b-form-textarea
											v-model="
												items[index].courseDescriptions
											"
											rows="2"
											placeholder="Brief Description "
										/>
										<!-- :state=" items[index].courseDescription
										.length <= 100 " -->
									</b-col>

									<!-- Quantity -->
									<b-col md="4">
										<b-form-textarea
											v-model="items[index].videoUrl"
											rows="2"
											placeholder="Youtube video Id"
										/>
									</b-col>

									<b-col
										cols="12"
										class="mx-1 mb-25 mb-md-3 mt-sm-25 mt-md-0 d-flex justify-content-end"
									>
										<b-button
											v-ripple.400="
												'rgba(255, 255, 255, 0.15)'
											"
											variant="primary"
											@click="repeateAgain"
											class="sm mr-25"
											size="sm"
											v-if="items.length === index + 1"
											:disabled="introVideo"
										>
											<feather-icon
												icon="PlusIcon"
												class="mr-25"
											/>
											<span>Add course module</span>
										</b-button>
										<b-button
											v-ripple.400="
												'rgba(234, 84, 85, 0.15)'
											"
											variant="outline-danger"
											class="mt-0 text-right d-flex justify-content-end mr-2"
											@click="removeItem(index)"
											size="sm"
										>
											<feather-icon
												icon="XIcon"
												class=""
											/>
											<span>Delete</span>
										</b-button>
									</b-col>
								</b-row>
							</b-form>
						</div>
					</div>
				</div>
			</app-timeline-item>
		</app-timeline>
		<b-col cols="12" class="mx-1 mb-2 mb-md-5 d-flex justify-content-end">
			<b-button
				v-ripple.400="'rgba(234, 84, 85, 0.15)'"
				variant="success"
				class="mt-0 text-right d-flex justify-content-end"
				@click="saveRecord"
				:disabled="isUploading"
			>
				<feather-icon
					v-if="!isUploading"
					icon="UploadIcon"
					class="mr-25"
				/>
				<b-spinner v-else class="mr-25" small />
				<span>Upload</span>
			</b-button>
		</b-col>
	</b-card>
</template>

<script>
	import {
		BSpinner,
		BImg,
		BAvatar,
		BMedia,
		BMediaAside,
		BMediaBody,
		BButton,
		BCollapse,
		VBToggle,
		BListGroup,
		BListGroupItem,
		BAvatarGroup,
		BBadge,
		VBTooltip,
		BCard,
		BCardText,
		BForm,
		BFormFile,
		BRow,
		BCol,
		BLink,
		BFormGroup,
		BFormInput,
		BFormTextarea,
		BFormCheckbox,
	} from "bootstrap-vue";
	import AppTimeline from "@core/components/app-timeline/AppTimeline.vue";
	import AppTimelineItem from "@core/components/app-timeline/AppTimelineItem.vue";
	import Ripple from "vue-ripple-directive";
	import { heightTransition } from "@core/mixins/ui/transition";
	import { avatarText } from "@core/utils/filter";
	import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
	import store from "@/store";
	import { useToast } from "vue-toastification/composition";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { getDownloadURL } from "firebase/storage";
	import { useRouter } from "@core/utils/utils";

	import {
		ref,
		onBeforeMount,
		onMounted,
		onUnmounted,
		nextTick,
		watch,
	} from "@vue/composition-api";
	import { serverTimestamp } from "@firebase/firestore";

	export default {
		mixins: [heightTransition],
		components: {
			BSpinner,
			AppTimeline,
			AppTimelineItem,
			BCard,
			BCardText,
			BImg,
			BMedia,
			BMediaAside,
			BMediaBody,

			BAvatar,
			BButton,
			BCollapse,
			BListGroup,
			BListGroupItem,
			BAvatarGroup,
			BBadge,
			BForm,
			BFormFile,
			BLink,
			BRow,
			BCol,
			BFormGroup,
			BFormInput,
			BFormTextarea,
			BFormCheckbox,
		},
		directives: { "b-toggle": VBToggle, "b-tooltip": VBTooltip, Ripple },

		setup(props) {
			const toast = useToast();
			const { route } = useRouter();

			const pickingImage = ref(false);
			const isUploading = ref(false);
			const isEditPage = ref(false);
			const introVideo = ref(false);
			const nextTodoId = ref(2);
			const blogEdit = ref({});
			const blogFile = ref(null);
			const refPreviewEl = ref(null);
			const items = ref([
				{
					courseTitle: "",
					courseDescriptions: "",
					videoUrl: "",
				},
			]);

			// ? Demo Purpose => Update image on click of update
			const trHeight = ref(null);
			const refInputEl = ref(null);
			const previewEl = ref(null);
			const row = ref(null);
			const form = ref(null);
			const coverArtUrl = ref(null);

			onBeforeMount(async () => {
				window.addEventListener("resize", initTrHeight());
				let courseId;
				if (JSON.parse(route.value.params.edit)) {
					isEditPage.value = true;
					courseId = route.value.params.id;
				}
				try {
					let response = await store.dispatch(
						"Course/GET_SINGLE_COURSE_BY_Id",
						{
							id: courseId,
						}
					);

					if (!response || !response.mudules) return false;

					let courseModules = response.mudules.map((item) => {
						return {
							courseTitle: item.title,
							courseDescriptions: item.description,
							videoUrl: item.video_url,
						};
					});
					items.value = [...courseModules];
				} catch (err) {
					console.log(err);
				}
			});
			onMounted(() => {
				initTrHeight();
			});
			onUnmounted(() => {
				window.removeEventListener("resize", initTrHeight());
			});

			const trAddHeight = (val) => {
				const heightValue = Number(
					trHeightv.value.substring(0, trHeight.value.length - 2)
				);
				trHeight.value = `${heightValue + Number(val)}px`;
			};
			const trTrimHeight = (val) => {
				const heightValue = Number(
					trHeight.value.substring(0, trHeight.value.length - 2)
				);
				trHeight.value = `${heightValue - Number(val)}px`;
			};

			watch(introVideo, (val) => {
				if (val) {
					removeItemFromArr(items.value);
				}
			});

			const removeItemFromArr = (item) => {
				if (item.length > 1) {
					item.splice(1, 1);
					removeItemFromArr(item);
				}
				return;
			};

			const initTrHeight = () => {
				trSetHeight(null);
				nextTick(() => {
					trSetHeight(form.value.scrollHeight);
				});
			};

			const trSetHeight = (val) => {
				if (val === null) trHeight.value = "auto";
				else trHeight.value = `${Number(val)}px`;
			};

			const repeateAgain = () => {
				items.value.push({
					id: (nextTodoId.value += nextTodoId.value),
				});

				nextTick(() => {
					trAddHeight(row.value.offsetHeight);
				});
			};

			const removeItem = (index) => {
				items.value.splice(index, 1);

				toast({
					component: ToastificationContent,
					props: {
						title: "Good",
						text: `A course Module has been removed`,
						icon: "CheckIcon",
						variant: "success",
					},
				});
				trTrimHeight(row.value.offsetHeight);
			};


			const formatter = (value) =>{
				if(!value) return ''
					return value.toLowerCase().trim()
			}
			const _uploadRecord = async (course) => {
				try {
					let responses = await store.dispatch("Course/UPLOAD_VIDEO", {
						course,
					});
					isUploading.value = false;

					if (!responses) {
						toast({
							component: ToastificationContent,
							props: {
								title: "Uncought Error",
								text: `The upload could not be completed!`,
								icon: "AlertTriangleIcon",
								variant: "danger",
							},
						});
						return false;
					}
					toast({
						component: ToastificationContent,
						props: {
							title: "Good Job!",
							text: `Upload successfull done"`,
							icon: "CheckIcon",
							variant: "success",
						},
					});
					items.value = [
						{
							courseTitle: "",
							courseDescriptions: "",
							videoUrl: "",
						},
					];
				} catch (err) {
					isUploading.value = false;
					console.error(err);
					toast({
						component: ToastificationContent,
						props: {
							title: "Ouch !!",
							text: `An Error Occured`,
							icon: "AlertTriangleIcon",
							variant: "danger",
						},
					});
				}
			};

			const saveRecord = async () => {
				let itemFieldIsEmpty = false;
				items.value.forEach((item) => {
					Object.values(item).forEach((field) => {
						if (!field) {
							itemFieldIsEmpty = true;
						}
					});
				});

				if (itemFieldIsEmpty) {
					toast({
						component: ToastificationContent,
						props: {
							title: "Empty Required Field",
							text: `Please check!, Empty fields`,
							icon: "AlertTriangleIcon",
							variant: "warning",
						},
					});
					return false;
				}

				let data = Object.assign({}, items.value);
				let serverItem = items.value.map((item) => {
					return {
						status: 1,
						title: item.courseTitle,
						description: item.courseDescriptions,
						video_url: item.videoUrl,
						duration: 0,
					};
				});

				let course = {
					created_at: serverTimestamp(),
					cover_photo_url: coverArtUrl.value,
					title: data[0].courseTitle,
					description: data[0].courseDescriptions,
					status: 1,
					tracks: items.value.length || 1,
					user_id: store.getters["Users/signInUserId"] || 1,
					mudules: serverItem,
					intro_video: introVideo.value ? 1 : 0,
				};
				isUploading.value = true;
				// check if this is a edit operation
				if (JSON.parse(route.value.params.edit)) {
					let payload = {
						id: route.value.params.id,
						data: {
							status: 0,
							updated_at: serverTimestamp(),
						},
					};
					store
						.dispatch("Course/UPDATE_SINGLE_COURSE", payload)
						.catch((err) => {
							console.log(err);
						});
				}

				// Check if another video has been mark as intro in the database
				if (introVideo.value) {
					store
						.dispatch("Course/GET_SINGLE_COURSE", {
							field: "intro_video",
							value: 1,
						})
						.then((response) => {
							if (response) {
								store
									.dispatch("Course/UPDATE_SINGLE_COURSE", {
										id: response.id,
										data: {
											intro_video: 0,
											updated_at: serverTimestamp(),
										},
									})
									.then((res) => {
										debugger;
										_uploadRecord(course);
									})
									.catch((err) => {
										console.log(err);
									});
							}
						})
						.catch((err) => {
							this.isServerResponse = true;
							console.log(err);
						});
					return false;
				}

				_uploadRecord(course);
			};

			const { inputImageRenderer } = useInputImageRenderer(
				refInputEl,
				async (file, base64) => {
					refPreviewEl.value.src = base64;

					if (file.size > 10000000) {
						toast({
							component: ToastificationContent,
							props: {
								title: "Oh no",
								text: `File size is greater than the required size (Max 10mb)`,
								icon: "AlertTriangleIcon",
								variant: "warning",
							},
						});
						return false;
					}

					pickingImage.value = true;
					let payload = {
						image: file,
					};
					try {
						let response = await store.dispatch(
							"Course/UPLOAD_COVER_PICTURE",
							payload
						);

						pickingImage.value = false;
						coverArtUrl.value = await getDownloadURL(response.ref);
					} catch (err) {
						console.log(err);
						pickingImage.value = false;
						toast({
							component: ToastificationContent,
							props: {
								title: "Error",
								text: `An Error Occured`,
								icon: "XIcon",
								variant: "danger",
							},
						});
					}
				}
			);

			return {
				blogFile,
				blogEdit,
				saveRecord,
				inputImageRenderer,
				avatarText,
				form,
				removeItem,
				repeateAgain,
				items,
				nextTodoId,
				pickingImage,

				isUploading,
				isEditPage,
				introVideo,
				formatter, 
				//  ? Demo - Update Image on click of update button
				refInputEl,
				refPreviewEl,
				previewEl,
			};
		},
	};
</script>
<style lang="scss" scoped>
	.repeater-form {
		overflow: hidden;
		transition: 0.35s height;
	}
</style>

