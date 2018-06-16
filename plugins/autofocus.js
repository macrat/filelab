import Vue from 'vue';


Vue.directive('autofocus', {
	inserted(elm) {
		console.log('inserted', elm);
		elm.focus();
	},
});
