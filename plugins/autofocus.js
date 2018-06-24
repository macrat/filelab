import Vue from 'vue';


Vue.directive('autofocus', {
	inserted(elm) {
		elm.focus();
	},
});
