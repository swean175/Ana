import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, get, remove } from 'firebase/database'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})



// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {


    const appSettings = {
        databaseURL: await process.env.FIREBASE_URL
    }


    return {
    
      statusCode: 200,
      body: JSON.stringify({res:appSettings}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }
