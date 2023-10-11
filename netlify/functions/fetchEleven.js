

  const sdk = require('api')('@genny-api/v1.0#eqij1clm8s4s2v');

exports.handler = async function (event, context) {
    try {

 const response =""
        sdk.auth(process.env.GENNY_API_KEY);
      
       sdk.syncTts({speed: 1, text: "Jestem Ana", speaker: '640f477d2babeb0024be422b'})
          .then(({ data }) => response = data)
          .catch(err => console.error(err));
    
    return {
        statusCode: 200,
        body: JSON.stringify({"reply":response.data[0].urls[0]}),
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
};


// "id": "64191022c25c1f00222c0ab1",
//"displayName": "Sophia Butler",

//"https://voiceverse-prod.s3.us-west-2.amazonaws.com/team/6511deba448ce2002390279b/jobs/652717d6e43e81002487fb0c/wkmFkLI0Mg.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA26OUSLIS7YRKCXJL%2F20231011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231011T214711Z&X-Amz-Expires=86400&X-Amz-Signature=d1b5d4df63ed12f391f6d6197bd7d5ae0247908ecdd8eafd14d6308170088b52&X-Amz-SignedHeaders=host&x-id=GetObject"