var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SpotSchema = new Schema ({
        id : Number,
        userName: String,
        name: String,
        description: String,
        country: String,
        province: String,
        place: String,
        lat: String,
        long: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Spots', SpotSchema);