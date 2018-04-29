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
		<li v-for="file in files">
			<item-button
				:file=file
				:disabled="file.type !== 'directory' && dragging"
				@dragstart="dragging = true"
				@dragend="dragging = false" />
		</li>
	</ul>
</template>

<script>
import ItemButton from '../components/ItemButton';


export default {
	props: ['files'],
	components: {ItemButton},
	data() {
		return {dragging: false};
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
		drop(ev) {
			const {files} = ev.dataTransfer;
			if (files.length > 0) {
				for (let i=0; i<files.length; i++) {
					const reader = new FileReader();
					reader.onload = data => {
						this.$emit('upload', files[i], data.target.result);
					};
					reader.readAsArrayBuffer(files[i]);
				}

				return false;
			}
		},
	},
}
</script>
