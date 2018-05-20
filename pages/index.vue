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
	<div>
		<header-bar
			:path=$store.state.path
			@move-to-parent=moveToParent />

		<item-list
			id=itemlist
			ref=itemlist
			:files=$store.state.files
			@upload=upload
			@move=move />
	</div>
</template>

<script>
import path from 'path';

import ItemList from '../components/ItemList';
import HeaderBar from '../components/HeaderBar';


export default {
	components: {ItemList, HeaderBar},
	async fetch({store, params, error, redirect}) {
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
	computed: {
		client() {
			return webdavClient(this.endpoint);
		},
	},
	methods: {
		upload(file, data, target) {
			const filename = path.join(target ? target.filename : this.$store.state.path, file.name);
			this.client.putFileContents(filename, data, {format: 'binary'})
				.then(() => this.reload());
		},
		move(file, target) {
			this.client.moveFile(file.filename, path.join(target.filename, file.basename))
				.then(() => this.reload());
		},
		moveToParent(target) {
			const file = this.$refs.itemlist.dragging;
			if (file) {
				this.client.moveFile(file.filename, path.join(target.path, file.basename))
					.then(() => this.reload());
			}
		},
		async reload() {
			await this.$store.dispatch('path/reload');
		},
	},
};
</script>
