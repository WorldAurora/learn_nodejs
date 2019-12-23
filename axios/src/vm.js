import Vue from 'vue/dist/vue.esm';
import Axios from 'axios';
import {stringify} from 'querystring';


const axios = Axios.create({
	transformRequest: [
		function(data){
			return stringify(data);
		}
	]
});

let vm = new Vue({
	el: '#div1',
	data: {
		name: 'hello',
		age: 0,
		result: 0
	},
	methods: {
		async fcuser(){
			let res = await fetch('./data/user.json');
			let data = await res.json();

			this.name = data.name;
			this.age = data.age;
		},
		async axuser(){
			let {data} = await Axios.get('./data/user.json')

			this.name = data.name;
			this.age = data.age;
		},
		async fcsum(){
			let formdata = new FormData();
			formdata.append('a', 86);
			formdata.append('b', 3);

			let res = await fetch('data/sum.php', {
				method: 'post',
				body: formdata,
			});
			let result = await res.json();
			alert(result);
		},
		async sum(){
			let {data} = await axios({
				url: './data/sum.php',
				method: 'post',
				data: {
					a: 44,
					b: 34,
				},
			});
			console.log(data);
		}
	},
	async created(){
		this.fcsum();
},
	template: `
	<div>
		<label>姓名:</label><span>{{name}}</span><br />
		<label>年龄:</label><span>{{age}}</span>
	</div>
	`
});
