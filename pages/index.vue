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
		<header-bar :path=path />
		<item-list
			id=itemlist
			:files=files
			@upload=upload
			@move=move />
	</div>
</template>

<script>
import mime from 'mime';
import path from 'path';
import webdavClient from 'webdav';

import ItemList from '../components/ItemList';
import HeaderBar from '../components/HeaderBar';


async function loadFiles(client, path) {
	return (await client.getDirectoryContents(path)).map(x => Object.assign(x, {
		mime: x.type === 'directory' ? 'text/directory' : (x.mime || mime.getType(x.basename) || 'application/octet-stream'),
		downloadLink: x.type === 'directory' ? '' : client.getFileDownloadLink(x.filename),
	})).sort((x, y) => {
		if (x.basename < y.basename) {
			return -1;
		} else if (x.basename > y.basename) {
			return 1;
		} else {
			return 0;
		}
	});
}


export default {
	components: {ItemList, HeaderBar},
	async asyncData({params, env, redirect, error}) {
		const client = webdavClient(env.webdavEndpoint);

		const path = '/' + (params.path || '');
		let files = [];

		const stat = await client.stat(path);
		if (stat.type === 'directory') {
			return {
				path: path,
				files: await loadFiles(client, path),
				endpoint: env.webdavEndpoint
			};
		} else if (stat.lastmod === undefined) {
			error({statusCode: 404, message: 'No such file or directory'});
		} else {
			redirect(client.getFileDownloadLink(path));
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
		upload(file, data) {
			this.client.putFileContents(path.join(this.path, file.name), data, {format: 'binary'})
				.then(() => this.reload());
		},
		move(file, target) {
			this.client.moveFile(file.filename, path.join(target.filename, file.basename))
				.then(() => this.reload());
		},
		async reload() {
			this.files = await loadFiles(this.client, this.path);
		},
	},
};
</script>
