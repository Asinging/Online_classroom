<template>
	<component :is="!userData ? 'div' : 'b-card'">
		<div
			height="100"
			v-if="!userData"
			class="d-flex justify-content-center align-content-center"
		>
			<b-alert variant="danger" v-if="userDataNotFound" show>
				<h4 class="alert-heading">Error fetching User data</h4>
				<div class="alert-body">
					No user found with this user id. Check
					<b-link class="alert-link" @click="listClick">
						User List
					</b-link>
					for other users.
				</div>
			</b-alert>
			<div v-else>
				<b-spinner
					size="xl"
					class="text-center text-primary"
				></b-spinner>
			</div>
		</div>

		<b-tabs v-if="userData" pills>
			<!-- Tab: Account -->
			<b-tab active>
				<template #title>
					<feather-icon
						icon="UserIcon"
						size="16"
						class="mr-0 mr-sm-50"
					/>
					<span class="d-none d-sm-inline">Account</span>
				</template>
				<user-edit-tab-account
					:user-data="userData"
					class="mt-2 pt-75"
				/>
			</b-tab>
		</b-tabs>
	</component>
</template>

<script>
	import { BTab, BTabs, BCard, BAlert, BLink, BSpinner } from "bootstrap-vue";
	import { ref, onUnmounted, onBeforeMount } from "@vue/composition-api";
	import router from "@/router";
	import store from "@/store";

	import UserEditTabAccount from "./UserEditTabAccount.vue";

	export default {
		components: {
			BSpinner,
			BTab,
			BTabs,
			BCard,
			BAlert,
			BLink,

			UserEditTabAccount,
		},
		setup() {
			const userData = ref(null);
			const userDataNotFound = ref(false);

			onBeforeMount(async () => {
				let id = router.currentRoute.params.id;
				try {
					let response = await store.dispatch("Users/GET_SINGLE_USER", {
						id,
					});

					if (!response) {
						userDataNotFound.value = true;
						return;
					}
					userData.value = response;
				} catch (err) {
					userDataNotFound.value = true;
				}
			});

			const listClick = () => {
				let isAdmin = JSON.parse(
					localStorage.getItem("isAdminIn") || "false"
				);
				router.push({
					name: isAdmin ? "apps-users-list" : "/dashboard-analytics",
				});
			};

			return { listClick, userData, userDataNotFound };
		},
	};
</script>

<style>
</style>
