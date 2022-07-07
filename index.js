//express
const express = require('express')
const app = express()
//rutas
const productos = require('./router/productos.js')
const index = require('./router/index.js')
//db
const db = require('./models/misproductos.js')
//para poder joinear la ruta ja
const path = require('path')
//importo los motores
const { engine } = require('express-handlebars')
const pug = require('pug');
const ejs = require('ejs');
//importo http para tener la instancia completa del server
const server = require('http').createServer(app)
//importo socket
const io = require('socket.io')(server)
//traigo las tablas
const chatsModels = require('./models/modelsChats.js')
const productosModels = require('./models/modelsProductos.js')

/*seteo los motores*/
app.engine('handlebars',engine());
app.set('view engine', 'handlebars');
app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))


//direcctorio de las vistas
app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
//uso la INSTANCIA DEL DB y lo paso en el middleware
app.use(function(req,res,next){
	req.db = db
	next()
})

//index para la carga de datos
app.use('/',index)
//plantillas
app.use('/api',productos)


//instancion socket ahora con base de datos
io.on('connection',async function(cliente){
	//agrego data a los productos
	cliente.on('envio',async data=>{
		const {title,price,thumbnail} = data
		const oki = await productosModels.insertarDataProductos({title,price,thumbnail})
		const elementos = await productosModels.consultarTablaProductos()
		io.sockets.emit('agrego',{dir:'/layouts/main.handlebars',elementos:elementos})
	})

	//solo recargo data de productos
	const elementos = await productosModels.consultarTablaProductos()
	cliente.emit('agrego',{dir:'/layouts/main.handlebars',elementos:elementos})

	//envio data chat
	cliente.on('mensajeChat',async (data)=>{
		const res = await chatsModels.insertarData(data)
		const result1 = await chatsModels.consultarTabla()
		io.sockets.emit('mensajesChat',result1)
	})

	//solo recargo data chat
	const result = await chatsModels.consultarTabla()
	cliente.emit('mensajesChat',result)
})


server.listen('8080',async ()=>{
	console.log('todo perfecto')
	//si no tengo data entra al chat a crear la tabla chats
	try{
		let data = await chatsModels.consultarTabla()
	}catch(e){
		await chatsModels.crearTabla()
	}
	//si no tengo data entra al chat a crear la tabla productp
	try{
		let data2 = await productosModels.consultarTablaProductos()
	}catch(e){
		await productosModels.crearTablaProductos()
	}
})