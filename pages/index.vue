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
	<RequiredLogin @loggedin=loggedin>
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
		const path = '/' + (params.path || '');

		store.commit('path/set', path);

		if (!store.getters.loggedin) {
			return;
		}

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
	methods: {
		async loggedin() {
			const path = '/' + (this.$route.params.path || '');
			const stat = await this.$store.dispatch('path/stat', path);

			if (stat.type === 'directory') {
				await this.$store.dispatch('path/changeDir', path);
			} else if (this.$stat.lastmod !== undefined) {
				location.href = await this.$store.dispatch('path/downloadLink', path);
			} else {
				this.$nuxt.error({statusCode: 404, message: 'No such file or directory'});
			}
		},
	},
};
</script>
