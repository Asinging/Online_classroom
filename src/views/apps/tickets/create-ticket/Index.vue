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
								multiple
								:options="categoryOption"
							/>
						</b-form-group>
					</b-col>
					<b-col md="6">
						<b-form-group
							label="Slug"
							label-for="blog-edit-slug"
							class="mb-2"
						>
							<b-form-input
								id="ticket-email"
								v-model="tag"
								name="email"
								placeholder="Phone, accessories"
							/>
						</b-form-group> </b-col
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
									><feather-icon icon="PlusIcon" size="16"
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
			const categorySelected = ref([]);
			const categoryOption = ["Fashion", "Food", "Gaming", "Quote", "Video"];
			const toast = useToast();

			const currentUser = computed(() => {
				return store.getters["Auth/currentUserGetter"];
			});

			const sentTicket = () => {
				if (
					!subject.value ||
					!body.value ||
					!email.value ||
					!categorySelected.value.length
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
					create_at: serverTimestamp(),
					status: 1,
					subject: subject.value,
					tag: tag.value,
					category: categorySelected.value,
					email: email.value,
				};
				let payload = {
					userId: currentUser.value.id,
					data: data,
				};
				isSending.value = true;
				setTimeout(() => {
					isSending.value = false;
				}, 3000);
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
