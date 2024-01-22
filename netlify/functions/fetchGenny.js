const handler = async () => {
  try {


    const api = process.env.BUID_API
    

    return {
    
      statusCode: 200,
      body: JSON.stringify({res:api}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }






