const config = {
	client:'mysql',
	connection:{
		host:'127.0.0.1',
		port:3306,
		user:'root',
		password:'root',
		database:'chat'
	}
}
const config2 = {
	client:'sqlite3',
	connection:{
		filename:"./db/mydb.db"
	}
}
module.exports = {config,config2}