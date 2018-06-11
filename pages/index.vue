<style scoped>
header {
	display: flex;
	flex-direction: row;
	background-color: #404040;
}

header a {
	color: #d0d0d0;
	text-decoration: none;
	margin: 6px 1px 0;
	padding: 4px 8px;
}

.login {
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
}

.login div {
	display: flex;
	flex-direction: column;
	padding: 1em;
	width: 20em;
}

input {
	display: block;
	font-size: 120%;
	outline: none;
	border: none;
	background-color: #f0f0f0;
	margin: 4px;
	padding: 8px;
}
input[type=submit] {
	align-self: flex-end;
}
span {
	color: red;
}
</style>

<template>
	<div>
		<header>
			<nuxt-link to=/>FileLab</nuxt-link>
		</header>

		<div class=login>
			<div>
				<input placeholder="server address" v-model=host autofocus @keydown.enter=focusname>
				<input placeholder="user name" v-model=username ref=username @keydown.enter=focuspass>
				<input placeholder="password" v-model=password type=password ref=password @keydown.enter=login>
				<span v-if=error>{{ error.message }}</span>
				<input type=submit value=login @click=login>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			host: 'http://localhost:3001',
			username: '',
			password: '',
			error: null,
		};
	},
	head() {
		return {
			title: 'FileLab',
		};
	},
	methods: {
		focusname() {
			this.$refs.username.focus();
		},
		focuspass() {
			this.$refs.password.focus();
		},
		login() {
			this.$store.commit('endpoint/set', this.host);
			this.$store.dispatch('user/login', {name: this.username, password: this.password})
				.then(() => this.$router.push('/' + encodeURIComponent(this.host) + '/'))
				.catch(e => this.error = e);
		},
	},
};
</script>
