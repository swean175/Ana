


// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async () => {
  try {


    const appSettings = process.env.FIREBASE_URL
    


    return {
    
      statusCode: 200,
      body: JSON.stringify({res:appSettings}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }
