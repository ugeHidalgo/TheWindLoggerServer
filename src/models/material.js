var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    MaterialSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        materialType: { type: Schema.Types.ObjectId, ref: 'MaterialTypes' },
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Materials', MaterialSchema);