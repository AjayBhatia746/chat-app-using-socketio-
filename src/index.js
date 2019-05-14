const path=require('path')
const express=require('express')
const http=require('http')//http is a core module and we do n't need to install it
const app=express()
const socketio=require('socket.io')//it is used for duplex connection that server can send the response to client withou any request too.
const server=http.createServer(app)//here it will create the server if we do n't write this thing than also express does it for use
//but as the socketio librabary return a function and we need to pass a server thus wwe refactor it
const io=socketio(server)
const port=3000 || process.env.PORT
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection',()=>{
    console.log('This if from socketio')
})


server.listen(port,()=>{
    console.log('Server is at 3000')
})