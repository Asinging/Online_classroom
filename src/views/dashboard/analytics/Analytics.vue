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
		<b-card>
			<div
				class="video-container justify-content-center align-items-center"
				style="min-height: 500px"
			>
				<b-embed
					type="iframe"
					aspect="16by9"
					src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
					allowfullscreen
				/>
			</div>
		</b-card>
	</section>
</template>

<script>
	import { BRow, BCol, BCard, BEmbed } from "bootstrap-vue";

	import StatisticCardWithAreaChart from "@core/components/statistics-cards/StatisticCardWithAreaChart.vue";
	import { kFormatter } from "@core/utils/filter";

	import AnalyticsCongratulation from "./AnalyticsCongratulation.vue";

	export default {
		components: {
			BEmbed,
			BCard,
			BRow,
			BCol,
			AnalyticsCongratulation,

			StatisticCardWithAreaChart,
		},
		data() {
			return {
				data: {},
			};
		},
		computed: {
			currentUser() {
				let x = this.$store.getters["Auth/currentUserGetter"];
				return x;
			},
			subscriberGain() {
				return kFormatter(3893489);
				// this.$store.getters["Counter/adminCounterGetter"] || 0;
			},
			engagingContent() {
				return kFormatter(
					this.$store.getters["Counter/productCounterGetter"] || 0
				);
			},
		},
		created() {
			// data
			this.$http.get("/analytics/data").then((response) => {
				this.data = response.data;
			});

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
		},

		methods: {
			kFormatter,
		},
	};
</script>
