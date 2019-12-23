import Vue from 'vue';
import App from './App.vue'
import router from './routers';


let vm = new Vue({
	el: "#app",
	data: {
	},
	router,
	components: {
		App
	},
	template:`
	<App/>
	`
})
