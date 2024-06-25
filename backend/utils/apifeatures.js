class ApiFeatures{
    constructor(query, queryStr){
        this.query = query,
        this.queryStr = queryStr
    }
    //search the database based on specific features
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex:this.queryStr.keyword,
                $options: "i", //case insensitive
            }
        } : {};

        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }
}

module.exports = ApiFeatures