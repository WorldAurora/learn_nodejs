const path = require('path');

module.exports = {
	DB_HOST: 'localhost',
	DB_USER: 'root',
	DB_PASS: 'Config1014',
	DB_NAME: 'nodejs',

	HTTP_ROOT: 'http://localhost:8080',
	HTTP_PORT: 8080,
	UPLOAD_DIR: path.resolve(__dirname, './static/upload'),
}
