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
        sport: { type: Schema.Types.ObjectId, ref: 'Sports' },
        sportName: String,        
        spot: { type: Schema.Types.ObjectId, ref: 'Spots' },
        spotName: String,
        active : { type : Boolean, default : true },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Sessions', SesionSchema);