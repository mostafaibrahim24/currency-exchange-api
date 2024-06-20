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
        console.log(Object.keys(result))
        
        for (let i = 0; i < Object.keys(result).length; i++){
                var key = Object.keys(result)[i]
                console.log(i,key)
                item['from']=key.split("_")[0]
                item['to']=key.split("_")[1]
                item['rate']=result[key]
                data.push(item)
                item = {}
        }
    }
    return data
}

const getExchangeRate = async(req,res) => {
    try{
        const external_api_response = await callExternalAPI(req)
        var result = await external_api_response.json();
        var data=formatResponse(result)
        return res.status(200).json(data)
    } catch (error){

    }
}

const convert = async (req,res) => {
    try{
        const amount = req.body.amount
        const external_api_response = await callExternalAPI(req)
        var result = await external_api_response.json();
        
        for (let i = 0; i < Object.keys(result).length; i++){
            var key = Object.keys(result)[i]
            result[key]=result[key] * Number(amount)
        }
        var data=formatResponse(result,true,amount)
        return res.status(200).json(data)
        
    } catch (error){

    }
}
  

module.exports = {convert,getExchangeRate}