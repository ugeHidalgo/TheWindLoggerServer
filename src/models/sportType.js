var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SportTypeSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('SportTypes', SportTypeSchema);