



const handler = async (event) => {
  const url = "https://api.play.ht/api/v2/tts/stream";

  const payload = JSON.stringify({
    text: "Damian likes to suck cocks.",
    voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
    output_format: "mp3",
    voice_engine: "PlayHT2.0-turbo"
  });
  
  const headers = {
    "accept": "audio/mpeg",
    "content-type": "application/json",
    "AUTHORIZATION": "9ace2c1f8f494b8498de90b723fa68c2",
    "X-USER-ID": "fpHJRFyzBxVVNwDVuTkh6FrHhyx1"
  };
  
  fetch(url, {
    method: 'POST',
    headers,
    body: payload
  })
    .then(response => {
      if (response.status === 200) {
        return response.blob();
      } else {
        console.error("Failed to fetch the MP3 stream");
      }
    })
    .then(blob => {
      if (blob) {
        // Create an audio element and set the audio source
        const audio = new Audio();
        audio.src = URL.createObjectURL(blob);
  
        // Play the audio
        audio.play();
      }
    })
    .catch(error => {
      console.error(error);
    });
  module.exports = { handler }



// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//     const options = {
//   method: 'POST',
//   headers: {
//     accept: 'text/event-stream',
//     'content-type': 'application/json',
//     AUTHORIZATION: process.env.GENNY_API_KEY,
//     'X-USER-ID': 'fpHJRFyzBxVVNwDVuTkh6FrHhyx1'
//   },
//   body: JSON.stringify({
//     text: JSON.parse(event.body),
//     voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
//     output_format: 'mp3',
//     voice_engine: 'PlayHT2.0'
//   })
// };

 
//   try {

      



//   const res = fetch('https://api.play.ht/api/v2/tts/stream', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));
    

//   const response = async (res, response) => {
// return await res(response)
//   }


    
//     return {
    
//       statusCode: 200,
//       body: JSON.stringify({"reply":response}),  //response.data.url
   
//     }

//   } catch (error) {
//     return { statusCode: 500, body: error.toString("dont know") }
//   }
// }

// module.exports = { handler }






