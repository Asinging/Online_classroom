<template>
	<b-row
		v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
		class="content-header"
	>
		<!-- Content Left -->
		<b-col class="content-header-left mb-2" cols="12" md="9">
			<b-row class="breadcrumbs-top">
				<b-col cols="12">
					<h2 class="content-header-title float-left pr-1 mb-0">
						{{ $route.meta.pageTitle }}
					</h2>
					<div class="breadcrumb-wrapper">
						<b-breadcrumb>
							<b-breadcrumb-item to="/" class="text-primary text-decoration-none">
								<feather-icon
									icon="HomeIcon"
									size="16"
									class="align-text-top"
								/>
							</b-breadcrumb-item>
							<b-breadcrumb-item
								v-for="item in $route.meta.breadcrumb"
								:key="item.text"
								:active="item.active"
								:to="item.to"
								class="text-primary text-decoration-none"
							>
								{{ item.text }}
							</b-breadcrumb-item>
						</b-breadcrumb>
					</div>
				</b-col>
				
			</b-row>
		</b-col>

  
		<b-col
				class="content-header-right text-md-right d-md-block d-none mb-1"
				md="3"
				cols="12"
		>
    
				<back-button></back-button>

		</b-col>
	</b-row>
</template>

<script>
	import {
		BBreadcrumb,
		BBreadcrumbItem,
		BRow,
		BCol,
		BDropdown,
		BDropdownItem,
		BButton,
	} from "bootstrap-vue";
	import Ripple from "vue-ripple-directive";
	import BackButton from "@core/components/back-button/BackButton.vue"

	export default {
		directives: {
			Ripple,
		},
		components: {
			BBreadcrumb,
			BBreadcrumbItem,
			BRow,
			BCol,
			BDropdown,
			BDropdownItem,
			BButton,
			BackButton
		},
	};
</script>
