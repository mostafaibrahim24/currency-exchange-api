const allowed_currency_codes = ["1inch", "aave", "ada", "aed", "afn", "algo", "all", "amd", "amp", "ang", "aoa", "ar", "ars", "atom", "aud", "avax", "awg", "axs", "azn", "bam", "bat", "bbd", "bch", "bdt", "bgn", "bhd", "bif", "bmd", "bnb", "bnd", "bob", "brl", "bsd", "bsv", "bsw", "btc", "btcb", "btg", "btn", "busd", "bwp", "byn", "bzd",
                                "cad", "cake", "cdf", "celo", "chf", "chz", "clf", "clp", "cny", "comp", "cop", "crc", "cro", "crv", "cuc", "cup", "cve", "cvx", "czk", "dai", "dash", "dcr", "dfi", "djf", "dkk", "doge", "dop", "dot", "dzd","egld", "egp", "enj", "eos", "ern", "etb", "etc", "eth", "eur", "fei",
                                "fil", "fjd", "fkp", "flow", "frax", "ftm", "ftt", "gala", "gbp", "gel", "ggp", "ghs", "gip", "gmd", "gnf", "gno", "grt", "gt", "gtq", "gyd",  "hbar", "hkd", "hnl", "hnt", "hot", "hrk", "ht", "htg", "huf", "icp", "idr", "ils", "imp", "inj", "inr", "iqd", "irr", "isk", "jep", "jmd", "jod", "jpy",
                                "kava", "kcs", "kda", "kes", "kgs", "khr", "klay", "kmf", "knc", "kpw", "krw", "ksm", "kwd", "kyd", "kzt", "lak", "lbp","leo", "link", "lkr", "lrc", "lrd", "lsl", "ltc", "ltl", "luna", "lvl", "lyd",
                                "mad", "mana", "matic", "mdl", "mga", "mina", "miota", "mkd", "mkr", "mmk", "mnt", "mop", "mro", "mur", "mvr", "mwk", "mxn", "myr", "mzn", "nad", "near", "neo", "nexo", "ngn", "nio", "nok", "npr", "nzd", "okb", "omr", "one",
                                "pab", "paxg", "pen", "pgk", "php", "pkr", "pln", "pyg", "qar", "qnt", "qtum", "ron", "rsd", "rub", "rune", "rwf", "sand", "sar", "sbd", "scr", "sdg", "sek", "sgd", "shib", "shp", "sle", "sll", "sol", "sos",
                                "srd", "std", "stx", "svc", "syp", "szl", "thb", "theta", "tjs", "tmt", "tnd", "top", "trx", "try", "ttd", "ttt", "tusd", "twd", "tzs", "uah", "ugx", "uni", "usd", "usdc", "usdp", "usdt", "uyu", "uzs",
                                "vet", "vnd", "vuv", "waves", "wbtc", "wemix", "wst", "xaf", "xag", "xau", "xcd", "xdc", "xdr", "xec", "xem", "xlm", "xmr", "xof", "xpf", "xrp", "xtz", "yer", "zar", "zec", "zil", "zmk", "zmw", "zwl"]


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
function formatRatesResponse(result) {
    var data = []
    
    var item = {}
    
    for (let i = 0; i < Object.keys(result).length; i++){
            var key = Object.keys(result)[i]
            item['from_currency']=key.split("_")[0]
            item['to_currency']=key.split("_")[1]
            item['rate']=result[key]
            data.push(item)
            item = {}
    }
    
    const response = {}
    response['rates']=data
    return response
}
function formatConversionsResponse(result,amount) {
    var data = []
  
    var item = {}
    for (let i = 0; i < Object.keys(result).length; i++){
            var key = Object.keys(result)[i]
            item['from_currency']=key.split("_")[0]
            item['to_currency']=key.split("_")[1]
            item['amount']=Number(amount)
            item['result']=result[key]
            data.push(item)
            item = {}
    }
    const response = {}
    response['conversions']=data
    return response
}
module.exports= {validateProperties,validateTypes,validateCurrencies,formatRatesResponse,formatConversionsResponse}