import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/home.vue';
import News from '@/news.vue';


Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/news',
			name: 'news',
			component: News
		},
	]
});
