const path=require('path')
const {addUser,removeUser,getUser,getUserInRoom}=require('./utilis/users')
const {generateTimestamp,generatelocation}=require('../src/utilis/messages')
const express=require('express')
const http=require('http')//http is a core module and we do n't need to install it
const port=process.env.PORT || 3000
const app=express()
const Filter=require('bad-words')
const socketio=require('socket.io')//it is used for duplex connection that server can send the response to client withou any request too.
const server=http.createServer(app)//here it will create the server if we do n't write this thing than also express does it for use
//but as the socketio librabary return a function and we need to pass a server thus wwe refactor it
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
 
io.on('connection',(socket)=>{//socket is an object that contain information about new connection 
    console.log('This is from socket.io')
    //anything that I will provide after the countupdate will be use as callback we need a functon to catch it on index.js
    
    //io makes to emit the count to every single object connected socket.emit emit to a single connection only 
  
   /*
   socket.emit=it is for a particular user
   io.emit=it is for all the user in the group
   socket.broadcast.emit=for all users accept the person that is broadcasting
   io.to(room name).emit=for all the clients of a particular room
   socket.broadcast.to(room name) =for for all users accept the person that is broadcasting in a group
   */
   socket.on('Join',({username,room},callback)=>{
       const {user,error}=addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
       socket.join(user.room)
     

   socket.emit('message',generateTimestamp('Admin','Welcome'))
   socket.broadcast.to(user.room).emit('message',generateTimestamp('Admin',`${user.username} has entered`))// It is too show the message to everyone that a new user is added
    io.to(user.room).emit('room-data',{
        room:user.room,
        users:getUserInRoom(user.room)
    })     
   callback()
})
   
   
   socket.on('sendMessage',(message,callback)=>{
       const user=getUser(socket.id)
    const filter=new Filter()
    if(filter.isProfane(message)){
       return callback('Profinity is not allowed')
    }    
    io.to(user.room).emit('message',generateTimestamp(user.username,message))
        callback()
   })


   socket.on('sendlocation',(coords,callback)=>{
    const user=getUser(socket.id)

        io.to(user.room).emit('locationMessage',generatelocation(user.username,'https://www.google.com/maps/?q='+coords.latitude+','+coords.longitude ))
        callback()
   })
   socket.on('disconnect',()=>{
       const user=removeUser(socket.id)
       if(user){
        io.emit('message',generateTimestamp(`${user.username} have left`))
        io.to(user.room).emit('room-data',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
       }
       
   })
})


server.listen(port,()=>{
    console.log(`Server is at ${port}`)
})