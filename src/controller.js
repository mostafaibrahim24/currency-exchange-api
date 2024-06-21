const fetch = require('node-fetch')
const {formatResponse}=require('./utils')


async function callExternalAPI (req) {
    body = {
            source: req.body.from_currency,
            targets: req.body.to_currency
        }
        
        
    const external_api_response = await fetch(`${process.env.API}`,{
                                                                method: 'POST',
                                                                headers: {'Content-Type': 'application/json',
                                                                          'apy-token': `${process.env.TOKEN}`,
                                                                        },
                                                                body: JSON.stringify(body)
                                                                });
    return external_api_response
    
}


const getExchangeRate = async(req,res) => {
    var result = {}
    try{
        const external_api_response = await callExternalAPI(req)
        var result = await external_api_response.json();
    }catch(error){
        console.error("Error calling external api: ",error)
        return res.status(500).json({Error: "Unexpected error occurred, try again after a while."})
    }
    var data=formatResponse(result)
    return res.status(200).json(data)
}

const convert = async (req,res) => {
    const is_conversion = true
    const amount = req.body.amount
    var result = {}
    try{
        const external_api_response = await callExternalAPI(req)
        var result = await external_api_response.json();
        //Token expired (specific to apyhub as number of api calls are limited, and after exceeding the limit it expires/invalidated)
        if (result['data']){
            throw "Token expired/invalid"//Only for our api logs, not shown anywhere else
        }
    }catch(error){
        console.error("Error calling external api: ",error)
        return res.status(500).json({Error: "Unexpected error occurred, try again after a while."})
    }
    for (let i = 0; i < Object.keys(result).length; i++){
        var key = Object.keys(result)[i]
        result[key]=result[key] * Number(amount)
    }
    var data=formatResponse(result,is_conversion,amount)
    return res.status(200).json(data)

}
  

module.exports = {convert,getExchangeRate}