<style scoped>
ul {
	display: flex;
	margin: 0;
	padding: 0;
}

li {
	display: block;
}

a {
	display: block;
	font-size: 18px;
	padding: 4px 24px;
	margin: 6px 1px 0;
	background-color: #d0d0d0;
	color: #404040;
	text-decoration: none;
}

img {
	height: 22px;
	margin: -4px -8px;
}

.current {
	background-color: #fafafa;
}
</style>

<template>
	<ul>
		<li v-for="bread in breadList">
			<nuxt-link :to=bread.path :class="{current: bread.path === path}" v-if="bread.path === '/'"><img src="~~/node_modules/material-design-icons/action/svg/production/ic_home_24px.svg"></nuxt-link>
			<nuxt-link :to=bread.path :class="{current: bread.path === path}" v-else>{{ bread.name }}</nuxt-link>
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
