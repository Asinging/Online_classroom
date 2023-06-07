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

						<b-list-group class="list-group-labels cursor-pointer">
							<b-list-group-item
								v-ripple.400="'rgba(113, 102, 240, 0.15)'"
								style="cursor: pointer"
								v-for="label in prCcourseTitles"
								:key="label.title"
								:id="label.video_url"
								@click="courseModuleClick(label)"
							>
								<!-- @click="$emit('close-left-sidebar')" -->
								<span class="`bullet-primary"> </span>
								<!-- :class="`bullet-${label.color}`" -->
								<!-- v-b-tooltip.hover
								:title="lable.title" -->
								<span class="text-capitalized">{{
									label.title.length > 30
										? label.title.slice(0, 27) + " ..."
										: label.title
								}}</span>

								<b-tooltip
									:target="label.video_url"
									placement="bottom"
									triggers="hover"
									variant="primary"
								>
									{{ label.title }}
								</b-tooltip>
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
	import {
		BButton,
		BListGroup,
		BListGroupItem,
		BBadge,
		VBTooltip,
		BTooltip,
	} from "bootstrap-vue";
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
			"b-tooltip": VBTooltip,
		},
		components: {
			// BSV
			BTooltip,
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
