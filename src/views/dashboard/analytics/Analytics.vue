<template>
	<section id="dashboard-analytics">
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
	</section>
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
	} from "bootstrap-vue";

	import StatisticCardWithAreaChart from "@core/components/statistics-cards/StatisticCardWithAreaChart.vue";
	import { kFormatter } from "@core/utils/filter";

	import AnalyticsCongratulation from "./AnalyticsCongratulation.vue";
	import { checkIframe } from "@/helpers/iframe-helpers";

	export default {
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				let isAdmin = JSON.parse(
					localStorage.getItem("isAdminIn") || "false"
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
				isRequsting: true,
			};
		},
		computed: {
			computeCourseDisplay() {
				if (!this.courseDisplay) return null;
				return checkIframe(this.courseDisplay);
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
			this.isRequsting = true;
			this.$store
				.dispatch("Course/GET_SINGLE_COURSE", {
					field: "intro_video",
					value: 1,
				})
				.then((response) => {
					this.isRequsting = false;
					if (!response) {
						return false;
					}
					this.courseDisplay = response.mudules[0];
					this.course = response;
				})
				.catch((err) => {
					this.isRequsting = false;
					console.log(err);
				});
		},

		methods: {
			toUpload() {
				this.$router.push({
					name: "upload-course",
					params: { newUpload: true, edit: false, id: 2 },
				});
			},
			kFormatter,
		},
	};
</script>
<style scoped>
	.container {
		height: 75vh !important;
		width: 100% !important;
	}
	.video-container {
		position: relative;
	}

	.container_loader {
		height: 30vh;
	}
	.iframeContainer {
		position: relative;
	}
	.iframe {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
