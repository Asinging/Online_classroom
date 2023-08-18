<template>
	<div class="primary">
		<div
			v-if="!menu.length"
			style="height: 100%"
			class="d-flex align-content-center justify-content-center"
		>
			<b-spinner class="text-white" small />
		</div>

		<ul v-else class="menu">
			<template v-for="(item, index) in menu">
				<li
					:key="index"
					class="py-0"
					:class="{
						'menu-item': item.children,
						'submenu-item': !item.children,
						'p-25': !item.children,
					}"
				>
					<div class="cursor-pointer list-item">
						<span
							class="d-flex justify-content-between"
							@click="updateExpansion(item.title, item)"
						>
							<span
								class="text-white text-capitalize"
								:class="{
									h5: item.children,
									'font-weight-bolder': item.children,
									h4: !item.children,
									h6: !item.children,
								}"
							>
								{{ "Module " + item.title }}
							</span>
							<span
								v-if="item.children"
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								class="mx-1 p-25"
							>
								<span
									class="h3 text-white cursor-pointer rounded-2"
									>{{
										expansionState[item.title] ? "-" : "+"
									}}</span
								>
							</span>
						</span>

						<Menu
							class="submenu"
							v-if="item.children && expansionState[item.title]"
							:menu="item.children"
						></Menu>
					</div>
				</li>
			</template>
		</ul>
	</div>
</template>
<script>
	import { ref } from "@vue/composition-api";
	import Ripple from "vue-ripple-directive";
	import { BButton, BSpinner } from "bootstrap-vue";
	import EventBus from "@/helpers/eventBus";
	export default {
		name: "Menu",
		components: {
			BButton,
			BSpinner,
		},
		directives: {
			Ripple,
		},

		props: {
			menu: {
				type: Array,
				required: true,
			},
		},
		data() {
			return {
				expansionState: {
					1: false,
					2: false,
					3: false,
					4: false,
					5: false,
					6: false,
					7: false,
					8: false,
					9: false,
					10: false,
				},
			};
		},
		watch: {
			menu: {
				deep: true,
				handler: (val) => {
					if (!val || !val.length) return false;
					let x = {};
				},
			},
		},
		computed: {
			computeMenu() {
				if (!this.menu || !this.menu.length) return [];

				return this.menu;
			},
		},
		methods: {
			updateExpansion(node, item) {
				if (!item.children) {
					EventBus.$emit("courseModuleClick", item);
					return false;
				}
				// let x = {};
				// Object.entries(this.expansionState).forEach((item, index) => {
				// 	x[item[0]] = false;
				// });
				// this.expansionState = x;

				this.expansionState[node] = !this.expansionState[node];
			},
		},
	};
</script>


<style>
	ul {
		margin-right: 3px;
		margin-left: 3px;
		padding: 5px;
		list-style-type: none;
		/* transition: max-height 0.3s ease-in-out; */
	}
	.menu-item {
		transition: background-color 0.3s ease;
	}
	.submenu-item {
		transition: background-color 0.3s ease;
		padding-top: 30px;
		padding-bottom: 10px;
		border-radius: 3px;
		font-weight: 900;
	}
	.submenu-item:hover {
		background-color: #008080;
	}
	.submenu-item:active {
		background-color: #051d1d;
	}
</style>


