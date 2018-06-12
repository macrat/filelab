<style scoped>
.need-login .required-login-contents {
	background-color: #eee;
	filter: blur(4px);
}

.login-form {
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;

	z-index: 1000;
}

.login-form div {
	display: flex;
	flex-direction: column;
	background: white;
	padding: 1em;
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
	<div :class="{ 'need-login': !$store.getters.loggedin }">
		<div class=login-form v-if="!$store.getters.loggedin">
			<div>
				<input placeholder="user name" autofocus v-model=user.name @keydown.enter=nextfocus>
				<input placeholder="password" ref=password type=password v-model=user.password @keydown.enter=login>
				<span v-if=error>{{ error.message }}</span>
				<input type=submit value=login @click=login>
			</div>
		</div>

		<div class=required-login-contents>
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			error: null,
			user: {
				name: this.$store.state.user.name,
				password: this.$store.state.user.password,
			},
		};
	},
	methods: {
		nextfocus() {
			this.$refs.password.focus();
		},
		login() {
			this.$store.dispatch('user/login', this.user)
				.then(() => this.$emit('loggedin'))
				.catch(e => this.error = e);
		},
	},
};
</script>
