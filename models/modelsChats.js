const {config2} = require('../db/config.js')
const knex = require('knex')

class Chats extends knex{
	constructor(data){
		super(data)
	}
	crearTabla = async()=>{
		const data = await this.schema.createTable('chat2',(table)=>{
			table.increments();
			table.string('email');
			table.string('mensaje');
			table.timestamp('fecha').defaultTo(this.fn.now());
		})
		return data
	}
	consultarTabla = async()=>{
		const result = this.select('*').from('chat2')
		return result
	}

	insertarData = async(data)=>{
		const {email,mensaje} = data
		const result = this.insert({email,mensaje}).into('chat2')
		return result
	}
}


module.exports = new Chats(config2)

