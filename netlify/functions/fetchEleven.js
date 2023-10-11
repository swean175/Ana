

//   const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) {

   
    try {
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'X-API-KEY': process.env.GENNY_API_KEY
            },
            body: JSON.stringify({speed: 1, text: 'Jestem Ana', speaker: '640f477d2babeb0024be422b'})
          };

        const response = await fetch('https://api.genny.lovo.ai/api/v1/tts/sync', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
     
        return {
        
          statusCode: 200,
          body: JSON.stringify({"reply":response}),
       
        }
    
      } catch (error) {
        return { statusCode: 500, body: error.toString("dont know") }
      }
    }


   
      
    


};




