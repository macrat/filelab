<style scoped>
ul {
	display: flex;
	margin: 0;
	padding: 8px;
	flex-wrap: wrap;
	align-content: flex-start;
}

li {
	display: block;
	margin: 8px;
}
</style>

<template>
	<ul @dragover.prevent=dragover @drop.prevent=drop>
		<li v-for="file in $store.state.files">
			<item-button
				:file=file
				:disabled="file.type !== 'directory' && dragging"
				@dragstart=dragstart
				@dragend="dragging = null" />
		</li>
	</ul>
</template>

<script>
import ItemButton from '../components/ItemButton';


export default {
	components: {ItemButton},
	data() {
		return {dragging: null};
	},
	watch: {
		dragging(value) {
			if (!value) {
				this.$children.forEach(x => {
					if (x.dragleave) {
						x.dragleave();
					}
				});
			}
		},
	},
	methods: {
		dragover(ev) {
			ev.dataTransfer.dropEffect = 'move';

			return false;
		},
		dragstart(ev, item) {
			this.dragging = item.file;
		},
		drop(ev) {
			const target = JSON.parse(ev.target && ev.target.dataset.file || ev.target.parentElement && ev.target.parentElement.dataset.file || 'null');
			const {files} = ev.dataTransfer;

			if (files.length > 0) {
				for (let i=0; i<files.length; i++) {
					const reader = new FileReader();
					reader.onload = data => {
						this.$emit('upload', files[i], data.target.result, target);
					};
					reader.readAsArrayBuffer(files[i]);
				}

				this.dragging = null;
				return false;
			}

			if (target) {
				if (this.dragging.filename !== target.filename) {
					this.$emit('move', this.dragging, target);
				}
				this.dragging = null;
				return false;
			}
		},
	},
}
</script>
