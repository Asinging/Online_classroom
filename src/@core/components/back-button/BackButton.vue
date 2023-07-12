<template>
<!-- Back Button for accessing previous page -->
    <div class="container-div"
        v-if="getCurrentRoute"
    >
        <button 
            class="btn btn-relief-primary btn-sm" 
            @click.prevent="goBack()"
            v-b-tooltip.hover.bottom
            title="Back"
        >
            <feather-icon
                icon="ChevronsLeftIcon"
                class="mr-50"
            />
        </button>
    </div>
</template>

<script>
    import {VBTooltip } from "bootstrap-vue";
export default {
    directives: {
        
        "b-tooltip": VBTooltip,
       
    },
    data() {
        return {
        }
    },
    methods: {
        //go back one page
        goBack() {
            this.$router.go(-1)
        },
    },
    computed: {
        getCurrentRoute() {
            let val = this.$route.name
            let routeArray = ['payment', 'auth-forgot-password', 'auth-logout', 'auth-register','auth-login', 'auth-init', 'welcome', 'Dashboard',  'error-404' ]
            if ( !routeArray.includes(val) ) return true
            return false
        }
    },
  
    mounted() {
    }
}
</script>

<style scoped>
.container-div {
    padding: 2px;
    display: inline-block;
}

.container-div button {
    color: white;
}
</style>
