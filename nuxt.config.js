module.exports = {
	env: {
		webdavEndpoint: process.env.WEBDAV_ENDPOINT || 'http://localhost:3001/',
	},
	loading: {
		color: '#fafafa',
	},
	head: {
		meta: [{
			charset: 'utf-8',
		}, {
			name: 'viewport',
			content: 'width=device-width,initial-scale=1',
		}],
	},
	css: [
		'node_modules/material-design-icons/iconfont/material-icons.css',
	],
}
