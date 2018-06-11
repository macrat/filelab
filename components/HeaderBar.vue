<style scoped>
header {
	display: flex;
	flex-direction: row;
	background-color: #404040;
}

a {
	color: #d0d0d0;
	text-decoration: none;
	margin: 6px 1px 0;
	padding: 4px 8px;
}
</style>

<template>
	<header>
		<nuxt-link to=/>FileLab</nuxt-link>
		<bread-list />
	</header>
</template>

<script>
import BreadList from './BreadList';


export default {
	components: {BreadList},
};
</script>
