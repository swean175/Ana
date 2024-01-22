
const handler = async () => {
  try {


    const res = {jajo:"jajo-test"}


    return {
    
      statusCode: 200,
      body: JSON.stringify({res}),
   
    }

  } catch (error) {
    return { statusCode: 500, body: error.toString("dont know") }
  }
}

module.exports = { handler }
