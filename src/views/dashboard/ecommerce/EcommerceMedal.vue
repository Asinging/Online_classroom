<template>
	<b-card v-if="data" class="card-congratulation-medal">
		<h5 class="text-capitalize">
			Hello 🎉 {{ `${JSON.stringify(data.username)}` }}!
		</h5>
		<b-card-text class="font-small-3">
			Have a walk around your statistics
		</b-card-text>
		<h3 class="mb-75 mt-2 pt-50">
			<!-- <b-link>${{ kFormatter(data.saleToday) }}</b-link> -->
		</h3>
		<!-- <b-button
			v-ripple.400="'rgba(255, 255, 255, 0.15)'"
			variant="primary"
			@click="toStudentPortal"
		>
			Student's Portal
		</b-button> -->
		<b-img
			:src="require('@/assets/images/illustration/badge.svg')"
			class="congratulation-medal"
			alt="Medal Pic"
		/>
	</b-card>
</template>

<script>
	import { BCard, BCardText, BLink, BButton, BImg } from "bootstrap-vue";
	import Ripple from "vue-ripple-directive";
	import { kFormatter } from "@core/utils/filter";

	export default {
		components: {
			BCard,
			BCardText,
			BLink,
			BImg,
			BButton,
		},
		directives: {
			Ripple,
		},
		props: {
			data: {
				type: Object,
				default: () => {},
			},
		},
		methods: {
			kFormatter,
			toStudentPortal() {
				localStorage.setItem("isAdminIn", "false");
				this.$store.commit("appConfig/UPDATE_WHO_IS_IN", true);

				this.$store.commit("appConfig/UPDATE_SKIN", "light");

				this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
					backgroundColor: "primary",
				});
				this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
					type: "floating",
				});
				this.$store.commit("appConfig/UPDATE_FOOTER_CONFIG", {
					type: "floating",
				});

				this.$router.push({ name: "dashboard-analytics" });
			},
		},
	};
</script>
