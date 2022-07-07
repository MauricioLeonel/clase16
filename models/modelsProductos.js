const {config} = require('../db/config.js')
const knex = require('knex')

class Productos extends knex{
	constructor(data){
		super(data)
	}
	crearTablaProductos = async()=>{
		const result = await this.schema.createTable('producto',(table)=>{
			table.increments();
			table.string('title');
			table.string('thumbnail');
			table.float('price')
		})
	}

	consultarTablaProductos = async()=>{
		const result = await this.select('*').from('producto')
		return result
	}

	insertarDataProductos = async(data)=>{
		const result = await this.insert(data).into('producto')
		return result
	}	
}


module.exports = new Productos(config)