<template>
	<div>
		<h1>{{ path }}</h1>
		<ul>
			<li v-for="file in files">
				<nuxt-link :to=file.path :type=file.type v-if="file.type === 'text/directory'">{{ file.path }} ({{ file.type }})</nuxt-link>
				<a :href=file.endpoint :type=file.type target=_blank v-else>{{ file.path }} ({{ file.type }})</a>
			</li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios';


export default {
	async asyncData({params}) {
		const path = '/' + (params.path || '');
		let files = [];
		let exists = true;

		try {
			files = (await axios.get('http://localhost:3000/api' + path)).data.contents;
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
