<template>
	<b-card
		text-variant="center"
		class="card card-congratulations"
		:variant="variant"
		v-ripple.400="'rgba(255, 255, 255, 0.15)'"
		style="cursor: pointer"
	>
		<!--/ images -->

		<b-avatar :variant="variant" size="70" class="shadow mb-2">
			<feather-icon size="28" icon="AwardIcon" />
		</b-avatar>
		<h3 class="mb-1 mt-50 text-white">{{ title }}</h3>
		<b-card-text class="m-auto w-75">
			{{ text }}
		</b-card-text>
	</b-card>
</template>

<script>
	import {
		BImg,
		BCard,
		BCardText,
		BCardTitle,
		BAvatar,
		VBHover,
	} from "bootstrap-vue";
	import VuexyLogo from "@core/layouts/components/Logo.vue";
	import Ripple from "vue-ripple-directive";
	export default {
		directives: {
			Ripple,
		},
		components: {
			BImg,
			BCard,
			BCardText,
			BCardTitle,
			BAvatar,

			VuexyLogo,
		},
		props: {
			title: {
				type: String,
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			variant: {
				type: String,
				default: "primary",
			},
		},
		data() {
			return {};
		},
	};
</script>

<style>
	.hovered-class {
		background-color: yellow;
	}
</style>