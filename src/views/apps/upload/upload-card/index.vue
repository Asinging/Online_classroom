<template>
	<!-- <div>
		<b-overlay
			:show="!isServerResponse"
			spinner-variant="primary"
			spinner-type="grow"
			spinner-large
			rounded="lg"
		>
		
			<section id="knowledge-base-search">
				<b-card-body
					class="card-body d-md-flex justify-content-between"
				>
					<h2 class="text-primary">Recommended contents for you</h2>

					<b-form
						class="kb-search-input d-flex justify-content-end mr-0 pr-0"
					>
						<b-input-group class="input-group-merge">
							<b-input-group-prepend is-text>
								<feather-icon icon="SearchIcon" />
							</b-input-group-prepend>
							<b-form-input
								id="searchbar"
								v-model="searchQuery"
								placeholder="Ask a question...."
							/>
						</b-input-group>
					</b-form>
				
				</b-card-body>
			</section>
			

			<section id="knowledge-base-content">
				<b-row class="kb-search-content-info match-height">
					<b-col
						v-for="item in computeCourses"
						:key="item.id"
						md="4"
						sm="6"
						class="kb-search-content"
					>
						<b-card
							img-height="250"
							class="text-center cursor-pointer"
							:img-src="item.cover_photo_url"
							:img-alt="item.title.slice(5)"
							img-top
							@click="
								$router.push({
									name: 'view-course',
									params: { id: item.id },
								})
							"
						>
							<h4>{{ item.title }}</h4>
							<b-card-text class="mt-1">
								{{ item.description.slice(0, 80) }}
							</b-card-text>
						</b-card>
					</b-col>
					<b-col
						v-show="!computeCourses.length"
						cols="12"
						class="text-center"
					>
						<h4 class="mt-4">Search result not found!!</h4>
					</b-col>
				</b-row>
			</section>
		</b-overlay>
	</div> -->
	<div class="row">
		<div class="mb-0 pb-0 col col-12">
			<b-card
				text-variant="center"
				class="card card-congratulations pb-0 mb-0"
			>
				<b-img
					:src="require('@/assets/images/decore-left.png')"
					class="congratulations-img-left"
				/>
				<b-img
					:src="require('@/assets/images/decore-right.png')"
					class="congratulations-img-right"
				/>
				<!--/ images -->

				<b-avatar variant="primary" size="70" class="shadow mb-2">
					<feather-icon size="28" icon="AwardIcon" />
				</b-avatar>
				<h2
					class="mb-1 mt-50 text-white font-weight-bold course-list-title px-2 text-center"
				>
					Welcome Here, Our No. 1 Site For Video Content That Will
					Make You A Millionaire In The Next 6 Months.
				</h2>
			</b-card>
		</div>
		<div class="course-intro mt-0 pt-0 col-12">
			<div
				class="mt-0 pt-0 d-flex d-flex justify-content-between my-0 py-0"
			>
				<p class="course-intro-text font-weight-bolder h3 pt-0 pt-0">
					Available Courses
				</p>
				<p class="font-weight-bold h5">
					Click on the card to view course
				</p>
			</div>
			<div class="divider pt-25 bg-primary w-100"></div>
		</div>
		<div class="col col-12">
			<b-row class="">
				<b-col
					v-for="item in computeCourses"
					:key="item.id"
					md="4"
					sm="6"
					class=""
				>
					<b-card
						img-height="270"
						class="text-center cursor-pointer"
						:img-src="item.cover_photo_url"
						:img-alt="item.title.slice(5)"
						img-top
						@click="
							$router.push({
								name: 'view-course',
								params: { id: item.id },
							})
						"
					>
						<div
							class="card-title d-flex justify-content-md-start py-0"
						>
							<h2
								class="card-title-text text-capitalize font-weight-bolder"
							>
								{{ item.title }}
							</h2>
						</div>
						<div class="card-description-text my-0 py-0">
							<h4
								class="card-description-text text-capitalize font-weight-bolder text-left py-0 mt-0"
							>
								{{ item.description.slice(0, 80) }}
							</h4>
						</div>
						<div class="mt-1">
							<p class="text-muted h5 text-left pb-1">
								<span> Created By Super Admin </span>
								<feather-icon icon="UserIcon" size="18" />
							</p>
							<div class="d-flex justify-content-start">
								<ul class="text-left">
									<li class="font-weight-bolder">
										{{ item.tracks }} Modules
									</li>
									<li class="font-weight-bolder">
										Life time access
									</li>
								</ul>
							</div>
						</div>
						<div class="d-flex justify-content-center">
							<b-button
								class="mt-25 mentorship_button text-center font-weight-bolder"
								size="md"
								variant="primary"
								block
							>
								<span
									class="h4 font-weight-bolder text-white button_text"
								>
									View Course</span
								>
							</b-button>
						</div>
					</b-card>
				</b-col>
				<b-col
					v-show="!computeCourses.length"
					cols="12"
					class="text-center"
				>
					<h4 class="mt-4">Search result not found!!</h4>
				</b-col>
			</b-row>
		</div>
	</div>
