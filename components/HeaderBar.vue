<style scoped>
header {
	background-color: #404040;
}
</style>

<template>
	<header>
		<bread-list :path=path @move-to-parent="x => $emit('move-to-parent', x)" />
	</header>
</template>

<script>
import BreadList from './BreadList';


export default {
	props: ['path'],
	components: {BreadList},
};
</script>
