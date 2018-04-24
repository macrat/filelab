<style scoped>
ul {
	display: flex;
	margin: 0;
	padding: 8px;
	flex-wrap: wrap;
}

li {
	display: block;
	margin: 8px;
}
</style>

<template>
	<ul>
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
}
</script>
