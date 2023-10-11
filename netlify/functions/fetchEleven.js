

//   const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) { 
    try {
        const response = await sdk.auth( process.env.GENNY_API_KEY);
        sdk.syncTts({speed: 1})
          .then(({ data }) => console.log(data))
          .catch(err => console.error(err));

        return {
        
          statusCode: 200,
          body: JSON.stringify({"reply":response}),
       
        }
    
      } catch (error) {
        return { statusCode: 500, body: error.toString("dont know") }
      }
    }










