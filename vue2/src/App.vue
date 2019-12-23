<template lang="html">
	<div>
		<router-link :to="{name: 'home'}">home</router-link>
		<router-link :to="{name: 'news'}">news</router-link>
		<router-view/>
	</div>
</template>

<script>
export default {
	name: 'app',
	data(){
		return {
		}
	},
	components: {
	}
}
</script>

<style lang="css" scoped>
</style>
