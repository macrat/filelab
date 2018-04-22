<style scoped>
ul {
	display: inline;
	margin: 0;
	padding: 0;
}

li {
	display: inline-block;
}

a {
	padding: 4px 16px;
	margin: 0 1px;
	color: black;
	background-color: #e0e0e0;
	text-decoration: none;
}

a.current {
	background-color: #f8f8f8;
}
</style>

<template>
	<ul>
		<li v-for="bread in breadList">
			<nuxt-link :to=bread.path :class="{current: bread.path === path}">{{ bread.name }}</nuxt-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: ['path'],
	computed: {
		breadList() {
			if (this.path === '/') {
				return [{name: '/', path: '/'}];
			}

			const result = [{name: '/', path: ''}];

			const items = this.path.slice(1).split('/');
			for (let i=0; i<items.length; i++) {
				result.push({
					name: items[i],
					path: result[i].path + '/' + items[i],
				});
			}
			result[0].path = '/';

			return result;
		},
	},
};
</script>
