import mongoose from 'mongoose';
const urlSchema= new mongoose.Schema(
    {
       shortId:{
           type:String,
           require:true,
        },
        redirectUrl:{
            type:String,
            require:true
        },
        createdBy:{
            type:String,
            require:true,
        },
        
    },{timestamps:true}
    )

const UrlShort = mongoose.model('urlInfo',urlSchema);
export default UrlShort;