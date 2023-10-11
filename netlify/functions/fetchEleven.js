

  const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) { 
    try {
        const res = ""
        sdk.auth( process.env.GENNY_API_KEY);
        sdk.syncTts({speed: 1})
        .then((data) => res = data)
        .catch(err => console.error(err));

        const response = await res
        return {
        
          statusCode: 200,
          body: JSON.stringify({"reply":response}),
       
        }
    
      } catch (error) {
        return { statusCode: 500, body: error.toString("dont know") }
      }
    }










