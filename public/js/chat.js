const $messageform=document.querySelector('#message-form')
const $messageformInput=document.querySelector('input')
const $messageformButton=document.querySelector('#button')
const $locationbutton=document.querySelector('#send-location')
const $locationtemplate=document.querySelector('#location-message-template').innerHTML
const $messages=document.querySelector('#messages')

//templates
const $message_template=document.querySelector('#message-template').innerHTML//template
const $sidebar_template=document.querySelector('#sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
console.log(username)


//for auto scorling
const autoscroll=()=>{
    //height of the new message
    const $newmessage=$messages.lastElementChild
    const newMessageStyle=getComputedStyle($newmessage)
    const newMessagemargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newmessage.offsetHeight + newMessagemargin

    //visible height
    const visibleHeight=$messages.offsetHeight
    //Height of message Container
    const containerHeight=$messages.scrollHeight
    //howw far I have scrolled
    const scrollOffset=$messages.scrollTop + visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }


}


//for messages rendering
const socket=io()
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render($message_template,{
        username1:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


//for location rendering

socket.on('locationMessage',(url)=>{
console.log(url)
const html=Mustache.render($locationtemplate,{
    url:url.url,
    username:url.username,
    createdAt:moment(url.createdAt).format('h:mm:a')
})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})


socket.on('room-data',({room,users})=>{
    console.log(room,users)
    const html=Mustache.render($sidebar_template,{
        room:room.toUpperCase(),
       users
    })
    document.querySelector('#sidebar_content').innerHTML=html
})



$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
//disable form so that a person can't send any message till the previous message sent to the server for this code will be
$messageformButton.setAttribute('disabled','disabled')


    const message= e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //Here we are enabling the user to send the data

        $messageformButton.removeAttribute('disabled')
        $messageformInput.value=''
        $messageformInput.focus()
        if(error){
           return  console.log(error)
        }
        console.log('Delivered')//whichever emits the callback function will send the callback function and those who recieve will run
    })
})





$locationbutton.addEventListener('click',()=>{
   //disable
   $locationbutton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
       return alert('Geoloaction is not valid for your syste')
   } 
   navigator.geolocation.getCurrentPosition((position)=>{
    $locationbutton.removeAttribute('disabled')
    socket.emit('sendlocation',{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{
        console.log('Location shared')
    })
   })

})


socket.emit('Join',{username,room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}
})