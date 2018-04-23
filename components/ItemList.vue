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
			<item-button :file=file @dragstart=dragstart @dragend=dragend />
		</li>
	</ul>
</template>

<script>
import ItemButton from '../components/ItemButton';


export default {
	props: ['files'],
	components: {ItemButton},
	methods: {
		dragstart(ev, target) {
			this.$children.forEach(x => {
				if (!x.droppable) {
					x.disabled = true;
				}
			});
		},
		dragend(ev, target) {
			this.$children.forEach(x => {
				if (x.dragleave) {
					x.dragleave();
				}
				x.disabled = false;
			});
		},
	},
}
</script>
