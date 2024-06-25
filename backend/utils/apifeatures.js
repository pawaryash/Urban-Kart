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

    filter(){
        const queryCopy = {...this.queryStr}

        //Remove some fields for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(field => {
            delete queryCopy[field];
        });
        this.query = this.query.find(queryCopy);
        return this;
    }
}

module.exports = ApiFeatures