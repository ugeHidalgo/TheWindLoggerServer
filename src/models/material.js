var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    MaterialSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        materialType: { type: Schema.Types.ObjectId, ref: 'MaterialTypes' },
        brand: String,
        model: String,
        year: String,
        secondHand : { type : Boolean, default : false },
        purchaseDate : { type : Date, default : Date.now },
        purchasePrice: Number,
        saleDate : { type : Date, default : Date.now },
        salePrice: Number,
        soldTo: String,
        comments: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Materials', MaterialSchema);