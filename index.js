import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'




const userInput = document.getElementById('user-input')
const talkBtn = document.getElementById('talk')
const content = document.getElementById('content')
const languageBtn = document.getElementById('language-btn')
const lang = document.getElementById('lang')
lang.className="en"
lang.textContent="En"
//--------------------Speech
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new speechRec()
recognition.lang = "en-GB"
let languageBtnClicked = false
let iteration = 0
let timeReduced = 100
let time = [0]




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


function say(res){
    let audio = new Audio(res)
   audio.play()
    console.log(res)
       console.log("palyed once")
//---------------------------------
    // var a = new Audio(res);
    // a.play();
//---------------------------------

// function convertAudio(str) {
  
//     const file = str
//     const reader = new FileReader();

//     reader.onloadend = function() {
//         const buffer = reader.result
//         const audioData = bufferToBase64(buffer);
//       playAudio(audioData);
     
//     }
//     console.log("poszlo")
   
//   }

//   function playAudio(audioData) {
//     const audio = new Audio();
//     audio.src = "data:audio/mp3;base64," + audioData;
//     audio.play()
// }
// convertAudio(res)

}


function mp3_44100toBlob(mp3_44100) {
    const byteCharacters = atob(mp3_44100);
    const byteNumbers = new Array(byteCharacters.length);
 
    for (let i = 0; i < byteCharacters.length; i++) {
       byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
 
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'audio/mp3' });
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
  return data
    
}



async function fetchGenny(message){
    // const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchGenny'
    // const response = await fetch(serUrl, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body:JSON.stringify(message)
    //       })
        
    //     const data = await response.json()
    //       console.log(data.reply)
    //       return data.reply
//-------------------------------------------
 
  
      fetch(`https://06rdqx.buildship.run/voice?text=${message}`) 
        .then(response => response.json())
        .then(response => console.log(response))
        .then(response => say(response))
        .catch(err => console.error(err));
       //-------------------------------------------------------------
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
       
          const response =  await fetchOpenAi(conversationArr)
       

            push(conversationInDb, response.reply)
            renderTypewriterText(response.reply.content)
           
          fetchGenny(response.reply.content)
            
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


//----------------------------------------------------------------------------
             languageBtn.addEventListener("click", ()=>{
                languageBtnClicked = !languageBtnClicked
               if (languageBtnClicked){
                recognition.lang = "pl-PL"
                lang.className="pl"
                lang.textContent="Pl"
               } else {
                recognition.lang = "en-GB"
                lang.className="en"
                lang.textContent="En"
               }
             })

renderConversationFromDb()
