<style scoped>
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
	transition: outline .1s;
}
input:focus {
	outline: 2px solid black;
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
		<header-bar />

		<div class=login>
			<div>
				<input placeholder="server address" v-model=host @keydown.enter=focusname>
				<input placeholder="user name" v-model=username v-autofocus ref=username @keydown.enter=focuspass>
				<input placeholder="password" v-model=password type=password ref=password @keydown.enter=login>
				<span v-if=error>{{ error.message }}</span>
				<input type=submit value=login @click=login>
			</div>
		</div>
	</div>
</template>

<script>
import HeaderBar from '~/components/HeaderBar';


export default {
	components: {HeaderBar},
	data() {
		return {
			host: process.env.webdavEndpoint,
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
