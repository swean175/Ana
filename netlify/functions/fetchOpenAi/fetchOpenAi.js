import { Configuration, OpenAIApi } from 'openai'

const {Configuration, OpenAiApi} = require(openai)

//-------------------------------
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
})

const openai = new OpenAIApi(configuration)






// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {



    const response = await openai.createChatCompletion({ 
      model: 'gpt-3.5-turbo',
      messages: event.body,
      presence_penalty: 0,
      frequency_penalty: 0.3
 })


    return {
    
      statusCode: 200,
      body: JSON.stringify({reply:response}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }
