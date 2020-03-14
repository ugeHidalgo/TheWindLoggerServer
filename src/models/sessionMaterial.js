var moongoose = require ('mongoose'),
    Schema = moongoose.Schema,
    SesionMaterialSchema = new Schema ({
        _id : Schema.Types.ObjectId,
        userName: String,
        session: { type : Schema.Types.ObjectId, ref: 'Sessions' },
        material: { type : Schema.Types.ObjectId, ref: 'Materials' },
        time: Number,
        distance: Number,
        usePercentage: Number,
        maxSpeed: Number,
        created : { type : Date, default : Date.now },
        updated : { type : Date, default : Date.now }
    });

    SesionMaterialSchema.virtual('medSpeed').get(function(){
        return this.distance / (this.time / 3600);
    });

    SesionMaterialSchema.virtual('materialName').get(function(){
        return this.material.name;
    });

    SesionMaterialSchema.virtual('materialTypeName').get(function(){
        return (this.material.materialType) ? this.material.materialType.name : '';
    });

    SesionMaterialSchema.methods.toJSON = function () {
        var obj = this.toObject();
        obj.materialTypeName = this.materialTypeName;
        obj.materialName = this.materialName;
        obj.medSpeed = this.medSpeed;
        return obj;
     };

     module.exports = moongoose.model ('SessionMaterials', SesionMaterialSchema);