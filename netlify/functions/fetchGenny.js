const handler = async () => {
  try {


    const api = process.env.BUILD_API
    

    return {
    
      statusCode: 200,
      body: JSON.stringify({api}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }






