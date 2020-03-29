var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SessionsInfoForSportSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        sport: { type: Schema.Types.ObjectId, ref: 'Sports' },
        sessions: Number,
        distance: Number,
        time: Number,
        maxSpeed: Number,
        medSpeed: Number,
        maxDistance: Number,
        maxPower: Number,
        medPower: Number,
        maxTime: Number,
    });

    SessionsInfoForSportSchema.virtual('medTime').get(function(){
        return this.time / this.sessions;
    });

    SessionsInfoForSportSchema.virtual('medDistance').get(function(){
        return this.distance / this.sessions;
    });

module.exports = moongoose.model ('SessionsInfoForSports', SessionsInfoForSportSchema);