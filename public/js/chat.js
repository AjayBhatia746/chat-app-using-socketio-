const $messageform=document.querySelector('#message-form')
const $messageformInput=document.querySelector('input')
const $messageformButton=document.querySelector('#button')
const $locationbutton=document.querySelector('#location')
const socket=io()
socket.on('message',(message)=>{
    console.log(message)
})

$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
//disable form so that a person can't send any message till the previous message sent to the server for this code will be
$messageformButton.setAttribute('disabled','disabled')


    const message= e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //Here we are enabling the user to send the data
        $messageformButton.removeAttribute('disabled')
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