const users=[]
const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username||!room){
    return {
        error:'User and Room name required'
    }}
    //to check that whther the user of that name exist in that room
    const finduser=users.find((user)=>{
        return user.username===username && user.room===room
    })
   
    if(finduser){
    return {
        error:'User of this name already exists'
    }
}
//store user in user array

const user={id,username,room}
users.push(user)
return {user}
}
 


//Remove user from the users array
 const removeUser=(id)=>{
     const index=users.findIndex((user)=>{
         return user.id===id
     })
     if(index!==-1){
         return users.splice(index,1)[0]
        }
 }



//getting the user from users array

 const getUser=(id)=>{
    return users.find((user)=>user.id===id)
 }

//getusers of a room

const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    
    return users.filter((user)=>user.room===room)
} 

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom


}