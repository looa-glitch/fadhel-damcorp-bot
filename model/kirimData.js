var mongoose = require('mongoose')
var Scema = mongoose.Schema

var kirimData = new Scema({
    wa_id: String,
    message : String,
    timestamp: Date
},{ collection: "kirim_data" })

const model = mongoose.model("kirim_data", kirimData)
module.exports = model