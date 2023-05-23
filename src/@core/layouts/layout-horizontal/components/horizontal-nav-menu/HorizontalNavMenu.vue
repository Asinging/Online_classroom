<template>
	<div class="navbar-container main-menu-content">
		<!-- <horizontal-nav-menu-items :items="navMenuItems" /> -->
		<horizontal-nav-menu-items :items="[]" />
	</div>
</template>

<script>
	// import navMenuItems from '@/navigation/horizontal'
	import HorizontalNavMenuItems from "./components/horizontal-nav-menu-items/HorizontalNavMenuItems.vue";

	export default {
		components: {
			HorizontalNavMenuItems,
		},
		setup() {
			return {
				// navMenuItems,
			};
		},
	};
</script>

<style lang="scss">
	@import "~@core/scss/base/core/menu/menu-types/horizontal-menu.scss";
</style>
