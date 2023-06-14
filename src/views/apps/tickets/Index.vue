<template>
	<div>
		<b-overlay
			:show="isSending"
			spinner-variant="primary"
			spinner-type="grow"
			spinner-small
			rounded="sm"
		>
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
					<h2 class="text-primary">Searched Available Queries</h2>
					<b-card-text class="mb-2">
						or choose a category to quickly find the tickets that may be raised
					</b-card-text>

					<!-- form -->
					<b-form class="faq-search-input">
						<b-input-group class="input-group-merge">
							<b-input-group-prepend is-text>
								<feather-icon icon="SearchIcon" />
							</b-input-group-prepend>
							<b-form-input
								id="searchbar"
								v-model="seachQuery"
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
			<b-card-text class="text-center py-1 font-weight-bold h5">
				<b-alert variant="success" v-if="seachQuery" class="text-center py-1 font-weight-bold h5" show>
					Searched Result
				</b-alert>
			</b-card-text>
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
					v-for="(categoryObj, index) in computeTickets"
					:key="index"
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
		</b-overlay>
	</div>
</template>

<script>
	import {
		BAlert,
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
		BOverlay,
	} from "bootstrap-vue";
	import Collapsible from "./Collapsible.vue";

	export default {
		components: {
			BAlert,
			BOverlay,
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
				isSending:false,
				tabIndex: 0,
				snowOption: {
					theme: "snow",
				},

				ticketData: [
							// payment
							 {
										icon: 'CreditCardIcon',
										title: 'Payment',
										subtitle: 'Payment Categories',
										id:1,
										body:[], 
								key: 'payment',
										
							},
						 {
										icon: 'CheckIcon',
										title: 'Confirmation',
										subtitle: 'Confirmation Categories',
								key: 'confirmation',
								id:2, body:[]
									
							},
				
								 {
										icon: 'RefreshCwIcon',
										title: 'App Usablility',
										subtitle: 'All App Usability Categories',
										key: 'app usability',
								id:3,
								body:[]
									
							},
							{
										icon: 'PackageIcon',
										title: 'Others',
										subtitle: 'Unspecified Miscellaneous Categories',
								key: 'others',

								id:4,
								body:[]
									
							},
					 {
							icon: 'SettingsIcon',
										title: 'Adminstration',
										subtitle: 'About Adminstrations',
							key: 'administration',
								id:5,
								body:[]
										
							}
				],
				seachQuery: "",
				faqData: {},
				searchQueryResult:[],
				searchCategory:{},
			};
		},
		watch: {
			tabIndex:{
				immediate:false,
				handler(val){
					if(this.seachQuery){
this.searchCategory =this.structureItemForSearch(val)
return false
					}
					this.seachQuery = ''
					this.fetchTickets(this.structureItemForSearch(val))
			
				}
			},
			seachQuery: {
				immediate: true,
				handler(val) {
					if(!val ) return false
					this.isSending = true
					this.$store.dispatch("Ticket/SEARCH_TICKET", {searchString:val.toLowerCase()}).then(resp=>{
						this.isSending = false
					
						this.searchQueryResult = resp
					}).catch(err=>{
						this.isSending = false
					})
					
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
		mounted(){
			setTimeout(()=>{
				this.isSending = false
			},15000)
		},
		computed:{
			computeTickets(){
				let tickets = this.seachQuery? this.searchQueryResult : this.$store.getters["Ticket/allTicketGetter"]
			

	
				if(!tickets) return this.ticketData



						return this.ticketData.map(item=>{
								if(this.seachQuery){
									item.body = tickets.filter(ticketItem=>{
						return ticketItem.category == item.key
					})
					return item
							}
					item.body = tickets
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
				
				this.isSending = true
				this.$store.dispatch("Ticket/GET_TICKETS", payload).then(resp=>{
					if(!resp) return  false
				
					this.isSending=false
					
				}).catch(err=>{
					this.isSending =false
			
			})
			
			},

		},
	};
</script>

<style lang="scss">
	@import "@core/scss/vue/pages/page-faq.scss";
</style>
