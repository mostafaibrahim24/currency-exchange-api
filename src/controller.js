const fetch = require('node-fetch')
const allowed_currency_codes = ["1inch", "aave", "ada", "aed", "afn", "algo", "all", "amd", "amp", "ang", "aoa", "ar", "ars", "atom", "aud", "avax", "awg", "axs", "azn", "bam", "bat", "bbd", "bch", "bdt", "bgn", "bhd", "bif", "bmd", "bnb", "bnd", "bob", "brl", "bsd", "bsv", "bsw", "btc", "btcb", "btg", "btn", "busd", "bwp", "byn", "bzd",
                                "cad", "cake", "cdf", "celo", "chf", "chz", "clf", "clp", "cny", "comp", "cop", "crc", "cro", "crv", "cuc", "cup", "cve", "cvx", "czk", "dai", "dash", "dcr", "dfi", "djf", "dkk", "doge", "dop", "dot", "dzd","egld", "egp", "enj", "eos", "ern", "etb", "etc", "eth", "eur", "fei",
                                "fil", "fjd", "fkp", "flow", "frax", "ftm", "ftt", "gala", "gbp", "gel", "ggp", "ghs", "gip", "gmd", "gnf", "gno", "grt", "gt", "gtq", "gyd",  "hbar", "hkd", "hnl", "hnt", "hot", "hrk", "ht", "htg", "huf", "icp", "idr", "ils", "imp", "inj", "inr", "iqd", "irr", "isk", "jep", "jmd", "jod", "jpy",
                                "kava", "kcs", "kda", "kes", "kgs", "khr", "klay", "kmf", "knc", "kpw", "krw", "ksm", "kwd", "kyd", "kzt", "lak", "lbp","leo", "link", "lkr", "lrc", "lrd", "lsl", "ltc", "ltl", "luna", "lvl", "lyd",
                                "mad", "mana", "matic", "mdl", "mga", "mina", "miota", "mkd", "mkr", "mmk", "mnt", "mop", "mro", "mur", "mvr", "mwk", "mxn", "myr", "mzn", "nad", "near", "neo", "nexo", "ngn", "nio", "nok", "npr", "nzd", "okb", "omr", "one",
                                "pab", "paxg", "pen", "pgk", "php", "pkr", "pln", "pyg", "qar", "qnt", "qtum", "ron", "rsd", "rub", "rune", "rwf", "sand", "sar", "sbd", "scr", "sdg", "sek", "sgd", "shib", "shp", "sle", "sll", "sol", "sos",
                                "srd", "std", "stx", "svc", "syp", "szl", "thb", "theta", "tjs", "tmt", "tnd", "top", "trx", "try", "ttd", "ttt", "tusd", "twd", "tzs", "uah", "ugx", "uni", "usd", "usdc", "usdp", "usdt", "uyu", "uzs",
                                "vet", "vnd", "vuv", "waves", "wbtc", "wemix", "wst", "xaf", "xag", "xau", "xcd", "xdc", "xdr", "xec", "xem", "xlm", "xmr", "xof", "xpf", "xrp", "xtz", "yer", "zar", "zec", "zil", "zmk", "zmw", "zwl"]

async function callExternalAPI (req) {
    body = {
            source: req.body.from_currency,
            targets: req.body.to_currency
        }
        
        
    const external_api_response = await fetch('https://api.apyhub.com/data/convert/currency/multiple',{
                                                                method: 'POST',
                                                                headers: {'Content-Type': 'application/json',
                                                                          'apy-token': 'APY0m2R3Fec60q9W9uejVns4297I0n3eMbUmnyEHO0MBYNJG9z258d9QqyUaOnc0bxIp7V1Fn2QVI',
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
function validateCurrencies(from_currency,to_currency){
    const includesCurrencies= (allowed_currency_codes, to_currency) => to_currency.every(v => allowed_currency_codes.includes(v));
    const is_all_target_currencies_supported = includesCurrencies(allowed_currency_codes,to_currency)
    if (!allowed_currency_codes.includes(from_currency)&& !is_all_target_currencies_supported){
        const not_supported_currencies = to_currency.filter(x => !allowed_currency_codes.includes(x));
        not_supported_currencies.push(from_currency)
        throw {
            "Error": "Currency not supported",
            "currencies_not_supported": not_supported_currencies
        }
    }
    if (!allowed_currency_codes.includes(from_currency)){
        const not_supported_currencies=[from_currency]
        throw {
            "Error": "Currency not supported",
            "currencies_not_supported": not_supported_currencies
        }
    }
    if (!is_all_target_currencies_supported){
        const not_supported_currencies = to_currency.filter(x => !allowed_currency_codes.includes(x));
        throw {
            "Error": "Currency not supported",
            "currencies_not_supported": not_supported_currencies
        }
    }
    return true
}
function validateProperties(req,is_conversion){
    var allowed_properties = ['from_currency','to_currency']
    if(is_conversion){
        allowed_properties.push('amount')
    }
    const body=req.body
    const sent_properties = Object.keys(body)
    const not_allowed_properties_sent = sent_properties.filter(x => !allowed_properties.includes(x))
    const required_properties_not_sent = allowed_properties.filter(x=> !sent_properties.includes(x))
    if (not_allowed_properties_sent.length>0 && required_properties_not_sent.length>0 ){
        console.error("Request: "+req.originalUrl+" ,Required properties not sent in body: "+required_properties_not_sent+" ,Not allowed properties sent in body: "+not_allowed_properties_sent)
        throw {
            "Error": "Please adhere to API's required and allowed properties in body",
            "required": required_properties_not_sent,
            "not_allowed": not_allowed_properties_sent
        }
    }
    if (not_allowed_properties_sent.length>0){
        console.error("Request: "+req.originalUrl+" ,Not allowed properties sent in body: "+not_allowed_properties_sent)
        throw {
            "Error": "Please adhere to API's allowed properties in body",
            "not_allowed": not_allowed_properties_sent
        }
    }
    if (required_properties_not_sent.length>0){
        console.error("Request: "+req.originalUrl+" ,Required properties not sent in body: "+required_properties_not_sent)
        throw {
            "Error": "Please adhere to API's required properties in body",
            "required": required_properties_not_sent
        }
    }
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
function validateTypes(body, is_conversion=false){
    var properties_with_invalid_values = []
    if (isNumeric(body.from_currency)){
        properties_with_invalid_values.push("from_currency")
    }
    for (let i = 0; i < body.to_currency.length; i++){
        if (isNumeric(body.to_currency[i])){
            properties_with_invalid_values.push("to_currency")
            break
        }
    }
    if(is_conversion && !isNumeric(String(body.amount))){
        properties_with_invalid_values.push("amount")
    }
    if (properties_with_invalid_values.length>0){
        console.error("Properties with invalid values: "+properties_with_invalid_values)
        throw {
            "Error": "Properties with invalid values",
            "properties": properties_with_invalid_values
        }
    }
}
function validateRequest(req,is_conversion=false){
    //Checking if not allowed properties and/or required but not provided properties
    validateProperties(req,is_conversion)

    //Checking validity of the types of the values of the properties
    validateTypes(req.body,is_conversion)

    //Checking if valid/supported currencies are sent
    validateCurrencies(req.body.from_currency,req.body.to_currency)
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