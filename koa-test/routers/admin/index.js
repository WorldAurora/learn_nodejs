const Router = require('koa-router');
const fs = require('await-fs');
const path = require('path');
const common = require('../../libs/common');

const banner_fields = [
	{title: '标题', name: 'title', type: 'text'},
	{title: '图片', name: 'src', type: 'file'},
	{title: '链接', name: 'href', type: 'text'},
	{title: '序号', name: 'serial', type: 'number'},
];
let router = new Router();

router.get('/login', async ctx => {
	await ctx.render('admin/login', {
		HTTP_ROOT: ctx.config.HTTP_ROOT,
		errmsg: ctx.query.errmsg
	});
});

router.post('/login', async ctx => {
	let {username, password} = ctx.request.fields;
	let admins = JSON.parse((await fs.readFile(
		path.resolve(__dirname, '../../admins.json')
	)));

	let admin = null;
	admins.forEach(item => {
		if(item.username == username) admin = item;
	});

	if(!admin){
		// ctx.body = "no this user";
		ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户不存在')}`);
	}else if(admin.password != common.md5(password)){
		// ctx.body = "password incorrect";
		ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户密码不正确')}`);
	}else{
		//success
		// ctx.body = 'success';
		ctx.session['admin'] = username;
		ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/`);
	}
});

router.all('*', async (ctx, next) => {
	if(ctx.session['admin']){
		await next();
	}else{
		ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/login`);
	}
});

router.get('/', async ctx => {
	ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/banner`);
});

router.get('/banner', async ctx => {
	let datas = await ctx.db.query('select * from banner_table');
	await ctx.render('admin/table', {
		HTTP_ROOT: ctx.config.HTTP_ROOT,
		type: 'view',
		datas,
		action: `${ctx.config.HTTP_ROOT}/admin/banner`,
		banner_fields
	});
});

router.post('/banner', async ctx => {
	let {title, src, href, serial} = ctx.request.fields;
	src = path.basename(src[0].path);

	await ctx.db.query('insert into banner_table (title, src, href, serial) values(?, ?, ?, ?)', [title, src, href, serial]);
	ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/banner`);
});

router.get('/banner/delete/:id', async ctx => {
	let {id} = ctx.params;
	let {UPLOAD_DIR} = ctx.config;

	let datas = await ctx.db.query('select * from banner_table where ID = ?', [id]);

	ctx.assert(datas.length, "no data")
	let row = datas[0];
	await common.unlink(path.resolve(UPLOAD_DIR, row.src));
	await ctx.db.query('delete from banner_table where ID = ?' ,[id]);
	ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/banner`);
});

router.get('/banner/modify/:id', async ctx => {
	let {id} = ctx.params;

	let datas = await ctx.db.query('select * from banner_table where ID = ?', [id]);
	ctx.assert(datas.length, "no data")
	let row = datas[0];

	await ctx.render('admin/table', {
		HTTP_ROOT: ctx.config.HTTP_ROOT,
		type: 'modify',
		action: `${ctx.config.HTTP_ROOT}/admin/banner/modify/${id}`,
		datas,
		old_data: row,
		banner_fields
	});
});

router.post('/banner/modify/:id', async ctx => {
	let {id} = ctx.params;
	let {UPLOAD_DIR} = ctx.config;
	const post = ctx.request.fields
	let keys =  ['title', 'href', 'serial'];
	let vals = [];

	let rows = await ctx.db.query('select src from banner_table where ID = ?', id);
	ctx.assert(rows.length, 400, 'not src');
	const old_src = rows[0].src;

	keys.forEach(key => {
		vals.push(post[key]);
	});

	let src_changed = false;
	if(post.src && post.src.length && post.src[0].size){
		src_changed = true;
		keys.push('src');
		vals.push(path.basename(post.src[0].path));
	}
	
	await ctx.db.query(`update banner_table set ${
		keys.map(key=>(`${key}=?`)).join(',')
	} where ID = ?`, [...vals, id]);

	if(src_changed){
		await common.unlink(path.resolve(UPLOAD_DIR, old_src));
	}
	ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/banner`);
});

module.exports = router.routes();
