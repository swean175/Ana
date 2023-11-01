

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
    const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    AUTHORIZATION: process.env.GENNY_API_KEY,
    'X-USER-ID': 'fpHJRFyzBxVVNwDVuTkh6FrHhyx1'
  },
  body: JSON.stringify({
    text: "hello im robot",//JSON.parse(event.body),
    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    output_format: 'mp3',
    voice_engine: 'PlayHT2.0'
  })
};

  try {

  const res = fetch('https://api.play.ht/api/v2/tts/stream', options)
  .then(response => response.json())
  .catch(err => console.error(err))
    
    return {
    
      statusCode: 200,
      body: res//JSON.stringify({"reply":res}),  //response.data.url
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }






