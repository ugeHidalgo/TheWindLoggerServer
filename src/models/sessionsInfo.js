var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SessionsInfoSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        sessions: Number,
        distance: Number,
        time: Number,
        maxSpeed: Number,
        medSpeed: Number,
        maxDistance: Number,
        medDistance: Number,
        maxTime: Number,
        medTime: Number,
        maxPower: Number,
        medPower: Number,
        sessionsInfoForSport: [{ type: Schema.Types.ObjectId, ref: 'SessionsInfoForSports' }]
    });

module.exports = moongoose.model ('SessionsInfos', SessionsInfoSchema);