const db = require('./libs/database');
const http = require('./libs/http');
const {addRouter} = require('./libs/router');

addRouter('get', '/list', async (res, get, post, files) => {
	try{
		let data = await db.query('select * from think_user');
		res.writeJson({error: 0, data});
	}catch(e){
		res.writeJson({error: 1, msg: "database error"});
	}
	res.end();
});

