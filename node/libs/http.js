const http = require('http');
const url = require('url');
const querystring = require('querystring');
const zlib = require('zlib');
const fs = require('fs');
const router = require('./router');
const {Form} = require('multiparty');
const {HTTP_PORT, HTTP_ROOT, HTTP_UPLOAD} = require('../config');

http.createServer((req, res) => {

	res.writeJson = json => {
		res.setHeader('content-type', 'application/json');
		res.write(JSON.stringify(json));
	}

	async function handle(method, url, get, post, file){
		let fn = router.findRouter(method, url);

		//file
		if(!fn){
			let filepath = HTTP_ROOT + pathname;
			fs.stat(filepath, (err, stat) => {
				if(err){
					res.writeHead(404);
					res.write("Not Found");
					res.end();
				}
				else{
					let rs = fs.createReadStream(filepath);
					let gz = zlib.createGzip();

					rs.on('error', () => {});

					res.setHeader('content-encoding', 'gzip');
					rs.pipe(gz).pipe(res);
				}
			});
		}
		//接口
		else{
			try{
				await fn(res, get, post, file);
			}catch(e){
				res.writeHead(500);
				res.write("Internal Server Error");
				res.end();
			}
		}
	}

	///解析数据
	let {pathname, query} = url.parse(req.url, true);

	if(req.method == 'POST'){
		//普通POST
		if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){
			let arr = [];
			req.on('data', buffer => {
				arr.push(buffer);
			});
			req.on('end', () => {
				let post = querystring.stringify(Buffer.concat(arr).toString());
				handle(req.method, pathname, query, post, {});
			})
		}
		//文件POST
		else{
			let form = new Form({
				uploadDir: HTTP_UPLOAD
			});
			form.parse(req);

			let post = {};
			let file = {};

			form.on('field', (name, value) => {
				post[name] = value;
			});

			form.on('file', (name, file) => {
				file[name] = file;
			});

			form.on('error', (err) => {
				console.log(err)
			});

			form.on('close', () => {
				handle(req.method, pathname, query, post, file);
			});
		}
	}
	//get
	else{
		handle(req.method, pathname, query, {}, {});
	}

}).listen(HTTP_PORT);
console.log(`server started as ${HTTP_PORT}`);
