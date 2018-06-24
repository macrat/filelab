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
    <div @contextmenu.prevent=$refs.menu.open>
        <ul @dragover.prevent=dragover @drop.prevent=drop>
            <li v-for="file in $store.state.files">
                <item-button
                    :file=file
                    :disabled="file.type !== 'directory' && $store.state.dragging"
                    @dragstart=dragstart
                    @dragend="$store.commit('dragging/unset')" />
            </li>
        </ul>

        <context-menu ref=menu>
            <div>hello</div>
            <div>world</div>
        </context-menu>
    </div>
</template>

<script>
import ItemButton from './ItemButton';
import ContextMenu from './ContextMenu';


export default {
	components: {ItemButton, ContextMenu},
	watch: {
		'$store.state.dragging': function(value) {
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
			this.$store.commit('dragging/set', item.file);
		},
		drop(ev) {
			const target = JSON.parse(ev.target && ev.target.dataset.file || ev.target.parentElement && ev.target.parentElement.dataset.file || 'null');
			const {files} = ev.dataTransfer;

			if (files.length > 0) {
				for (let i=0; i<files.length; i++) {
					const reader = new FileReader();
					reader.onload = data => {
						this.$store.dispatch('file/upload', {
							file: files[i],
							data: data.target.result,
							target: target,
						});
					};
					reader.readAsArrayBuffer(files[i]);
				}
				this.$store.commit('dragging/unset');
				return false;
			}

			if (target) {
				const file = this.$store.state.dragging;
				if (file && file.filename !== target.filename) {
					this.$store.dispatch('file/move', {file, target});
				}
				this.$store.commit('dragging/unset');
				return false;
			}
		},
	},
}
</script>
