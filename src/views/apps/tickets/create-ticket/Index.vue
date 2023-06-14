<template>
	<b-overlay
		:show="isSending"
		spinner-variant="primary"
		spinner-type="grow"
		spinner-small
		rounded="sm"
	>
		<b-card v-if="currentUser" class="blog-edit-wrapper">
			<!-- media -->
			<b-media no-body vertical-align="center">
				<b-media-aside class="mr-75">
					<b-avatar
						size="38"
						:src="currentUser.cover_photo_url"
						:text="avatarText(currentUser.username)"
					/>
				</b-media-aside>
				<b-media-body>
					<h6 class="mb-25 text-capitalize">
						{{ `${currentUser.username}` }}
					</h6>
					<b-card-text>{{
						`${moment(Date()).format("MMMM Do YYYY, h:mm a")}`
					}}</b-card-text>
				</b-media-body>
			</b-media>
			<!--/ media -->

			<!-- form -->
			<b-form class="mt-2">
				<b-row>
					<b-col md="6">
						<b-form-group
							label="Title"
							label-for="blog-edit-title"
							class="mb-2"
						>
							<b-form-input
								id="blog-edit-title"
								v-model="subject"
							/>
						</b-form-group>
					</b-col>
					<b-col md="6">
						<b-form-group
							label="Category"
							label-for="blog-edit-category"
							class="mb-2"
						>
							<v-select
								id="blog-edit-category"
								v-model="categorySelected"
								:dir="
									$store.state.appConfig.isRTL ? 'rtl' : 'ltr'
								"
								:options="categoryOption"
							/>
						</b-form-group>
					</b-col>
					<b-col md="6">
						<label for="tags-basic"
							>Type a new tag and press enter</label
						>
						<b-form-tags
							v-model="tag"
							input-id="tags-basic"
							class="mb-2"
						/> </b-col
					><b-col md="6">
						<b-form-group
							label="Email"
							label-for="email"
							class="mb-2"
						>
							<b-form-input
								id="ticket-email"
								v-model="email"
								name="email"
								placeholder="you@oc.com"
							/>
						</b-form-group>
					</b-col>

					<b-col cols="12">
						<b-form-group
							label="Content"
							label-for="blog-content"
							class="mb-2"
						>
							<quill-editor
								id="blog-content"
								v-model="body"
								:options="snowOption"
							/>
						</b-form-group>
					</b-col>

					<b-col cols="12" class="mt-50">
						<b-button
							v-ripple.400="'rgba(255, 255, 255, 0.15)'"
							variant="primary"
							class="mr-1"
							:disabled="isSending"
							@click="sentTicket"
						>
							<span class="pr-25 pt-25">Send </span>
							<span>
								<span v-if="!isSending"
									><feather-icon icon="SaveIcon" size="16"
								/></span>
								<span v-else
									><b-spinner small class=""></b-spinner
								></span>
							</span>
						</b-button>
					</b-col>
				</b-row>
			</b-form>
			<!--/ form -->
		</b-card>
	</b-overlay>
</template>

<script>
	import {
		BCard,
		BMedia,
		BAvatar,
		BCardText,
		BMediaAside,
		BMediaBody,
		BForm,
		BRow,
		BCol,
		BFormGroup,
		BFormInput,
		BImg,
		BOverlay,
		BFormFile,
		BLink,
		BButton,
		BSpinner,
		BFormTags,
	} from "bootstrap-vue";
	import vSelect from "vue-select";
	import { quillEditor } from "vue-quill-editor";
	import Ripple from "vue-ripple-directive";
	import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
	import { computed, ref } from "@vue/composition-api";
	import store from "@/store";
	import { avatarText } from "@core/utils/filter";
	import moment from "moment";
	import { useToast } from "vue-toastification/composition";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
	import { serverTimestamp } from "firebase/firestore";
	export default {
		components: {
			BCard,
			BMedia,
			BAvatar,
			BCardText,
			BMediaAside,
			BMediaBody,
			BForm,
			BLink,
			BImg,
			BRow,
			BCol,
			BButton,
			BFormGroup,
			BFormInput,
			BFormFile,
			BOverlay,
			vSelect,
			quillEditor,
			BSpinner,
			BFormTags,
		},
		directives: {
			Ripple,
		},
		data() {
			return {
				snowOption: {
					theme: "snow",
				},
			};
		},

		setup() {
			const isSending = ref(false);
			const subject = ref("");
			const email = ref("");
			const body = ref("");
			const tag = ref("");
			const categorySelected = ref(null);
			const categoryOption = [
				"others",
				"payment",
				"confirmation",
				"app usablility",
				"administration",
			];
			const toast = useToast();

			const currentUser = computed(() => {
				return store.getters["Auth/currentUserGetter"];
			});

			const sentTicket = () => {
				if (
					!subject.value ||
					!body.value ||
					!email.value ||
					!categorySelected.value
				) {
					toast({
						component: ToastificationContent,
						props: {
							title: "Oops",
							text: `One of the required field has been forgotten, please check!`,
							icon: "AlertTriagleIcon",
							variant: "danger",
						},
					});
					return false;
				}

				let data = {
					created_at: serverTimestamp(),
					status: 1,
					subject: subject.value.toLowerCase(),
					tag: tag.value,
					category: categorySelected.value,
					body:	body.value,
					email: email.value,
					user_id: currentUser.value.id,
				};
	
				isSending.value = true;
				store
					.dispatch("Ticket/CREATE_TICKET", { data })
					.then((resp) => {
						debugger;
						isSending.value = false;
						if (!resp) return false;
						subject.value = "";
						email.value = "";
						categorySelected.value = "";
						tag.value = "";
						body.value = "";
						toast({
							component: ToastificationContent,
							props: {
								title: "All Good",
								text: `Ticket created successfully! Issues will be addresss accordingly`,
								icon: "CheckIcon",
								variant: "success",
							},
						});
					})
					.catch((err) => {
						isSending.value = false;
						console.log(err);
					});
			};
			return {
				isSending,
				subject,
				email,
				body,
				tag,
				categorySelected,
				categoryOption,
				currentUser,
				avatarText,
				sentTicket,
				moment,
			};
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/libs/vue-select.scss";
	@import "@core/scss/vue/libs/quill.scss";
	@import "@core/scss/vue/pages/page-blog.scss";
</style>
