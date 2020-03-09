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
        size: String,
        secondHand : { type : Boolean, default : false },
        purchaseDate : { type : Date, default : Date.now },
        purchasePrice: Number,
        purchaseFrom: String,
        saleDate : { type : Date, default : Date.now },
        salePrice: Number,
        soldTo: String,
        comments: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

    MaterialSchema.virtual('materialTypeName').get(function(){
        return this.materialType.name;
    });

    MaterialSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.materialTypeName = this.materialTypeName;
        return obj;
     };

module.exports = moongoose.model ('Materials', MaterialSchema);