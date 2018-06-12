<style scoped>
header {
	flex-shrink: 0;
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
		<nuxt-link to=/ tabindex=-1>FileLab</nuxt-link>

		<slot />
	</header>
</template>
