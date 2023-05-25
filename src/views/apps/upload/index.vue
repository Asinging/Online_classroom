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
				<p></p>
				<p>
					<b-media class="mb-2">
						<template #aside>
							<b-avatar
								ref="previewEl"
								:text="avatarText('I M G')"
								variant="secondary"
								size="100px"
								rounded
							/>
						</template>

						<div class="d-flex flex-wrap align-end">
							<b-button
								variant="primary"
								@click="$refs.refInputEl.click()"
							>
								<input
									ref="refInputEl"
									type="file"
									class="d-none"
									@input="inputImageRenderer"
								/>
								<feather-icon
									v-if="!pickingImage"
									icon="PlusIcon"
									class="mr-25"
								/>

								<b-spinner v-else class="mr-25" small />
								<span class="d-none d-sm-inline"
									>Pick Image</span
								>
								<feather-icon
									icon="EditIcon"
									class="d-inline d-sm-none"
								/>
							</b-button>
						</div>
					</b-media>
				</p>
			</app-timeline-item>

			<app-timeline-item
				variant="secondary"
				icon="LinkIcon"
				class="mt-md-5"
			>
				<!-- <div
					class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0"
				>	 -->
				<div class="mb-1 mb-sm-0">
					<h4>Course Propertise</h4>
					<p class="text-primary">
						Go to the YouTube video or playlist you want to embed.
						From the list of Share options, click Embed. From the
						box that appears, copy the HTML code. Paste the code
						into the Below marked for youtube video
					</p>
					<div>
						<div class="pl-3 mb-1">
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
											/>
										</b-form-group>
									</b-col>

									<!-- Cost -->
									<b-col md="4">
										<b-form-textarea
											v-model="
												items[index].courseDescription
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
										col="12"
										class="mx-1 mb-1 mb-md-3 d-flex justify-content-end"
									>
										<b-button
											v-ripple.400="
												'rgba(255, 255, 255, 0.15)'
											"
											variant="primary"
											@click="repeateAgain"
											class="sm mr-2"
											size="sm"
											v-if="items.length === index + 1"
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
											class="mt-0 text-right d-flex justify-content-end"
											@click="removeItem(index)"
											size="sm"
										>
											<feather-icon
												icon="XIcon"
												class="mr-25"
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
		<b-col col="12" class="mx-1 mb-2 mb-md-5 d-flex justify-content-end">
			<b-button
				v-ripple.400="'rgba(234, 84, 85, 0.15)'"
				variant="success"
				class="mt-0 text-right d-flex justify-content-end"
				@click="removeItem(index)"
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
		BButton,
		BCollapse,
		VBToggle,
		BListGroup,
		BListGroupItem,
		BAvatarGroup,
		BBadge,
		VBTooltip,
		BCard,
		BForm,
		BRow,
		BCol,
		BFormGroup,
		BFormInput,
		BFormTextarea,
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

	import {
		ref,
		onBeforeMount,
		onMounted,
		onUnmounted,
		nextTick,
	} from "@vue/composition-api";

	export default {
		mixins: [heightTransition],
		components: {
			BSpinner,
			AppTimeline,
			AppTimelineItem,
			BCard,
			BImg,
			BMedia,

			BAvatar,
			BButton,
			BCollapse,
			BListGroup,
			BListGroupItem,
			BAvatarGroup,
			BBadge,
			BForm,
			BRow,
			BCol,
			BFormGroup,
			BFormInput,
			BFormTextarea,
		},
		directives: { "b-toggle": VBToggle, "b-tooltip": VBTooltip, Ripple },

		setup(props) {
			const toast = useToast();
			const isUpdateProfilePhoto = ref(false);
			const isEditingRecord = ref(false);

			const pickingImage = ref(false);
			const isUploading = ref(false);
			const nextTodoId = ref(2);
			const items = ref([
				{
					courseTitle: "",
					courseDescriptions: "designer",
					videoUrl: "",
				},
			]);

			// ? Demo Purpose => Update image on click of update
			const trHeight = ref(null);
			const refInputEl = ref(null);
			const previewEl = ref(null);
			const row = ref(null);
			const form = ref(null);

			onBeforeMount(() => {
				window.addEventListener("resize", initTrHeight());
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
				trTrimHeight(row.value.offsetHeight);
			};

			const saveRecord = async () => {
				isEditingRecord.value = true;
				let userId = router.currentRoute.params.id;

				try {
					let data = Object.assign({}, computeUserData.value);

					data.updated_at = serverTimestamp();

					let payload = {
						data,
						id: userId,
					};
					await store.dispatch("Users/UPDATE_SINGLE_USER", payload);
					isEditingRecord.value = false;
				} catch (err) {
					console.error(err);
					isEditingRecord.value = false;
				}
			};

			const { inputImageRenderer } = useInputImageRenderer(
				refInputEl,
				async (file) => {
					pickingImage.value = true;

					if (file.size > 6000000) {
						toast({
							component: ToastificationContent,
							props: {
								title: "Oh no",
								text: `File size is greater than the required size (Max 6mb)`,
								icon: "AlertTriangleIcon",
								variant: "warning",
							},
						});
						return false;
					}

					isUploading.value = true;
					let payload = {
						image: file,
					};
					try {
						let response = await store.dispatch(
							"Course/UPLOAD_COVER_PICTURE",
							payload
						);
						console.log(response);
						debugger;
					} catch (err) {
						console.log(err);
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
				isUpdateProfilePhoto,

				//  ? Demo - Update Image on click of update button
				refInputEl,
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
