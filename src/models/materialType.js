var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    MaterialTypeSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        sport: { type: Schema.Types.ObjectId, ref: 'Sports' },
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

    MaterialTypeSchema.virtual('sportName').get(function(){
        return this.sport.name;
    });

    MaterialTypeSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.sportName = this.sportName;
        return obj;
     };

module.exports = moongoose.model ('MaterialTypes', MaterialTypeSchema);