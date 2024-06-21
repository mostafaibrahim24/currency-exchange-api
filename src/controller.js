const fetch = require('node-fetch')

async function callExternalAPI (req) {
    body = {
            source: req.body.from_currency,
            targets: req.body.to_currency
        }
        
        
    const external_api_response = await fetch('https://api.apyhub.com/data/convert/currency/multiple',{
                                                                method: 'POST',
                                                                headers: {'Content-Type': 'application/json',
                                                                          'apy-token': 'APY0szofmm2MtWmjFE37lvRTOLgYmnIGubd7eiHZEgl00kJUI3d02KzFBtnI2fOYNT',
                                                                        },
                                                                body: JSON.stringify(body)
                                                                });
    return external_api_response
    
}
function formatResponse(result, is_conversion=false,amount=1) {
    var data = []
    if(is_conversion){
        var item = {}
        for (let i = 0; i < Object.keys(result).length; i++){
                var key = Object.keys(result)[i]
                item['from']=key.split("_")[0]
                item['to']=key.split("_")[1]
                item['amount']=Number(amount)
                item['result']=result[key]
                data.push(item)
                item = {}
        }
    }else{
        var item = {}
        
        for (let i = 0; i < Object.keys(result).length; i++){
                var key = Object.keys(result)[i]
                item['from']=key.split("_")[0]
                item['to']=key.split("_")[1]
                item['rate']=result[key]
                data.push(item)
                item = {}
        }
    }
    return data
}
function validateRequest(req,is_conversion=false){
    var allowed_properties = ['from_currency','to_currency']
    if(is_conversion){
        allowed_properties.push('amount')
    }
    const body=req.body
    const sent_properties = Object.keys(body)
    const not_allowed_properties_sent = sent_properties.filter(x => !allowed_properties.includes(x))
    const required_properties_not_sent = allowed_properties.filter(x=> !sent_properties.includes(x))
    if (not_allowed_properties_sent.length>0 && required_properties_not_sent.length>0 ){
        console.error("Request: "+req.originalUrl+" ,Required properties/parameters not sent in body: "+required_properties_not_sent+" ,Not allowed properties/parameters sent in body: "+not_allowed_properties_sent)
        throw {
            "Error": "Please adhere to API's required and allowed properties in body",
            "required": required_properties_not_sent,
            "not_allowed": not_allowed_properties_sent
        }
    }
    if (not_allowed_properties_sent.length>0){
        console.error("Request: "+req.originalUrl+" ,Not allowed properties/parameters sent in body: "+not_allowed_properties_sent)
        throw {
            "Error": "Please adhere to API's allowed properties in body",
            "not_allowed": not_allowed_properties_sent
        }
    }
    if (required_properties_not_sent.length>0){
        console.error("Request: "+req.originalUrl+" ,Required properties/parameters not sent in body: "+required_properties_not_sent)
        throw {
            "Error": "Please adhere to API's required properties in body",
            "required": required_properties_not_sent
        }
    }
    
}

const getExchangeRate = async(req,res) => {
    try{
        validateRequest(req)
    }catch(error){
        return res.status(400).json(error)
    }
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
    try{
        validateRequest(req,is_conversion)
    }catch(error){
        return res.status(400).json(error)
    }
    const amount = req.body.amount
    var result = {}
    try{
        const external_api_response = await callExternalAPI(req)
        var result = await external_api_response.json();
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