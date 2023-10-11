import WebSocket from 'ws'

const voiceId = '21m00Tcm4TlvDq8ikWAM'; // replace with your voice_id
const model = 'eleven_monolingual_v1';
const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
const socket = new WebSocket(wsUrl);

function eleven(message){
  // 2. Initialize the connection by sending the BOS message
  socket.onopen = function (event) {
    const bosMessage = {
        "text": " ",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": true
        },
        "xi_api_key": process.env.ELEVEN_API_KEY
    };

    socket.send(JSON.stringify(bosMessage));

    // 3. Send the input text message ("Hello World")
    const textMessage = {
        "text": `${message} `,
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
    const response = JSON.parse(event.data);

    console.log("Server response:", response);

    if (response.audio) {
        // decode and handle the audio data (e.g., play it)
        audioChunk = atob(response.audio);  // decode base64
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
};

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
}
}

exports.handler = async function (event, context) {
    try {

        const response = await eleven(event.body)

    
        return {
        
          statusCode: 200,
          body: JSON.stringify({"reply":response.choices[0].message}),
       
        }
    
      } catch (error) {
        return { statusCode: 500, body: error.toString("dont know") }
      }
  };