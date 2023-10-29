



// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
const jobId = ""

    function setJob(job){
      jobId = job
    }
  const options = {
  method: 'POST',
  headers: {
    accept: 'text/event-stream',
    'content-type': 'application/json',
    AUTHORIZATION: process.env.GENNY_API_KEY,
    'X-USER-ID': 'fpHJRFyzBxVVNwDVuTkh6FrHhyx1'
  },
  body: JSON.stringify({
    text: JSON.parse(event.body),
    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    output_format: 'mp3',
    voice_engine: 'PlayHT2.0'
  })
};

fetch('https://api.play.ht/api/v2/tts', options)
  .then(response => response.json())
  .then(response => setJob(response))
  .catch(err => console.error(err));


    fetch(`https://api.play.ht/api/v2/tts/${jobId}`, options)
  .then(response => response.json())
  .catch(err => console.error(err))
const response = await jobId
    
    return {
    
      statusCode: 200,
      body: JSON.stringify({"reply":response}),  //response.data.url
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }






