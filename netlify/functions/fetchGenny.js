

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
    const options = {
  method: 'POST',
  headers: {
    accept: 'text/event-stream',
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

  const response = await fetch('https://api.play.ht/api/v2/tts', options)
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      // Do something with the data
     
  
      return {
      
        statusCode: 200,
        body: JSON.stringify({"reply":data}),  //response.data.url
     
      }
    

  } catch (error) {
    console.error('Fetch error:', error);
    }
}

// const res = fetch('https://api.play.ht/api/v2/tts/stream', options)
//   .then(response => response.json())
//   .catch(err => console.error(err))

//   setTimeout(()=>{
//     console.error(res)
//     console.log(res)
//   }, 7000)



// const res = "cos"
//    res = fetch('https://api.play.ht/api/v2/tts/stream', options)
//   .then(response => response.json())
//   .then(response =>  console.log("respone"+response))
//   .catch(err => console.error(err))
    
 
    // return {
    
    //   statusCode: 200,
    //   body: JSON.stringify({"reply":res.content}),  //response.data.url
   
    // }

  // } catch (error) {
  //   return { statusCode: 500, body: error.toString("dont know") }
  // }
//   }
// }

module.exports = { handler }






