class createSchema{
    constructor(userUploadConnection,mongoose)
    {
        this.schema = mongoose.Schema;
        this.userUpload = new this.schema({
            username:{
                type:String,
                required:true
            },
            maxScore:{
                type:Number,
                required:true
            }
        })
        this.userUpload = userUploadConnection.model('users',this.userUpload)
    }
}

module.exports = createSchema