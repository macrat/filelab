<style scoped>
a {
	display: block;
	width: 96px;
	height: 96px;
	text-align: center;
	overflow: hidden;
	color: #202020;
	text-decoration: none;
}

i {
	display: block;
	font-size: 52px;
	margin-bottom: -2px;
	color: #404040;
}

span {
	display: block;
	word-break: break-all;
	word-wrap: word-break;
}
</style>

<template>
	<nuxt-link :to=file.filename v-if="file.type === 'directory'">
		<i class=material-icons>{{ icon }}</i>
		<span>{{ file.basename }}</span>
	</nuxt-link>

	<a :href=file.downloadLink :type=file.mime target=_blank v-else>
		<i class=material-icons>{{ icon }}</i>
		<span>{{ file.basename }}</span>
	</a>
</template>

<script>
export default {
	props: ['file'],
	computed: {
		icon() {
			if (this.file.type === 'directory') {
				return 'folder';
			}

			const icons = new Map([
				['image', 'image'],
				['video', 'movie'],
				['audio', 'music_note'],
			]);
			return icons.get(this.file.mime.split('/')[0]) || 'insert_drive_file';
		},
	},
};
</script>
