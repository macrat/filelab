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

a.dragging {
	opacity: .8;
	transform: scale(.8, .8);
}

a.draghover {
	transform: scale(1.4, 1.4);
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
	<nuxt-link
			v-if="file.type === 'directory'"
			:to=file.filename
			:class="{dragging: dragging, draghover: draghover}"
			draggable=true
			@dragstart.native=dragstart
			@dragend.native=dragend
			@dragleave.native=dragleave
			@dragover.native.prevent=dragover>

		<i class=material-icons>{{ icon }}</i>
		<span>{{ file.basename }}</span>
	</nuxt-link>

	<a
			v-else
			:href=file.downloadLink
			:type=file.mime
			target=_blank
			:class="{dragging: dragging, draghover: draghover}"
			draggable=true
			@dragstart=dragstart
			@dragend=dragend>

		<i class=material-icons>{{ icon }}</i>
		<span>{{ file.basename }}</span>
	</a>
</template>

<script>
export default {
	props: ['file'],
	data() {
		return {
			dragging: false,
			draghover: false,
		}
	},
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
	methods: {
		dragstart(ev) {
			this.dragging = true;
		},
		dragend(ev) {
			this.dragging = false;
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
	},
};
</script>
