<template>
	<b-card v-if="data" text-variant="center" class="card card-congratulations">
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
		<h1 class="mb-1 mt-50 text-white text-capitalize h2">
			Hi {{ data.username }},
		</h1>
		<b-card-text class="m-auto w-75">
			Welcome Here, Our No. 1 site for Video content that could make you a
			millionaire in the next 6 Months.
		</b-card-text>
	</b-card>
</template>

<script>
	import { BCard, BImg, BAvatar, BCardText } from "bootstrap-vue";

	export default {
		components: {
			BCard,
			BAvatar,
			BImg,
			BCardText,
		},
		props: {
			data: {
				type: Object,
				default: () => {},
			},
		},
	};
</script>
