<style scoped>
li {
	margin: 4px 0;
}

a {
	color: black;
	text-decoration: none;
}
</style>

<template>
	<div>
		<header-bar :path=path />

		<ul>
			<li v-for="file in files">
				<nuxt-link :to=file.filename v-if="file.type === 'directory'">{{ file.basename }}/</nuxt-link>
				<a :href=file.downloadLink :type=file.mime target=_blank v-else>{{ file.basename }} ({{ file.mime }})</a>
			</li>
		</ul>
	</div>
</template>

<script>
import mime from 'mime';
import webdavClient from 'webdav';

import HeaderBar from '../components/HeaderBar';


export default {
	components: {HeaderBar},
	async asyncData({params, env, redirect, error}) {
		const client = webdavClient(env.webdavEndpoint);

		const path = '/' + (params.path || '');
		let files = [];

		const stat = await client.stat(path);
		if (stat.type === 'directory') {
			const files = (await client.getDirectoryContents(path)).map(x => Object.assign(x, {
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

			return {
				path: path,
				files: files,
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
};
</script>
