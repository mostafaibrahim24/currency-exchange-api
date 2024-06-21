const {validateProperties,validateTypes,validateCurrencies} =require('./utils')

const validateRequest=(req,res,next)=>{
    var is_conversion=false
    if (req.originalUrl=="/currency/convert"){
        is_conversion=true
    }
    try{
        //Checking sent properties if not allowed properties and/or required but not provided properties
        validateProperties(req,is_conversion)

        //Checking validity of the types of the values of the properties
        validateTypes(req.body,is_conversion)

        //Checking if valid/supported currencies are sent
        validateCurrencies(req.body.from_currency.toLowerCase(),req.body.to_currency.map(v => v.toLowerCase()))

        next()
    }catch(error){
        return res.status(400).json(error)
    }
}

const changeCurrencyCase=(req,res,next)=>{
    req.body.from_currency=req.body.from_currency.toLowerCase()
    req.body.to_currency=req.body.to_currency.map(v => v.toLowerCase())
    next()
}
module.exports = {validateRequest,changeCurrencyCase}