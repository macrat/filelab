module.exports = {
	env: {
		webdavEndpoint: process.env.WEBDAV_ENDPOINT || 'http://localhost:3001/',
	},
	loading: {
		color: '#fafafa',
	},
	plugins: [
		'~plugins/autofocus.js',
	],
	head: {
		meta: [{
			charset: 'utf-8',
		}, {
			name: 'viewport',
			content: 'width=device-width,initial-scale=1',
		}],
	},
}
