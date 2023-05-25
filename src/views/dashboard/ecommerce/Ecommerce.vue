<template>
	<section id="dashboard-ecommerce">
		<b-row class="match-height">
			<b-col xl="4" md="6">
				<ecommerce-medal :data="data.congratulations" />
			</b-col>
			<b-col xl="8" md="6">
				<ecommerce-statistics :data="data.statisticsItems" />
			</b-col>
		</b-row>
		<b-card>
			<div class="video-container">
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/2hR-uWjBAgw"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		</b-card>
	</section>
</template>

<script>
	import { BRow, BCol, BCard } from "bootstrap-vue";

	import { getUserData } from "@/auth/utils";
	import EcommerceMedal from "./EcommerceMedal.vue";
	import EcommerceStatistics from "./EcommerceStatistics.vue";

	export default {
		components: {
			BCard,
			BRow,
			BCol,

			EcommerceMedal,
			EcommerceStatistics,
		},
		data() {
			return {
				data: {},
			};
		},
		created() {
			// data
			this.$http.get("/ecommerce/data").then((response) => {
				this.data = response.data;

				// ? Your API will return name of logged in user or you might just directly get name of logged in user
				// ? This is just for demo purpose
				const userData = getUserData();
				this.data.congratulations.name =
					userData.fullName.split(" ")[0] || userData.username;
			});
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/dashboard-ecommerce.scss";
	@import "@core/scss/vue/libs/chart-apex.scss";
</style>
