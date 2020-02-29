var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SportSchema = new Schema ({
        id : Number,
        userName: String,
        name: String,
        description: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Sports', SportSchema);