</template>

<script>
	import {
		BImg,
		BOverlay,
		BRow,
		BCol,
		BCard,
		BCardBody,
		BForm,
		BInputGroup,
		BFormInput,
		BCardText,
		BInputGroupPrepend,
		BAvatar,
		BButton,
	} from "bootstrap-vue";
	import { getRandomFromArray } from "@core/utils/utils";
	import FeatherIcon from "@/@core/components/feather-icon/FeatherIcon.vue";

	export default {
		components: {
			BImg,
			BOverlay,
			BRow,
			BCol,
			BCard,
			BCardBody,
			BCardText,
			BForm,
			BInputGroup,
			BInputGroupPrepend,
			BFormInput,
			FeatherIcon,
			BAvatar,
			BButton,
		},
		data() {
			return {
				searchQuery: "",
				returnSearchedCourses: [],
				kb: [],
				isServerResponse: false,
				defaultImg: [
					require("@/assets/images/illustration/sales.svg"),
					require("@/assets/images/illustration/marketing.svg"),
					require("@/assets/images/illustration/api.svg"),
					require("@/assets/images/illustration/personalization.svg"),
					require("@/assets/images/illustration/email.svg"),
					require("@/assets/images/illustration/demand.svg"),
				],
			};
		},
		watch: {
			searchQuery: {
				immediate: false,
				async handler(val) {
					if (!val) {
						this.returnSearchedCourses = [];
						return false;
					}

					let payload = {
						searchString: val.toLocaleLowerCase(),
					};
					try {
						let response = await this.$store.dispatch(
							"Course/SEARCH_COURSES",
							payload
						);

						this.returnSearchedCourses = [...response];
					} catch (err) {}
				},
			},
		},
		computed: {
			// filteredKB() {
			// 	const searchQueryLower = this.searchQuery.toLowerCase();
			// 	return this.kb.filter(
			// 		(item) =>
			// 			item.title.toLowerCase().includes(searchQueryLower) ||
			// 			item.desc.toLowerCase().includes(searchQueryLower)
			// 	);
			// },

			computeCourses() {
				let getCoursesObj = this.$store.getters["Course/allCourseGetter"];
				let course = this.searchQuery
					? this.returnSearchedCourses
					: getCoursesObj;

				if (!course) return [];
				return course.map((item) => {
					if (!item.cover_photo_url) {
						let arr = this.defaultImg;
						item.cover_photo_url = getRandomFromArray(arr);
					}
					return item;
				});
			},
		},
		created() {
			this.$http.get("/kb/data/knowledge_base").then((res) => {
				this.kb = res.data;
			});
			let payload = {
				page: 1,
				pageNumber: 1,
			};
			this.$store.dispatch("Course/GET_COURSES", payload).then((resp) => {
				this.isServerResponse = true;
			});
		},
	};
</script>

<style lang="scss" >
	@import "@core/scss/vue/pages/page-knowledge-base.scss";
	.course-list-title {
		// font-family: Arial sans-serif !important;
		font-family: Georgia, sans-serif;
		font-weight: 900 !important;
	}
	.card {
		border-radius: 15px;
	}
</style>
