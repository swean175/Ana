//------------------------Eleven----------
async function elevenSpeak(message){
    let outcome
      let audioDataArray = []
    const AudioContext = window.AudioContext || window.webkitAudioContext //-----------------------------------Window to fix
    const audioContext = new AudioContext();
    let nextTime = 0; // This variable will keep track of the time the next chunk should start
    
      const voiceId = "XrExE9yKIg1WjnnlVkGX"; // replace with your voice_id
          const model = 'eleven_monolingual_v1';
          const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}&optimize_streaming_latency=4&output_format=mp3_44100`;
          const socket = new WebSocket(wsUrl);
         
      // 2. Initialize the connection by sending the BOS message
      socket.onopen = function (event) {
    
          const bosMessage = {
              "text": " ",
              "voice_settings": {
                  "stability": 0.5,
                  "similarity_boost": true
              },
              "xi_api_key": process.env.ELEVEN_API_KEY, 
          };
      
          socket.send(JSON.stringify(bosMessage));
      
          // 3. Send the input text message ("Hello World")
          
         const textMessage = {
              "text": ` ${message},,,,, `,
              "try_trigger_generation": true,
          };
         socket.send(JSON.stringify(textMessage)) ;
    
          // 4. Send the EOS message with an empty string
          const eosMessage = {
              "text": ""
          };
      
          socket.send(JSON.stringify(eosMessage));
      };
      
      // 5. Handle server responses
      socket.onmessage = async function (event) {
          const response = await JSON.parse(event.data);
    
          console.log("Server response:", response);
      
          if (response.audio) {
              // decode and handle the audio data (e.g., play it)
        // convert base64 to Uint8Array
      
        const data = Uint8Array.from(atob(response.audio), c => c.charCodeAt(0));
                
    
          // decode the audio data asynchronously 
          const buffer = await audioContext.decodeAudioData(data.buffer).then(decodedAudio => { audioDataArray.push(decodedAudio)});
    
          
    let source
          audioDataArray.forEach( decodedAudio => { 
               source = audioContext.createBufferSource() 
              source.buffer = decodedAudio
               source.connect(audioContext.destination)
              
              })
       
          // Start the source to play the audio
          if (nextTime == 0) {
              nextTime = audioContext.currentTime;
              }
              for(let i = 0; i < audioDataArray.length; i++)
             { 
             // source.start(nextTime)
             outcome = source
              nextTime += source.buffer.duration
          }
          
     
    //----------------------------------------------------------------------------
        
              console.log("Received audio chunk");
          } else {
              console.log("No audio data in the response");
          }
      
          if (response.isFinal) {
              // the generation is complete
             
          }
    
          if (response.normalizedAlignment) {
              // use the alignment info if needed
      
          }
    
      // Handle errors
      socket.onerror = function (error) {
          console.error(`WebSocket Error: ${error}`);
      };
      
      // Handle socket closing
      socket.onclose = function (event) {
          if (event.wasClean) {
              console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
          } else {
              console.warn('Connection died');
          }
      };
    
      }
      return outcome
    
    }
    
    
    const handler = async (event) => {
      try {
        const response = await elevenSpeak({ 
          message: event.body,
      })
        
        return {
          statusCode: 200,
          body: JSON.stringify({  reply:response }),
          // // more keys you can return:
          // headers: { "headerName": "headerValue", ... },
          // isBase64Encoded: true,
        }
      } catch (error) {
        return { statusCode: 500, body: error.toString() }
      }
    }
    
    module.exports = { handler }