


const handler = async (event) => {
    try {
        const response = "test working"
        return {
            statusCode: 200,
            body: JSON.stringify({
                reply: response.data                
            })
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

// module.exports = { handler }