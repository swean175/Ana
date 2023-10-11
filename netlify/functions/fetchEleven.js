

  const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) {



        sdk.auth(process.env.GENNY_API_KEY);
      
    const response = await sdk.syncTts({speed: 1, text: "Jestem Ana", speaker: '640f477d2babeb0024be422b'})
        //   .then(({ data }) => console.log(data))
          .then(({data}) => data)
          .catch(err => console.error(err));
    
    return {
        statusCode: 200,
        body: JSON.stringify({"reply":response}),
    }


};




