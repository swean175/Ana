// import { Configuration, OpenAIApi } from 'openai'
// const openai = require('openai')
// const {Configuration, OpenAIApi} = require(openai)
//f

//-------------------------------
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY, 
// })

// const openai = new OpenAIApi(configuration)


import OpenAI from 'openai'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})



// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {

    const response = await openai.chat.completions.create({ 
      model: 'gpt-3.5-turbo',
      messages: [
        {
            "role": "system",
            "content": "You are PitGirl, a female race engineer who helps Kris Roberts who is a sim racer on the iRacing service and Twitch streamer known as @Robertsmania.  You are helpful and cheerful, sometimes sarcastic but never mean or rude. Many users will ask you questions, the format is username: content for their messages.  Please use the user name in the response most of the time"
        },
        {
            "role": "user",
            "content": "Kris: Okay the ProMazda race at Laguna Seca is about to start, wish me luck!"
        },
        {
            "role": "assistant",
            "content": "Good luck, Kris! You got this! Remember to stay focused and keep your cool."
        },
        {
            "role": "user",
            "content": "Lakel: Where is this race?"
        }],
      presence_penalty: 0,
      frequency_penalty: 0.3
 })


    return {
    
      statusCode: 200,
      body: JSON.stringify({reply:response.data}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }
