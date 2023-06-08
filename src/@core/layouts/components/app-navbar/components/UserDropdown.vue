<template>
	<b-nav-item-dropdown
		right
		toggle-class="d-flex align-items-center dropdown-user-link"
		class="dropdown-user"
	>
		<template #button-content>
			<div class="d-sm-flex d-none user-nav">
				<p class="user-name font-weight-bolder mb-0">
					<small></small>
					{{ currentUser.fullName }}
				</p>
				<span class="user-status">{{ currentUser.role }}</span>
			</div>
			<b-avatar
				size="40"
				:src="currentUser.avatar"
				variant="light-primary"
				badge
				class="badge-minimal"
				badge-variant="success"
			>
				<!-- <feather-icon
					v-if="currentUser.fullName"
					icon="UserIcon"
					size="22"
				/> -->
			</b-avatar>
		</template>

		<b-dropdown-item
			:to="{ name: 'pages-profile' }"
			link-class="d-flex align-items-center"
		>
			<feather-icon size="16" icon="UserIcon" class="mr-50" />
			<span>Profile</span>
		</b-dropdown-item>

		<b-dropdown-item link-class="d-flex align-items-center" @click="logout">
			<feather-icon size="16" icon="LogOutIcon" class="mr-50" />
			<span>Logout</span>
		</b-dropdown-item></b-nav-item-dropdown
	>
</template>

<script>
	import {
		BNavItemDropdown,
		BDropdownItem,
		BDropdownDivider,
		BAvatar,
	} from "bootstrap-vue";
	import { initialAbility } from "@/libs/acl/config";
	import useJwt from "@/auth/jwt/useJwt";
	import { avatarText } from "@core/utils/filter";

	export default {
		components: {
			BNavItemDropdown,
			BDropdownItem,
			BDropdownDivider,
			BAvatar,
		},
		data() {
			return {
				// currentUser: JSON.parse(localStorage.getItem("userData") || "{}"),
				avatarText,
			};
		},
		computed: {
			currentUser() {
				return this.$store.getters["Auth/currentUserGetter"];
			},
		},
		methods: {
			logout() {
				// Remove userData from localStorage
				// ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token

				this.$store
					.dispatch("Auth/LOG_OUT")
					.catch((err) => console.log(er));

				// Remove userData from localStorage
				localStorage.removeItem("userData");

				// Reset ability
				this.$ability.update(initialAbility);

				// Redirect to login page
				this.$router.push({ name: "auth-login" });
			},
		},
	};
</script>
