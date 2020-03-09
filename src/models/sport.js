var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SportSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        sportType: { type: Schema.Types.ObjectId, ref: 'SportTypes' },
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

    SportSchema.virtual('sportTypeName').get(function(){
        return this.sportType.name;
    });

    SportSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.sportTypeName = this.sportTypeName;
        return obj;
     };

module.exports = moongoose.model ('Sports', SportSchema);