<template>
	<div>
		<!-- faq search section -->
		<section id="faq-search-filter">
			<b-card
				no-body
				class="faq-search"
				:style="{
					backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
				}"
			>
				<b-card-body class="text-center">
					<h2 class="text-primary">Searched some questions</h2>
					<b-card-text class="mb-2">
						or choose a category to quickly find the help you need
					</b-card-text>

					<!-- form -->
					<b-form class="faq-search-input">
						<b-input-group class="input-group-merge">
							<b-input-group-prepend is-text>
								<feather-icon icon="SearchIcon" />
							</b-input-group-prepend>
							<b-form-input
								id="searchbar"
								v-model="faqSearchQuery"
								placeholder="Search faq..."
							/>
						</b-input-group>
					</b-form>
					<!-- form -->
				</b-card-body>
			</b-card>
		</section>
		<!--/ faq search section -->

		<!-- frequently asked questions tabs pills -->
		<section id="faq-tabs">
			<b-tabs
				vertical
				content-class="col-12 col-md-8 col-lg-9"
				pills
				nav-wrapper-class="faq-navigation col-md-4 col-lg-3 col-12"
				nav-class="nav-left"
				v-model="tabIndex"
			>
				<!-- payment tab -->
				<b-tab
					v-for="(categoryObj, categoryName, index) in computeTickets"
					:key="categoryName"
					:active="!index"
					
					lazy
				>
		
					<!-- title -->
					<template #title>
						<feather-icon
							:icon="categoryObj.icon"
							size="18"
							class="mr-1"
						/>
						{{index}}
						<span class="font-weight-bold">{{
							categoryObj.title
						}}</span>
					</template>

					<collapsible :options="categoryObj" />
				</b-tab>
				<!--/ payment tab -->

				<!-- sitting lady image -->
				<template #tabs-end>
					<b-img
						fluid
						:src="
							require('@/assets/images/illustration/faq-illustrations.svg')
						"
						class="d-none d-md-block mt-auto"
					/>
				</template>
				<!--/ sitting lady image -->
			</b-tabs>
		</section>
		<!--/ frequently asked questions tabs pills -->

		<!-- contact us -->
	
		<!--/ contact us -->
	</div>
</template>

<script>
	import {
		BCard,
		BCardBody,
		BForm,
		BInputGroup,
		BFormInput,
		BCardText,
		BInputGroupPrepend,
		BTabs,
		BTab,
		BImg,
		BRow,
		BCol,
		BAvatar,
	} from "bootstrap-vue";
	import Collapsible from "./Collapsible.vue";

	export default {
		components: {
			BForm,
			BCard,
			BRow,
			BCol,
			BAvatar,
			BCardBody,
			BInputGroup,
			BFormInput,
			BCardText,
			BInputGroupPrepend,
			BTabs,
			BTab,
			BImg,
			Collapsible,
	
		},
		data() {
			return {
				tabIndex: 0,

				ticketData: [
							// payment
							 {
										icon: 'CreditCardIcon',
										title: 'Payment',
										subtitle: 'Payment Categories',
										id:1,
										body:[]
										
							},
						 {
										icon: 'CheckIcon',
										title: 'Confirmation',
										subtitle: 'Confirmation Categories',
								id:2, body:[]
									
							},
				
								 {
										icon: 'RefreshCwIcon',
										title: 'App Usablility',
										subtitle: 'All App Usability Categories',
								id:3,
								body:[]
									
							},
							{
										icon: 'PackageIcon',
										title: 'Others',
										subtitle: 'Unspecified Miscellaneous Categories',

								id:4,
								body:[]
									
							},
					 {
										icon: 'SettingsIcon',
										title: 'Adminstration',
										subtitle: 'About Adminstrations',
								id:5,
								body:[]
										
							}
				],
				faqSearchQuery: "",
				faqData: {},
				response:{},
			};
		},
		watch: {
			tabIndex:{
				handler(val){
					this.fetchTickets(this.structureItemForSearch(val))
			
				}
			},
			faqSearchQuery: {
				immediate: true,
				handler() {
					this.fetchData();
				},
			},
		},
		created(){
		let item = {
			field:'category', 
			value:'payment'
		}
			this.fetchTickets(item)
		},
		computed:{
			computeTickets(){
				let tickets = this.$store.getters["Ticket/allTicketGetter"]
				
				if(!tickets) return this.ticketData
				return this.ticketData.map(item=>{
					item.body = tickets
					// .map(ele=>{
					// 	ele.title = ele.subject
					// 	return title
					// })
					return item
				})

			}
		},
		methods: {
			structureItemForSearch(tabIndex){
				let obj = {
					0:{field:'category', 
					value:'payment'
				}, 		
				1:{field:'category', 
					value:'confirmation'
				}, 	
					2:{field:'category', 
					value:'app usablility'
				}, 
					3:{field:'category', 
					value:'others'
				},
					4:{field:'category', 
					value:'administration'
				}, 
			}
			return obj[tabIndex]
			},
			fetchTickets(item){
			let	payload = {
					field:item.field,
					value:item.value
				}
				
				this.$store.dispatch("Ticket/GET_TICKETS", payload).then(resp=>{
					if(!resp) return  false
					this.response =  resp
					
				}).catch(err=>console.log(err))
			},


			fetchData() {
				this.$http
					.get("/faq/data", { params: { q: this.faqSearchQuery } })
					.then((res) => {
						this.faqData = res.data;
					});
			},
		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-faq.scss";
</style>
