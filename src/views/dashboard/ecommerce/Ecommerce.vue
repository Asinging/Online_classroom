<template>
	<section id="dashboard-ecommerce">
		<b-row class="match-height">
			<b-col xl="4" md="6">
				<ecommerce-medal :data="currentUser" />
			</b-col>
			<b-col xl="8" md="6">
				<ecommerce-statistics :data="statisticalData" />
			</b-col>
		</b-row>
		<b-card>
			<Users :isComponent="true" />
			<!-- <div class="video-container">
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/2hR-uWjBAgw"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div> -->
		</b-card>
	</section>
</template>

<script>
	import { BRow, BCol, BCard } from "bootstrap-vue";

	import { getUserData } from "@/auth/utils";
	import EcommerceMedal from "./EcommerceMedal.vue";
	import EcommerceStatistics from "./EcommerceStatistics.vue";
	import Users from "@/views/apps/user/users-list/UsersList.vue";
	import { kFormatter } from "@/@core/utils/filter";

	export default {
		components: {
			Users,
			BCard,
			BRow,
			BCol,

			EcommerceMedal,
			EcommerceStatistics,
		},
		data() {
			return {
				statisticsItems: [
					{
						id: 1,
						icon: "UserCheckIcon",
						color: "light-primary",
						title: "230k",
						subtitle: "Admins",
						customClass: "mb-2 mb-xl-0",
					},
					{
						id: 2,
						icon: "UsersIcon",
						color: "light-info",
						title: "8.549k",
						subtitle: "Students",
						customClass: "mb-2 mb-xl-0",
					},
					{
						id: 3,
						icon: "DollarSignIcon",
						color: "light-danger",
						title: "1.423k",
						subtitle: "Subscribers",
						customClass: "mb-2 mb-sm-0",
					},
					{
						id: 4,
						icon: "BoxIcon",
						color: "light-success",
						title: "$9745",
						subtitle: "Contents",
						customClass: "",
					},
				],
			};
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
		},
		computed: {
			currentUser() {
				let x = this.$store.getters["Auth/currentUserGetter"];
				return x;
			},
			// userCounter() {
			// 	return this.$store.getters["Counter/userCounterGetter"];
			// },
			// adminCounter() {
			// 	return this.$store.getters["Counter/adminCounterGetter"];
			// },
			// subscriberCounter() {
			// 	return this.$store.getters["Counter/subscriberCounterGetter"];
			// },
			// productCounter() {
			// 	return this.$store.getters["Counter/productCounterGetter"];
			// },

			statisticalData() {
				return this.statisticsItems.map((item) => {
					if (item.id === 1) {
						item.title = kFormatter(3893489);
						this.$store.getters["Counter/adminCounterGetter"] || 0;
						return item;
					}

					if (item.id === 2) {
						item.title = kFormatter(
							this.$store.getters["Counter/userCounterGetter"] || 0
						);
						return item;
					}

					if (item.id === 3) {
						item.title = kFormatter(
							this.$store.getters[
								"Counter/subscriberCounterGetter"
							] || 0
						);
						return item;
					}

					if (item.id === 4) {
						item.title = kFormatter(
							this.$store.getters["Counter/productCounterGetter"] || 0
						);
						return item;
					}
					return item;
				});
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/dashboard-ecommerce.scss";
	@import "@core/scss/vue/libs/chart-apex.scss";
</style>
