<template>
	<!-- <section id="dashboard-analytics">
		<b-row class="match-height">
			<b-col lg="6" md="12">
				<analytics-congratulation :data="currentUser" />
			</b-col>
			<b-col lg="3" sm="6">
				<statistic-card-with-area-chart
					v-if="data.subscribersGained"
					icon="UsersIcon"
					:statistic="subscriberGain"
					statistic-title="Subscribers Gained"
					:chart-data="data.subscribersGained.series"
				/>
			</b-col>
			<b-col lg="3" sm="6">
				<statistic-card-with-area-chart
					v-if="data.ordersRecevied"
					icon="PackageIcon"
					color="warning"
					:statistic="engagingContent"
					statistic-title="Engaging Contents"
					:chart-data="data.ordersRecevied.series"
				/>
			</b-col>
		</b-row>

		<b-row class="match-height">
			<b-col xl="4" md="4" sm="6">
				<router-link :to="{ name: 'courses-card' }">
					<b-card class="earnings-card border-0">
						<b-row>
							<b-col cols="3">
								<feather-icon icon="ListIcon" size="50" />
							</b-col>
							<b-col cols="9">
								<b-card-title class="mb-1">
									List of Courses</b-card-title
								>
								<b-card-text class="text-primary h5">
									<span class=""> View all </span>
								</b-card-text>
							</b-col>
						</b-row>
					</b-card>
				</router-link>
			</b-col>

			<b-col xl="4" sm="6" md="4">
				<router-link :to="{ name: 'app-raise-ticket' }">
					<b-card class="earnings-card border-0">
						<b-row>
							<b-col cols="3">
								<feather-icon icon="FilePlusIcon" size="50" />
							</b-col>
							<b-col cols="9">
								<b-card-title class="mb-1">
									Encouter An Issue
								</b-card-title>
								<b-card-text class="text-primary h5">
									<span class=""> Raise Ticket </span>
								</b-card-text>
							</b-col>
						</b-row>
					</b-card>
				</router-link>
			</b-col>
			<b-col sm="6" xl="4" md="4">
				<router-link :to="{ name: 'telegram-class' }">
					<b-card class="earnings-card border-0">
						<b-row>
							<b-col cols="3">
								<feather-icon icon="PackageIcon" size="50" />
							</b-col>
							<b-col cols="9">
								<b-card-title class="mb-1">
									Webinar
								</b-card-title>
								<b-card-text class="text-primary h5">
									<span class="">
										Join our extended class</span
									>
								</b-card-text>
							</b-col>
						</b-row>
					</b-card>
				</router-link>
			</b-col>
			<b-col sm="6">
				<router-link :to="{ name: 'support-team' }">
					<b-card class="earnings-card border-0">
						<b-row>
							<b-col cols="3">
								<feather-icon icon="HelpCircleIcon" size="50" />
							</b-col>
							<b-col cols="9">
								<b-card-title class="mb-1">
									Need Help
								</b-card-title>
								<b-card-text class="text-primary h5">
									<span class="">
										Reach out to our support</span
									>
								</b-card-text>
							</b-col>
						</b-row>
					</b-card>
				</router-link>
			</b-col>
			<b-col sm="6">
				<router-link
					:to="{
						name: 'view-course',
						params: {
							id: 0,
						},
					}"
				>
					<b-card class="earnings-card border-0">
						<b-row>
							<b-col cols="3">
								<feather-icon icon="TvIcon" size="50" />
							</b-col>
							<b-col cols="9">
								<b-card-title class="mb-1">
									Premium course
								</b-card-title>
								<b-card-text class="text-primary h5">
									<span class="">
										Watch Recomended Premium Course</span
									>
								</b-card-text>
							</b-col>
						</b-row>
					</b-card>
				</router-link>
			</b-col>
		</b-row>
	</section> -->
	<div>
		<div class="row no-gutters">
			<div class="col col-12">
				<p
					class="header_title font-weight-bolder text-capitalize m-2 h1"
				>
					Welcome Back, {{ currentUser.username }}
				</p>
			</div>
			<div class="col col-12">
				<div class="row no-gutters">
					<div class="col col-12 col-sm-6 col-md-9">
						<!--  -->
						<b-card class="card m-1">
							<div class="my-2 mb-2 pb-1">
								<p
									class="video_card_header h3 font-weight-bolder"
								>
									Most Engaged Video
								</p>
								<p
									class="video_card_subheader h5 font-weight-bold"
								>
									Watch the video people find more interesting
									in platform
								</p>
							</div>
							<div class="mx-2">
								<div
									v-if="isRequesting"
									class="align-items-center d-flex justify-content-center"
								>
									<div
										class="containing_container_payment text-center"
									>
										<b-spinner
											size="xl"
											class="text-center text-primary"
										></b-spinner>
									</div>
								</div>

								<div
									v-else-if="
										course && computeCourseDisplay.isIframe
									"
									class="iframe3 p-0 my-1 embed-responsive embed-responsive-16by9"
									v-html="computeCourseDisplay.video_url"
								></div>

								<div class="" v-else>
									<b-alert
										variant="danger"
										show
										class="text-center"
									>
										<div
											class="alert-body text-center d-flex justify-content-between"
										>
											<span
												>No intro video uploaded yet.
											</span>
										</div>
									</b-alert>
								</div>
							</div>
							<div class="mx-2">
								<b-button
									@click="toClassroom"
									class="mt-25"
									size="md"
									variant="primary"
								>
									<feather-icon
										class="mr-25"
										size="18"
										icon="BookIcon"
									/>
									<span
										class="font-weight-bolder video_card_button_text"
										>Go To Classroom</span
									>
								</b-button>
							</div>
						</b-card>
					</div>

					<div class="col col-12 col-sm-6 col-md-3">
						<b-card class="mt-1">
							<div class="d-flex py-1 justify-content-center">
								<feather-icon
									class="font-weight-bold mr-25"
									size="25"
									icon="UsersIcon"
								/>
								<p class="mentorship_title h3 font-weight-bold">
									Mentorship Group
								</p>
							</div>
							<div class="d-flex justify-content-center">
								<p
									class="mentorship_description font-weight-bold text-center"
								>
									More Premium Lessons Join Our Online
									Communityp
								</p>
							</div>

							<div class="d-flex justify-content-center">
								<b-button
									@click="toTelegram"
									class="mt-25 mentorship_button text-center font-weight-bold"
									size="md"
									variant="primary"
									block
								>
									<span class="h3 text-white button_text">
										Join Now</span
									>
								</b-button>
							</div>
						</b-card>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		BAlert,
		BLink,
		BRow,
		BCol,
		BCard,
		BEmbed,
		BSpinner,
		BCardText,
		BCardTitle,
		BButton,
	} from "bootstrap-vue";

	import StatisticCardWithAreaChart from "@core/components/statistics-cards/StatisticCardWithAreaChart.vue";
	import { kFormatter } from "@core/utils/filter";

	import AnalyticsCongratulation from "./AnalyticsCongratulation.vue";
	import { checkIframe } from "@/helpers/iframe-helpers";

	export default {
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				let isAdmin = JSON.parse(
					sessionStorage.getItem("isAdminIn") || "false"
				);
				if (isAdmin) {
					vm.$router.push("/admin/dashboard");
					return;
				}
				// access to component public instance via `vm`
			});
		},
		components: {
			BCard,
			BRow,
			BCol,
			BAlert,
			BLink,
			BEmbed,
			BSpinner,
			AnalyticsCongratulation,
			BCardText,
			BCardTitle,
			BButton,

			StatisticCardWithAreaChart,
		},
		data() {
			return {
				data: {
					subscribersGained: {
						series: [
							{
								name: "Subscribers",
								data: [28, 40, 36, 52, 38, 60, 55],
							},
						],
						analyticsData: {
							subscribers: 92600,
						},
					},
					ordersRecevied: {
						series: [
							{
								name: "Contents",
								data: [10, 15, 8, 15, 7, 12, 8],
							},
						],
					},
				},
				courseDisplay: null,
				course: null,
				isRequesting: true,
			};
		},
		computed: {
			computeCourseDisplay() {
				return this.courseDisplay ? checkIframe(this.courseDisplay) : null;
			},
			currentUser() {
				let x = this.$store.getters["Auth/currentUserGetter"];
				return x;
			},
			subscriberGain() {
				return kFormatter(1676);
				// let x= this.$store.getters["Counter/adminCounterGetter"] || 0;
			},
			engagingContent() {
				return kFormatter(
					this.$store.getters["Counter/productCounterGetter"] || 0
				);
			},
		},
		created() {
			this.$store
				.dispatch("Counter/COUNTER", {
					collection: "Users",
					field: "user_type",
					value: 1,
					mutationName: "mAdminCount",
				})
				.catch((err) => console.log());

			this.$store
				.dispatch("Counter/COUNTER", {
					collection: "Users",
					field: "user_type",
					value: 2,
					mutationName: "mUserCount",
				})
				.catch((err) => console.log());

			this.$store
				.dispatch("Counter/COUNTER", {
					collection: "Users",
					field: "subscribed",
					value: true,
					mutationName: "mSubscriberCount",
				})
				.catch((err) => console.log());

			this.$store
				.dispatch("Counter/COUNTER", {
					collection: "courses",
					field: "status",
					value: 1,
					mutationName: "mProductCount",
				})
				.catch((err) => console.log());
			this.isRequesting = true;
			this.$store
				.dispatch("Course/GET_SINGLE_COURSE", {
					field: "intro_video",
					value: 1,
				})
				.then((response) => {
					this.isRequesting = false;
					if (!response) {
						return false;
					}
					this.courseDisplay = response.mudules[0];
					this.course = response;
				})
				.catch((err) => {
					this.isRequesting = false;
					console.log(err);
				});
		},

		methods: {
			toTelegram() {
				window.open("https://t.me/+i2V9hq_xQrEzNjlk", "_blank");
			},
			toClassroom() {
				this.$router.push({
					name: "courses-card",
					params: { newUpload: true, edit: false, id: 2 },
				});
			},
			toUpload() {
				this.$router.push({
					name: "upload-course",
					params: { newUpload: true, edit: false, id: 2 },
				});
			},
			kFormatter,
		},
	};
	// <style lang="sss" scoped>
</script>
	<style lang="scss" scoped >
	.header_title {
		font-weight: 800;
		font-family: Arial, Helvetica, sans-serif;
	}
	.card {
		border-radius: 12px !important;
	}
	.video_card_header {
		font-weight: 600;
		font-family: Arial, Helvetica, sans-serif;
	}
	.video_card_subheader {
		font-weight: 500;
		font-family: Arial, Helvetica, sans-serif;
	}
	.iframe3 {
		position: relative;
		overflow: hidden;
		padding-bottom: 56.25%; /* 16:9 aspect ratio (height / width) */
		// width: 100%;
		max-height: 200px;
		// height: 38vh;
		border-radius: 7px !important;
		border: 1px solid rgb(249, 249, 250) !important;
	}
	.iframe3 iframe {
		position: absolute;
		width: 100%;
		height: 30px;
		top: 0;
		left: 0;
		right: 1;
		border-radius: 12px !important;

		border: 0; /* Remove iframe border */
	}
	.video_card_button_text {
		font-weight: 500;
		font-family: Arial, Helvetica, sans-serif;
	}

	.mentorship_title {
		font-weight: 900 !important;
		font-family: Arial, Helvetica, sans-serif;
	}
	.button_text {
		font-weight: 900 !important;
	}
</style>
