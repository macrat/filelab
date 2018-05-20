import mime from 'mime';
import webdavClient from 'webdav';


export const state = () => ({
	path: '',
	files: [],
	endpoint: null,
});


export const getters = {
	_client(state) {
		return webdavClient(state.endpoint);
	},
};


export const mutations = {
	'endpoint/set': function(state, endpoint) {
		state.endpoint = endpoint;
	},
	'path/changeDir': function(state, {path, files}) {
		state.path = path;
		state.files = files;
	},
};


export const actions = {
	'path/stat': async function({getters}, path) {
		return await getters._client.stat(path);
	},
	'path/downloadLink': async function({getters}, path) {
		return await getters._client.getFileDownloadLink(path);
	},
	'path/changeDir': async function({getters, commit}, path) {
		const files = (await getters._client.getDirectoryContents(path)).map(x => Object.assign(x, {
			mime: x.type === 'directory' ? 'text/directory' : (x.mime || mime.getType(x.basename) || 'application/octet-stream'),
			downloadLink: x.type === 'directory' ? '' : getters._client.getFileDownloadLink(x.filename),
		})).sort((x, y) => {
			if (x.basename < y.basename) {
				return -1;
			} else if (x.basename > y.basename) {
				return 1;
			} else {
				return 0;
			}
		});
		commit('path/changeDir', {path, files});
	},
	'path/reload': function({dispatch, state}) {
		dispatch('path/changeDir', state.path);
	},
	nuxtServerInit({commit, dispatch}, {env}) {
		commit('endpoint/set', env.webdavEndpoint);
	},
};
