<style scoped>
header {
	background-color: #d8d8d8;
	padding: 4px;
}
</style>

<template>
	<header>
		<bread-list :path=path />
	</header>
</template>

<script>
import BreadList from './BreadList';


export default {
	props: ['path'],
	components: {BreadList},
};
</script>
