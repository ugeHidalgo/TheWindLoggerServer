var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SesionSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        sessionDate: Date,
        sessionTime: Number,
        sessionDistance: Number,
        sport: { type : Schema.Types.ObjectId, ref: 'Sports' },
        sportName: String,        
        spot: { type : Schema.Types.ObjectId, ref: 'Spots' },
        spotName: String,
        race: Boolean,
        indoor: Boolean,
        value: { type : Number, min: 1, max: 10 },
        effort: { type : Number, min: 1, max: 10 },
        maxSpeed: Number,
        maxPower: Number,
        medPower: Number,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

    SesionSchema.virtual('medSpeed').get(function(){
        return this.sessionDistance / (this.sessionTime / 3600);
    });

    SesionSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.medSpeed = this.medSpeed;
        return obj;
     };

module.exports = moongoose.model ('Sessions', SesionSchema);