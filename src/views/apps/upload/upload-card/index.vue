<template>
	<div>
		<b-overlay
			:show="!isServerResponse"
			spinner-variant="primary"
			spinner-type="grow"
			spinner-large
			rounded="lg"
		>
			<!-- search input -->
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
					<!-- form -->
				</b-card-body>
			</section>
			<!--/ search input -->

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
	</div>
</template>

<script>
	import {
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
	} from "bootstrap-vue";
	import { getRandomFromArray } from "@core/utils/utils";

	export default {
		components: {
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

<style lang="scss">
	@import "@core/scss/vue/pages/page-knowledge-base.scss";
</style>
