var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    UserSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        company: String,
        password: String,
        salt: String,
        firstName: String,
        lastName: String,
        eMail: String,
        active : { type : Boolean, default : true },
        admin : { type : Boolean, default : false },
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

module.exports = moongoose.model ('Users', UserSchema);