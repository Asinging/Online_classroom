<template>
	<div class="primary">
		<div
			v-if="!menu.length"
			style="height: 100%"
			class="d-flex align-content-center justify-content-center"
		>
			<b-spinner class="text-white" small />
		</div>

		<ul v-else>
			<template v-for="(item, index) in menu">
				<li :key="index + Date.now()" class="">
					<div class="cursor-pointer">
						<span class="d-flex justify-content-between">
							<span class="font-weight-bold h4 text-white">
								{{ "Module " + item.title }}
							</span>
							<button
								v-if="item.children"
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								class="btn mx-1 p-25"
								@click="updateExpansion(item.title)"
							>
								<span
									class="font-weight-bold h3 text-white cursor-pointer rounded-2"
									>{{
										expansionState[item.title] ? "-" : "+"
									}}</span
								>
							</button>
						</span>
						<!-- v-if="item.children && expansionState[item.title]" -->
						<Menu :menu="item.children"></Menu>
					</div>
				</li>
			</template>
		</ul>
		<!-- <div class="divider pt-25 bg-primary w-100"></div> -->
	</div>
</template>
<script>
	import { ref } from "@vue/composition-api";
	import Ripple from "vue-ripple-directive";
	import { BButton, BSpinner } from "bootstrap-vue";
	export default {
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
		methods: {
			updateExpansion(node) {
				this.expansionState[node] = !this.expansionState[node];
			},
		},
	};
</script>


