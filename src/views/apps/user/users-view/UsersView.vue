<template>
	<div>
		<!-- Alert: No item found -->
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

		<template v-if="userData">
			<!-- First Row -->
			<b-row>
				<b-col cols="12">
					<user-view-user-info-card :user-data="userData" />
				</b-col>
			</b-row>
		</template>
	</div>
</template>

<script>
	import store from "@/store";
	import router from "@/router";
	import { ref, onUnmounted, onBeforeMount } from "@vue/composition-api";
	import { BRow, BCol, BAlert, BLink, BSpinner } from "bootstrap-vue";

	import UserViewUserInfoCard from "./UserViewUserInfoCard.vue";

	export default {
		components: {
			BSpinner,
			BRow,
			BCol,
			BAlert,
			BLink,

			// Local Components
			UserViewUserInfoCard,
		},
		setup() {
			const userData = ref(null);
			const userDataNotFound = ref(false);

			onBeforeMount(async () => {
				let id = router.currentRoute.params.id;
				try {
					let response = await store.dispatch(
						"Users/GET_SINGLE_USER_BY_Id",
						{
							id,
						}
					);
					console.log(response);
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
				router.push({
					name: "apps-users-list",
				});
			};

			return { listClick, userData, userDataNotFound };
		},
	};
</script>

<style>
</style>
