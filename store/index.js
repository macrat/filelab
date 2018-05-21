import mime from 'mime';
import path from 'path';
import webdavClient from 'webdav';


export const state = () => ({
	path: '',
	files: [],
	dragging: null,
	endpoint: null,
});


export const getters = {
	client(state) {
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
	'dragging/set': function(state, file) {
		state.dragging = file;
	},
	'dragging/unset': function(state) {
		state.dragging = null;
	},
};


export const actions = {
	'path/stat': async function({getters}, path) {
		return await getters.client.stat(path);
	},
	'path/downloadLink': async function({getters}, path) {
		return await getters.client.getFileDownloadLink(path);
	},
	'path/changeDir': async function({getters, commit}, path) {
		const files = (await getters.client.getDirectoryContents(path)).map(x => Object.assign(x, {
			mime: x.type === 'directory' ? 'text/directory' : (x.mime || mime.getType(x.basename) || 'application/octet-stream'),
			downloadLink: x.type === 'directory' ? '' : getters.client.getFileDownloadLink(x.filename),
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
	'file/upload': async function({state, getters, dispatch}, {file, data, target}) {
		await getters.client.putFileContents(
			path.join(target ? target.filename : state.path, file.name),
			data,
			{format: 'binary'},
		);

		await dispatch('path/reload');
	},
	'file/move': async function({getters, dispatch}, {file, target}) {
		await getters.client.moveFile(file.filename, path.join(target.filename, file.basename))

		await dispatch('path/reload');
	},
	nuxtServerInit({commit, dispatch}, {env}) {
		commit('endpoint/set', env.webdavEndpoint);
	},
};
