const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const base64 = require('base-64');
const {Nuxt, Builder} = require('nuxt');

const BASE_DIR = process.env.BASE_DIR || './';


app.set('port', 3000);


function readStat(fpath) {
	return new Promise((resolve, reject) => {
		fs.stat(path.join(BASE_DIR, fpath), (err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					type: stats.isDirectory() ? 'text/directory' : mime.getType(fpath) || 'application/octet-stream',
					path: path.join('/', fpath),
					endpoint: 'http://localhost:3000/api/' + fpath,
					size: stats.size,
					mtime: stats.mtimeMs,
					ctime: stats.ctimeMs,
				});
			}
		});
	});
}


function readDir(fpath) {
	return new Promise((resolve, reject) => {
		fs.readdir(path.join(BASE_DIR, fpath), (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	})
	.then(files => Promise.all(files.map(x => readStat(path.join(fpath, x)))))
	.then(files => ({contents: files}))
}


function setMetadataHeader(res, stat) {
	res.setHeader('X-FileLab-Metadata', base64.encode(JSON.stringify(stat)));
}


app.get('/api/*', (req, res) => {
	readStat(path.join(BASE_DIR, req.params[0])).then(stat => {
		setMetadataHeader(res, stat);

		if (stat.type === 'text/directory') {
			return readDir(req.params[0]).then(dir => {
				res.json(Object.assign(stat, dir));
			});
		} else {
			res.sendFile(req.params[0], {root: BASE_DIR, dotfiles: 'allow'});
		}
	}).catch(err => res.status(500).json(err))
});
app.get('/api', (req, res) => res.redirect('/api/'));


const nuxt = new Nuxt();
if (nuxt.options.dev) {
	new Builder(nuxt).build();
}
app.use(nuxt.render);


const server = app.listen(3000, '0.0.0.0', function() {
	console.log(`listening on ${server.address().address}:${server.address().port}`);
});
