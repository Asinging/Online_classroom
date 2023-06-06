<template>
	<div class="sidebar-left">
		<div class="sidebar">
			<div class="sidebar-content email-app-sidebar">
				<div class="email-app-menu">
					<vue-perfect-scrollbar
						:settings="perfectScrollbarSettings"
						class="sidebar-menu-list scroll-area"
					>
						<!-- Labels -->
						<h6 class="section-label mt-1 mb-1 px-2">
							Course Module
						</h6>

						<b-list-group class="list-group-labels">
							<b-list-group-item
								style="cursor: pointer"
								v-for="label in prCcourseTitles"
								:key="label.title"
								@click="courseModuleClick(label)"
							>
								<!-- @click="$emit('close-left-sidebar')" -->
								<span class="`bullet-primary"> </span>
								<!-- :class="`bullet-${label.color}`" -->
								<span class="text-capitalized">{{
									label.title
								}}</span>
							</b-list-group-item>
						</b-list-group>
					</vue-perfect-scrollbar>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import VuePerfectScrollbar from "vue-perfect-scrollbar";
	import { BButton, BListGroup, BListGroupItem, BBadge } from "bootstrap-vue";
	import { isDynamicRouteActive } from "@core/utils/utils";
	import Ripple from "vue-ripple-directive";
	import EventBus from "@/helpers/eventBus";

	export default {
		props: {
			courseTitles: {
				type: Array,
				required: true,
				default: () => [],
			},
		},
		directives: {
			Ripple,
		},
		components: {
			// BSV
			BButton,
			BListGroup,
			BListGroupItem,
			BBadge,

			// 3rd Party
			VuePerfectScrollbar,
		},

		setup(props) {
			const perfectScrollbarSettings = {
				maxScrollbarLength: 60,
			};
			const prCcourseTitles = props.courseTitles;
			const courseModuleClick = (item) => {
				EventBus.$emit("close-left-sidebar", item);
				EventBus.$emit("courseModuleClick", item);
			};

			return {
				// UI
				perfectScrollbarSettings,
				prCcourseTitles,
				courseModuleClick,
			};
		},
	};
</script>

<style>
</style>
