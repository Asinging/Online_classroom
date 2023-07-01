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

		<b-card
			v-if="isRequsting"
			class="align-items-center min-vh-70 d-flex justify-content-center"
		>
			<div class="container text-center">
				<b-spinner
					size="xl"
					class="text-center text-primary"
				></b-spinner>
			</div>
		</b-card>
		<b-card class="container" v-else-if="course">
			<div id="iframeContainer" v-if="computeCourseDisplay.isIframe">
				<div
					class="iframe d-flex"
					v-html="computeCourseDisplay.video_url"
				></div>
			</div>
			<div v-else class="iframe">
				<b-embed
					type="iframe"
					aspect="16by9"
					:src="computeCourseDisplay.video_url"
					allowfullscreen
				/>
			</div>
		</b-card>

		<b-card class="container d-flex align-items-center" v-else>
			<div class="video-container">
				<b-alert variant="danger" show class="text-center">
					<div
						class="alert-body text-center d-flex justify-content-between"
					>
						<span>No intro video uploaded yet. </span>
						<b-link
							:active="true"
							variant="danger"
							@click="toUpload"
							class="text-danger cursor-pointer text-decoration-underline pl-25"
						>
							Click to upload here one and mark it as intro video
						</b-link>
					</div>
				</b-alert>
			</div>
		</b-card>
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
			BEmbed,
			BCard,
			BRow,
			BCol,
			BAlert,
			BLink,
			BSpinner,
			AnalyticsCongratulation,

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
