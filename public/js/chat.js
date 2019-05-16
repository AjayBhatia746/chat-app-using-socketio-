const $messageform=document.querySelector('#message-form')
const $messageformInput=document.querySelector('input')
const $messageformButton=document.querySelector('#button')
const $locationbutton=document.querySelector('#send-location')
const $locationtemplate=document.querySelector('#location-message-template').innerHTML
const $messages=document.querySelector('#messages')
const $message_template=document.querySelector('#message-template').innerHTML//template

//for messages rendering

const socket=io()
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render($message_template,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


//for location rendering

socket.on('locationMessage',(url)=>{
console.log(url)
const html=Mustache.render($locationtemplate,{
    url:url.url,
    createdAt:moment(url.createdAt).format('h:mm:a')
})
$messages.insertAdjacentHTML('beforeend',html)
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