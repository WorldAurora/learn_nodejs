const path = require('path');

module.exports={
	//database
	DB_HOST: '106.54.236.7',
	DB_PORT: 3306,
	DB_USER: 'php',
	DB_PASS: 'Config1014',
	DB_NAME: 'thinkphp_card',

	//http
	HTTP_PORT: 8080,
	HTTP_ROOT: path.resolve(__dirname, "../static/"),
	HTTP_UPLOAD: path.resolve(__dirname, "../static/upload"),
};
