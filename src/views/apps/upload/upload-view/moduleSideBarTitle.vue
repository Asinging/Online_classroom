<template>
	<div class="sidebar-left bg-secondary">
		<div class="sidebar bg-secondary">
			<div class="sidebar-content email-app-sidebar bg-secondary">
				<div class="email-app-menu bg-secondary">
					<vue-perfect-scrollbar
						:settings="perfectScrollbarSettings"
						class="sidebar-menu-list scroll-area bg-secondary-darken"
					>
						<!-- Labels -->
						<div>
							<h5
								class="section-label bg-secondary-darken py-1 px-2 text-white text-decoration-underline font-weight-bold"
							>
								Course Module
							</h5>
						</div>

						<b-list-group
							class="list-group-labels cursor-pointer bg-secondary"
						>
							<b-list-group-item
								v-ripple.400="'rgba(113, 102, 240, 0.15)'"
								style="
									cursor: pointer;
									font-family: sans serif !important ;
								"
								v-for="label in prCcourseTitles"
								:key="label.title"
								:id="label.video_url"
								@click="courseModuleClick(label)"
								class="bg-secondary text-white my-0 py-0 font-weight-bold h5"
							>
								<!-- @click="$emit('close-left-sidebar')" -->
								<span
									class="`bullet-secondary"
									:class="`bullet-${label.color}`"
								>
								</span>
								<!-- :class="`bullet-${label.color}`" -->
								<!-- v-b-tooltip.hover
								:title="lable.title" -->
								<p class="text-capitalize  mt-25">{{
									label.title.length > 23
										? label.title.slice(0, 22) + " .."
										: label.title
								}}</p>

								<b-tooltip
									:target="label.video_url"
									placement="bottom"
									triggers="hover"
									variant="dark"
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
