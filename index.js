import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'




const userInput = document.getElementById('user-input')
const talkBtn = document.getElementById('talk')
const content = document.getElementById('content')
//--------------------Speech
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new speechRec()
recognition.lang = 'pl'


let Sophia  = new Audio("https://voiceverse-prod.s3.us-west-2.amazonaws.com/team/6511deba448ce2002390279b/jobs/652717d6e43e81002487fb0c/wkmFkLI0Mg.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA26OUSLIS7YRKCXJL%2F20231011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231011T214711Z&X-Amz-Expires=86400&X-Amz-Signature=d1b5d4df63ed12f391f6d6197bd7d5ae0247908ecdd8eafd14d6308170088b52&X-Amz-SignedHeaders=host&x-id=GetObject")


//---------------------------------Database

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




        //---------------------------------------Fetch

        
async function fetchOpenAi(message){
   const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchOpenAi'
   const response = await fetch(serUrl, {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body:JSON.stringify(message)
  })

const data = await response.json()
  console.log(data)
  return data
    
}



async function fetchEleven(message){
    const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchEleven'
    const response = await fetch(serUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(message)
          })
        
        const data = await response.json()
          console.log(data)
          return data
            
        }


 //--------------------------- Event

document.addEventListener('submit', (e) => {
    e.preventDefault()
  
    push(conversationInDb, {
        role: 'user',
        content: userInput.value
    })
    fetchReply()
   
    showInput()
})


//----------------------------------Show Input-------------------------------

function showInput(){
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }

async function fetchReply() {

    get(conversationInDb).then(async (snapshot) => {
        if (snapshot.exists()) {
            const conversationArr = Object.values(snapshot.val())
             conversationArr.unshift(instructionObj)
        console.log(conversationArr)
          const response =  await fetchOpenAi(conversationArr)
       
console.log("fetch-reply --" + response.reply)
            push(conversationInDb, response.reply)
            renderTypewriterText(response.reply.content)
            Sophia.play()
           fetchEleven("hi")
            
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

   push(conversationInDb, {
    role: 'user',
    content: userInput.value
})
showInput()
fetchReply()
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