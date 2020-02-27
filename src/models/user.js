var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    UserSchema = new Schema ({
        id : Number,
        userName: String,
        company: String,
        password: String,
        salt: String,
        firstName: String,
        lastName: String,
        eMail: String,
        active : { type : Boolean, default : true },
        admin : { type : Boolean, default : false },
        birthDate: Date,
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now },
        phone: String,
        mobile: String
    });

module.exports = moongoose.model ('Users', UserSchema);