import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'




const userInput = document.getElementById('user-input')
const talkBtn = document.getElementById('talk')
const content = document.getElementById('content')
//--------------------Speech
const speechRec = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new speechRec()
recognition.lang = "en-GB"
const languageBtn = document.getElementById('language-btn')
const langBtnText = document.getElementById('lang-btn')
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



// async function fetchEleven(message){
//     const serUrl = 'https://resilient-ganache-139b9c.netlify.app/.netlify/functions/fetchEleven'
//     const response = await fetch(serUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body:JSON.stringify(message)
//           })
        
//         const data = await response.json()
//           console.log(data)
//           return data
            
//         }


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
           
           eleven(response.reply.content)
            
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



function eleven(Txt){
    iteration = -1
    time = [0]
    const resArr = []


    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // replace with your voice_id
    const model = 'eleven_monolingual_v1';
    const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
    const socket = new WebSocket(wsUrl);
    


        // 2. Initialize the connection by sending the BOS message
        socket.onopen = function (event) {
          const bosMessage = {
              "text": " ",
              "voice_settings": {
                  "stability": 0.1,
                  "similarity_boost": true
              },
              "xi_api_key": '04a2a640ad70a0dee3a3f8888a1ab5b5'
          };
      
          socket.send(JSON.stringify(bosMessage));
      
          // 3. Send the input text message ("Hello World")
          const textMessage = {
              "text": `${Txt} `,
              "try_trigger_generation": true,
          };
      
          socket.send(JSON.stringify(textMessage));
      
          // 4. Send the EOS message with an empty string
          const eosMessage = {
              "text": ""
          };
      
          socket.send(JSON.stringify(eosMessage));
      };
      
      // 5. Handle server responses
      socket.onmessage = function (event) {
          const response = JSON.parse(event.data)
     console.log("server response")
          
          if (response.audio) {
              // decode and handle the audio data (e.g., play it)
             const audioChunk = atob(response.audio);  // decode base64
resArr.push(response.audio)
iteration ++
              return console.log("worked")
              
          } else {
                  // setTimeOut(() => toSay(resArr), 2000)
              console.log("No audio data in the response");
          }
      
          if (response.isFinal) {
              // the generation is complete
          
            console.log("Final: ")
          }
      
          if (response.normalizedAlignment) {
              // use the alignment info if needed
                   console.log("final normalized")
          }
      };
      
      // Handle errors
      socket.onerror = function (error) {
          console.error(`WebSocket Error: ${error}`);
      };
      
      // Handle socket closing
      socket.onclose = function (event) {
          if (event.wasClean) {
              console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
              
                      
               toSay(resArr)
                    
            
           
          } else {
              console.warn('Connection died');
          }
      }
}


function toSay(res){
    console.log("shit")
    let reducedArr = []
    let audioSources = []
    res.forEach((it) => {
       
        if (iteration > 0){

            let audio = new Audio();
            let audioString = it
            // iteration > 0 ? audioString = connected : audioString = res[0]
                       const audioBlob = mp3_44100toBlob(audioString);
                       const audioUrl = URL.createObjectURL(audioBlob);
                        audio.src = audioUrl  
                        audioSources.push(audio.src)
                        audio.addEventListener('loadedmetadata', function() {
                            const convToSec = audio.duration.toFixed(1)
                            const durationInSeconds = convToSec * 1000
                           time.push(durationInSeconds)
                            
                               console.log("Audio duration: " + durationInSeconds + " seconds ");
                          console.log("time is "+ time)
                        timeReduced = time.reduce((acc, curr) => {
                        return acc + curr
                        }, 0)
                        reducedArr.push(timeReduced)
                        
                        if (iteration === reducedArr.length){
                        for (let j = 0; j < iteration; j++){
                            console.log("reducedArr  "+reducedArr[j])
                           
                        setTimeout(() => {
                            audio.src = audioSources[j]
                            audio.play()
                            console.log("done")
                        }, reducedArr[j])
                       
                        }
                        }
                        })
       
           
           console.log("timeReduced "+ timeReduced)

        } else {

            let audio = new Audio();
            let audioString = it
                       const audioBlob = mp3_44100toBlob(audioString);
                       const audioUrl = URL.createObjectURL(audioBlob);
                        audio.src = audioUrl  
           console.log("palyed once")
           audio.play()
        }
       
})
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

             languageBtn.addEventListener("click", ()=>{
                languageBtnClicked = !languageBtnClicked
               if (languageBtnClicked){
                recognition.lang = "pl-PL"
                languageBtn.className = "set-language-btn pl"
                langBtnText.innerText = "Pl"
               } else {
                recognition.lang = "en-GB"
                languageBtn.className = "set-language-btn en"
                langBtnText.innerText = "En"
               }
             })

renderConversationFromDb()
