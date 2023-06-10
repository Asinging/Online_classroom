<template>
	<div class="wrapper d-flex justify-content-center">
		<b-card class="innerWrapper">
			<validation-observer ref="simpleRules">
				<b-form @submit.prevent>
					<b-row>
						<!-- first name -->
						<b-col cols="12">
							<b-form-group
								label="First Name"
								label-for="vi-first-name"
							>
								<b-input-group class="input-group-merge">
									<b-input-group-prepend is-text>
										<feather-icon icon="UserIcon" />
									</b-input-group-prepend>
									<b-form-input
										id="vi-first-name"
										placeholder="Full Name"
										v-model="fulName"
									/>
								</b-input-group>
							</b-form-group>
						</b-col>

						<!-- email -->
						<b-col cols="12">
							<b-form-group label="Email" label-for="vi-email">
								<validation-provider
									#default="{ errors }"
									name="Email"
									rules="required|email"
								>
									<b-input-group class="input-group-merge">
										<b-input-group-prepend is-text>
											<feather-icon icon="MailIcon" />
										</b-input-group-prepend>

										<b-form-input
											:state="
												errors.length > 0 ? false : null
											"
											id="vi-email"
											type="email"
											v-model="email"
											placeholder="Email"
										/>
									</b-input-group>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>
						</b-col>

						<!-- mobile -->
						<b-col cols="12">
							<b-form-group label="Subject" label-for="vi-title">
								<validation-provider
									#default="{ errors }"
									name="Title"
									rules="required"
								>
									<b-input-group class="input-group-merge">
										<b-input-group-prepend is-text>
											<feather-icon
												icon="SmartphoneIcon"
											/>
										</b-input-group-prepend>
										<b-form-input
											id="vi-title"
											type="text"
											:state="
												errors.length > 0 ? false : null
											"
											placeholder="title"
											v-model="title"
										/>
									</b-input-group>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>
						</b-col>

						<!-- password -->
						<b-col cols="12">
							<b-form-group label="Message" label-for="vi-body">
								<validation-provider
									#default="{ errors }"
									name="Body"
									rules="required"
								>
									<b-form-textarea
										:state="
											errors.length > 0 ? false : null
										"
										v-model="body"
										id="textarea-default"
										placeholder="Body"
										rows="3"
									/>
									<small class="text-danger">{{
										errors[0]
									}}</small>
								</validation-provider>
							</b-form-group>
						</b-col>

						<b-col cols="12">
							<b-button
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								type="submit"
								variant="primary"
								class="mr-1"
								:disabled="isSaving"
								@click.prevent="validationForm"
							>
								<span> Submit</span>
								<span class="pl-1">
									<span v-if="!isSaving">
										<feather-icon icon="SaveIcon"
									/></span>
									<span v-else>
										<b-spinner
											label="Loading..."
											class="mr-25"
											small
										/>
									</span>
								</span>
							</b-button>
						</b-col>
					</b-row>
				</b-form>
			</validation-observer>
		</b-card>
	</div>
</template>

<script>
	import { ValidationProvider, ValidationObserver } from "vee-validate";
	import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

	import { required, email } from "@validations";
	import {
		BSpinner,
		BFormTextarea,
		BCard,
		BRow,
		BCol,
		BFormGroup,
		BFormInput,
		BFormCheckbox,
		BForm,
		BButton,
		BInputGroup,
		BInputGroupPrepend,
	} from "bootstrap-vue";
	import Ripple from "vue-ripple-directive";
	export default {
		directives: {
			Ripple,
		},
		components: {
			ToastificationContent,
			BSpinner,
			ValidationProvider,
			ValidationObserver,
			BFormTextarea,
			BCard,
			BRow,
			BCol,
			BFormGroup,
			BFormInput,
			BFormCheckbox,
			BForm,
			BButton,
			BInputGroup,
			BInputGroupPrepend,
		},
		data() {
			return {
				email: "",
				fulName: "",
				title: "",
				body: "",
				required,
				email,
				isSaving: false,
			};
		},
		methods: {
			validationForm() {
				this.$refs.simpleRules.validate().then((success) => {
					if (!success) {
						this.$toast({
							component: ToastificationContent,
							position: "top-right",
							props: {
								title: `Ouch!`,
								icon: "AlertTriangleIcon",
								variant: "danger",
								text: `A required input is left blank please fill out completely`,
							},
						});
						return false;
					}
					this.isSaving = true;
					setTimeout(() => {
						this.isSaving = false;
						this.email = "";
						this.title = "";
						this.body = "";
						this.fulName = "";
						this.$toast({
							component: ToastificationContent,
							position: "top-right",
							props: {
								title: `All Good `,
								icon: "CoffeeIcon",
								variant: "success",
								text: `We have received your message we will get back to you in due time.`,
							},
						});
					}, 3000);
				});
			},
		},
	};
</script>
<style lang="scss">
	.wrapper {
		height: 100vh;
		position: relative;
	}
	.innerWrapper {
		height: inherit;
		width: 40vw;
	}
</style>
