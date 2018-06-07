<style scoped>
div {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

#itemlist {
	flex: 1 1 0;
}
</style>

<template>
	<RequiredLogin>
		<div>
			<header-bar />

			<item-list />
		</div>
	</RequiredLogin>
</template>

<script>
import ItemList from '~/components/ItemList';
import HeaderBar from '~/components/HeaderBar';
import RequiredLogin from '~/components/RequiredLogin';


export default {
	components: {ItemList, HeaderBar, RequiredLogin},
	async fetch({store, params, error, redirect}) {
		if (!store.getters.loggedin) {
			return;
		}

		const path = '/' + (params.path || '');
		const stat = await store.dispatch('path/stat', path);

		if (stat.type === 'directory') {
			await store.dispatch('path/changeDir', path);
		} else if (stat.lastmod !== undefined) {
			redirect(await store.dispatch('path/downloadLink', path));
		} else {
			error({statusCode: 404, message: 'No such file or directory'});
		}
	},
	head() {
		return {
			title: '/' + (this.$route.params.path || '') + ' - FileLab',
		};
	},
};
</script>
