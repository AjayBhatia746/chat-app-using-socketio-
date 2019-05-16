const path=require('path')
const {generateTimestamp,generatelocation}=require('../src/utilis/messages')
const express=require('express')
const http=require('http')//http is a core module and we do n't need to install it
const app=express()
const Filter=require('bad-words')
const socketio=require('socket.io')//it is used for duplex connection that server can send the response to client withou any request too.
const server=http.createServer(app)//here it will create the server if we do n't write this thing than also express does it for use
//but as the socketio librabary return a function and we need to pass a server thus wwe refactor it
const io=socketio(server)
const port=3000 || process.env.PORT
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
 
io.on('connection',(socket)=>{//socket is an object that contain information about new connection 
    console.log('This is from socket.io')
    //anything that I will provide after the countupdate will be use as callback we need a functon to catch it on index.js
    
    //io makes to emit the count to every single object connected socket.emit emit to a single connection only 
   
   socket.emit('message',generateTimestamp('Welcome'))
   socket.broadcast.emit('message',generateTimestamp('A new user have entered'))// It is too show the message to everyone that a new user is added
   socket.on('sendMessage',(message,callback)=>{
    const filter=new Filter()
    if(filter.isProfane(message)){
       return callback('Profinity is not allowed')
    }    
    io.emit('message',generateTimestamp(message))
        callback()
   })
   socket.on('sendlocation',(coords,callback)=>{
        io.emit('locationMessage',generatelocation('https://www.google.com/maps/?q='+coords.latitude+','+coords.longitude ))
        callback()
   })
   socket.on('disconnect',()=>{
       io.emit('message',generateTimestamp('A user have left'))
   })
})


server.listen(port,()=>{
    console.log('Server is at 3000')
})