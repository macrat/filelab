<style scoped>
ul {
	display: block;
	margin: 0;
	padding: 0 4px;
	white-space: nowrap;
	overflow: hidden;
}

li {
	display: inline-block;
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
			<nuxt-link
				:to=bread.filename
				:class="{current: bread.filename === $store.state.path}"
				@dragover.native.prevent="dragover($event, bread)"
				@drop.native.prevent="drop($event, bread)"
				draggable=false>

				<img
					src="~~/node_modules/material-design-icons/action/svg/production/ic_home_24px.svg"
					draggable=false
					v-if="bread.filename === '/'">

				<span v-else>{{ bread.basename }}</span>
			</nuxt-link>
		</li>
	</ul>
</template>

<script>
export default {
	computed: {
		breadList() {
			if (this.$store.state.path === '/') {
				return [{basename: '/', filename: '/'}];
			}

			const result = [{basename: '/', filename: ''}];

			const items = this.$store.state.path.slice(1).split('/');
			for (let i=0; i<items.length; i++) {
				result.push({
					basename: items[i],
					filename: result[i].filename + '/' + items[i],
				});
			}
			result[0].filename = '/';

			return result;
		},
	},
	methods: {
		dragover(ev, dir) {
			if (this.$store.state.path !== dir.path) {
				ev.dataTransfer.dropEffect = 'move';

				return false;
			} else {
				ev.dataTransfer.dropEffect = 'none';

				return true;
			}
		},
		drop(ev, dir) {
			if (this.$store.state.path !== dir.filename) {
				const file = this.$store.state.dragging;
				if (file) {
					this.$store.dispatch('file/move', {
						file: file,
						target: dir,
					});
				}
				return false;
			}
		},
	},
};
</script>
