var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SesionSchema = new Schema ({
        //_id : Schema.Types.ObjectId,
        userName: String,
        name: String,
        description: String,
        sessionDate: Date,
        sessionTime: Number,
        sessionDistance: Number,
        sport: { type : Schema.Types.ObjectId, ref: 'Sports' },
        spot: { type : Schema.Types.ObjectId, ref: 'Spots' },
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

    SesionSchema.virtual('sportName').get(function(){
        return this.sport ? this.sport.name : undefined;
    });

    SesionSchema.virtual('spotName').get(function(){
        return this.spot ? this.spot.name :  undefined;
    });

    SesionSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.medSpeed = this.medSpeed;
        obj.sportName = this.sportName;
        obj.spotName = this.spotName;
        return obj;
     };

     module.exports = moongoose.model ('Sessions', SesionSchema);