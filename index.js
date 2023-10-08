import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'



const userInput = document.getElementById('user-input')
const talkBtn = document.getElementById('talk')
const content = document.getElementById('content')
//--------------------Speech
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new speechRec()
recognition.lang = 'pl'
const hi =" say hi"


// This error typically occurs when the response from the fetch request is not valid JSON. To troubleshoot this issue, you can follow these steps:

// 1. Check the response format: Make sure that the response from the server is valid JSON. You can verify this by printing the response data to the console before parsing it as JSON.

// 2. Check the response headers: Ensure that the server is setting the "Content-Type" header to "application/json" for JSON responses. If the header is not set correctly, the browser may not parse the response as JSON.

// 3. Check for syntax errors: If the response is a string, manually inspect it for any syntax errors. JSON data should be enclosed in curly braces `{}` or square brackets `[]` and should not have any trailing commas.

// 4. Handle server errors: If the response is an error message or HTML, it may indicate a server-side error. In this case, you may need to handle the error condition in your code.

// If none of these steps resolve the issue, please provide more details about your code and the response you are receiving, and I'll be happy to help further.


// const getApis = async (promt-message) => {await(await fetch('https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchApi')).json()
//    .then((data) => data.response)}



async function fetchOpenAi(message){
   const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchOpenAi'
   const response = await fetch(serUrl, {
method: 'POST',
headers: {
    'content-type': 'text/plain',
},
body:message
  })


  console.log(response)
  return response
    
}



async function fetchEleven(){
    const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchEleven'
    const response = await fetch(serUrl, {
 method: 'POST',
 headers: {
     'content-type': 'text/plain',
 },
 body: "hi"
   })
 const data = await response.json()
 console.log(data)
 return data.response
     
 }



const appSettings = {
    databaseURL: 'https://aiassistent-10cdd-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)

const database = getDatabase(app)

const conversationInDb = ref(database)

const chatbotConversation = document.getElementById('chatbot-conversation')

const instructionObj = {
    role: 'system',
    content: 'You are a helpful, flirty, funny, teasy assistant, your name is Ana my name is Damian and i am amzing'  
}

document.addEventListener('submit', (e) => {
    e.preventDefault()
  
    push(conversationInDb, {
        role: 'user',
        content: userInput.value
    })
    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})





async function fetchReply() {

    get(conversationInDb).then(async (snapshot) => {
        if (snapshot.exists()) {
            const conversationArr = Object.values(snapshot.val())
            conversationArr.unshift(instructionObj)
           // const response = await openai.createChatCompletion({ //-------------------competion
           //     model: 'gpt-3.5-turbo',
           //     messages: conversationArr,
           //     presence_penalty: 0,
           //     frequency_penalty: 0.3
          //  })
          const outcome =  fetchOpenAi(conversationArr)
         const response = await outcome
console.log("fetch-reply --" + response.data.choices[0].message)
            // push(conversationInDb, response.data.choices[0].message)
            // renderTypewriterText(response.data.choices[0].message.content)
        //    getEleven(response.data.choices[0].message.content+".....")
            
        }
        else {
           alert('No data available')
        }

    })
}



function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i - 1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}

document.getElementById('clear-btn').addEventListener('click', () => {
    remove(conversationInDb)
    chatbotConversation.innerHTML = '<div class="speech speech-ai">How can I help you?</div>'
})

function renderConversationFromDb(){
    get(conversationInDb).then(async (snapshot)=>{
        if(snapshot.exists()) {
            Object.values(snapshot.val()).forEach(dbObj => {
                const newSpeechBubble = document.createElement('div')
                newSpeechBubble.classList.add(
                    'speech',
                    `speech-${dbObj.role === 'user' ? 'human' : 'ai'}`
                    )
                chatbotConversation.appendChild(newSpeechBubble)
                newSpeechBubble.textContent = dbObj.content
            })
            chatbotConversation.scrollTop = chatbotConversation.scrollHeight
        }
    })
}


//---------------rest of speech------------------


recognition.onstart = function(){

}

recognition.onresult = function(event){
    const current = event.resultIndex
    const transcript = event.results[current][0].transcript
   content.textContent += transcript
   userInput.value = transcript

}

talkBtn.addEventListener('click', () => {
    recognition.start()
})

// function readOutLoud(message){
//     const speech = new SpeechSynthesisUtterance()

//     speech.text = message
//     speech.volume = 1
//     speech.rate = 1
//     speech.pitch = 1
  
  
//     window.speechSynthesis.speak(speech)
// }
renderConversationFromDb()