<template>
	<div :class="contentWidth === 'boxed' ? 'container p-0' : null">
		<div class="ml-2">
			<back-button class="p-0 m-0 mt-1"></back-button>
		</div>
		<router-view />
	</div>
</template>

<script>
	import useAppConfig from "@core/app-config/useAppConfig";
	import BackButton from "@core/components/back-button/BackButton";

	export default {
		components: {
			BackButton,
		},
		setup() {
			const { contentWidth } = useAppConfig();
			return { contentWidth };
		},
	};
</script>
