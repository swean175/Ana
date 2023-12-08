function eleven(Txt){
    iteration = 0
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
    console.log("res items "+res.length)
    let reducedArr = []
    let audioSources = []
   
       
        if (iteration > 1){

            res.forEach((it) => {

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
                            
                               console.log("Audio duration: " + durationInSeconds + " miliseconds ");
                          console.log("time is "+ time)
                        timeReduced = time.reduce((acc, curr) => {
                        return acc + curr
                        }, 0)
                        reducedArr.push(timeReduced+100)
                        
                        if (iteration === reducedArr.length){
                        for (let j = 0; j < iteration; j++){
                            console.log("reducedArr  "+reducedArr[j])
                           
                        setTimeout(() => {
                            audio.src = audioSources[j]
                            audio.play()
                            console.log("fraze "+j )
                        }, reducedArr[j])
                       
                        }
                        }
                        })
       
                    })

        } else {

            let audio = new Audio();
            let audioString = it
                       const audioBlob = mp3_44100toBlob(audioString);
                       const audioUrl = URL.createObjectURL(audioBlob);
                        audio.src = audioUrl  
           console.log("palyed once")
           audio.play()
        }
       

 }





 // function readOutLoud(message){
//     const speech = new SpeechSynthesisUtterance()

//     speech.text = message
//     speech.volume = 1
//     speech.rate = 1
//     speech.pitch = 1
  
  
//     window.speechSynthesis.speak(speech)
// }



var file = res;
var reader = new FileReader();
reader.onload = function (event) {
    // Get the file content as a string
    var mp3Content = event.target.result;

    // Create a Blob from the file content
    var blob = new Blob([mp3Content], { type: 'audio/mpeg' });

    // Create a temporary URL for the Blob
    var blobUrl = URL.createObjectURL(blob);

    // Set the temporary URL as the source for the audio element
    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = blobUrl;

    // Play the audio immediately
    audioPlayer.play();
    reader.readAsText(file);
}