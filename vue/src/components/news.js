import News1 from './news1';
import News2 from './news2';


export default {
	template:`
	<div>
		新闻
		<div>
			<router-link to="/news/1">新闻1</router-link>
			<router-link to="/news/2">新闻2</router-link>
		</div>
		<router-view></router-view>
	</div>
	`
}

export let router = [
	{
		path: '1',
		component: News1
	},
	{
		path: '2',
		component: News2
	},
];
