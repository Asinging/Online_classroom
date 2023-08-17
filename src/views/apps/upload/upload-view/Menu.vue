<template>
	<div class="primary">
		<div
			v-if="!menu.length"
			style="height: 100%"
			class="d-flex align-content-center justify-content-center"
		>
			<b-spinner class="text-white" small />
		</div>

		<ul v-else class="mr-1">
			<template v-for="(item, index) in menu">
				<li :key="index + Date.now()" class="">
					<div class="cursor-pointer list-item">
						<span class="d-flex justify-content-between h5">
							<span
								class="font-weight-bold text-white text-capitalize"
							>
								{{ "Module " + item.title }}
							</span>
							<span
								v-if="item.children"
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								class="mx-1 p-25"
								@click="updateExpansion(item.title)"
							>
								<span
									class="h3 text-white cursor-pointer rounded-2"
									>{{
										computeExpansionState[item.title]
											? "-"
											: "+"
									}}</span
								>
							</span>
						</span>

						<Menu
							v-if="item.children && expansionState[item.title]"
							:menu="item.children"
						></Menu>
					</div>

					<hr
						v-if="!item.children"
						class="divider py-0 pb-0 bg-white"
					/>
				</li>
			</template>
		</ul>
	</div>
</template>
<script>
	import { ref } from "@vue/composition-api";
	import Ripple from "vue-ripple-directive";
	import { BButton, BSpinner } from "bootstrap-vue";
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
				expansionState: {},
			};
		},

		computed: {
			computeExpansionState() {
				return this.expansionState;
			},
			computeMenu() {
				if (!this.menu || !this.menu.length) return [];
				return this.menu;
			},
		},
		methods: {
			updateExpansion(node) {
				debugger;
				// this.$nextTick(() => {
				this.expansionState[node] = !this.expansionState[node];
				console.log(this.expansionState[node]);
				// });
			},
		},
	};
</script>


<style>
	ul,
	ol {
		margin-right: 10px;
		padding: 5px;
		list-style-type: none;
	}
	li {
		/* padding: 10px; */
		transition: background-color 0.3s ease; /* Adding a smooth transition effect */
	}

	li:hover {
		/* background-color: #f0f0f0; */
		/* Change to the desired hover background color */
	}
</style>


