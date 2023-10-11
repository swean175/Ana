import {sdk} from 'api'

//   const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) { 
    try {
       
        sdk.auth( process.env.GENNY_API_KEY);
        const res = await sdk.syncTts({speed: 1})
        // .then((data) => res = data)
        // .catch(err => console.error(err));

       
        return {
        
          statusCode: 200,
          body: JSON.stringify({"reply":res}),
       
        }
    
      } catch (error) {
        return { statusCode: 500, body: error.toString("dont know") }
      }
    }










