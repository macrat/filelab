<style scoped>
a {
	display: block;
	width: 96px;
	height: 96px;
	text-align: center;
	overflow: hidden;
	color: #202020;
	text-decoration: none;
	transition: .2s transform, .2s opacity;
}

a:focus {
	outline: none;
	background-color: #e0e0e0;
}

a.dragging {
	opacity: .8;
	transform: scale(.8, .8);
}

a.draghover {
	transform: scale(1.4, 1.4);
}

a.disabled {
	opacity: .5;
}

.icon {
	width: 52px;
	height: 52px;
	margin-bottom: -2px;
	opacity: .75;
}

.thumbnail {
	width: auto;
	max-width: 96px;
	height: 52px;
	margin-bottom: -2px;
}

span {
	display: block;
	word-break: break-all;
	word-wrap: word-break;
}
</style>

<template>
	<nuxt-link
			v-if="file.type === 'directory'"
			:to=file.accessPath
			:class="{dragging: dragging, draghover: draghover, disabled: !dragging && disabled}"
			:data-file="JSON.stringify(file)"
			draggable=true
			@dragstart.native=dragstart
			@dragend.native=dragend
			@dragleave.native=dragleave
			@dragover.native.prevent=dragover
			@drop.native.prevent=drop>

		<img class=icon :src=icon alt="" decode=async />
		<span>{{ file.basename }}</span>
	</nuxt-link>

	<a
			v-else
			:href=file.downloadLink
			:type=file.mime
			target=_blank
			:class="{dragging: dragging, draghover: draghover, disabled: !dragging && disabled}"
			:data-file="JSON.stringify(file)"
			draggable=true
			@dragstart=dragstart
			@dragend=dragend>

		<img class=icon :src=icon alt="" decode=async v-if=!thumbnailLoaded />
		<img class=thumbnail :src=thumbnailURL alt="" decode=async crossorigin=use-credentials v-show=thumbnailLoaded @load="thumbnailLoaded = true" />
		<span>{{ file.basename }}</span>
	</a>
</template>

<script>
export default {
	props: ['file', 'disabled'],
	data() {
		return {
			dragging: false,
			draghover: false,
			thumbnailLoaded: false,
		}
	},
	computed: {
		icon() {
			if (this.file.type === 'directory') {
				return require('material-design-icons/file/svg/production/ic_folder_48px.svg');
			}

			const icons = new Map([
				['image', require('material-design-icons/image/svg/production/ic_image_48px.svg')],
				['video', require('material-design-icons/av/svg/production/ic_movie_48px.svg')],
				['audio', require('material-design-icons/image/svg/production/ic_music_note_48px.svg')],
			]);
			const anotherFile = require('material-design-icons/editor/svg/production/ic_insert_drive_file_48px.svg');
			return icons.get(this.file.mime.split('/')[0]) || anotherFile;
		},
		thumbnailURL() {
			if (this.file.mime.startsWith('image/')) {
				return this.file.downloadLink;
			} else {
				return null;
			}
		},
		droppable() {
			return this.file.type === 'directory';
		},
	},
	methods: {
		dragstart(ev) {
			this.dragging = true;

			ev.dataTransfer.setData('DownloadURL', this.file.DownloadLink);
			ev.dataTransfer.setData('text/uri-list', this.file.DownloadLink);

			ev.dataTransfer.setDragImage(this.$el.getElementsByTagName('img')[0], 0, 0);

			this.$emit('dragstart', ev, this);
		},
		dragend(ev) {
			this.dragging = false;

			this.$emit('dragend', ev, this);
		},
		dragleave(ev) {
			this.draghover = false;
		},
		dragover(ev) {
			if (!this.dragging) {
				this.draghover = true;
			}
			ev.dataTransfer.dropEffect = 'move';

			return false;
		},
		drop(ev) {
			return false;
		},
	},
};
</script>
