var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SportSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        sportType: { type: Schema.Types.ObjectId, ref: 'SportTypes' },
        sportTypeName: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Sports', SportSchema);