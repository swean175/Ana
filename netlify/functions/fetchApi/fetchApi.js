import { Configuration, OpenAIApi } from 'openai'


//-------------------------------
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
})

const openai = new OpenAIApi(configuration)

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const response = await openai.createChatCompletion({ //-------------------competion
      model: 'gpt-3.5-turbo',
      messages: event.body,
      presence_penalty: 0,
      frequency_penalty: 0.3
  })


   
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
        reply:response.data }
        ),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
