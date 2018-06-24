<style scoped>
.context-menu {
	position: fixed;

	color: #d0d0d0;
	background-color: #404040;
}

.context-menu > * {
	margin: 4px 2px;
	padding: 2px 4px;
	background-color: #404040;
	transition: .2s background-color;
}

.context-menu > *:hover {
	background-color: #606060;
}
</style>

<template>
	<div class=context-menu :style=position>
		<slot></slot>
	</div>
</template>

<script>
export default {
	data() {
		return {
			position: {
				top: '-100%',
				left: '-100%',
			},
		};
	},
	methods: {
		open(ev) {
			console.log(ev);
			console.log(this.$el, this.$el.offsetY);
			this.position.top = ev.screenY - this.$el.parentElement.offsetTop + 'px';
			this.position.left = ev.screenX - this.$el.parentElement.offsetLeft + 'px';
		},
	},
};
</script>
