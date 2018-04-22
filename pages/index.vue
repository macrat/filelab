<template>
	<div>
		<h1>{{ path }}</h1>
		<ul>
			<li v-for="file in files">
				<nuxt-link :to=file.filename v-if="file.type === 'directory'">{{ file.basename }}</nuxt-link>
				<a :href=file.downloadLink :type=file.mime target=_blank v-else>{{ file.basename }} ({{ file.mime }})</a>
			</li>
		</ul>
	</div>
</template>

<script>
import mime from 'mime';
import webdavClient from 'webdav';


export default {
	async asyncData({params, env}) {
		const client = webdavClient(env.webdavEndpoint);

		const path = '/' + (params.path || '');
		let files = [];
		let exists = true;

		try {
			files = (await client.getDirectoryContents(path)).map(x => Object.assign(x, {
				mime: x.type === 'directory' ? 'text/directory' : (x.mime || mime.getType(x.basename) || 'application/octet-stream'),
				downloadLink: x.type === 'directory' ? '' : client.getFileDownloadLink(x.filename),
			}));
		} catch(e) {
			exists = false;
		}

		return {
			path: path,
			files: files,
			exists: exists,
		};
	},
};
</script>
