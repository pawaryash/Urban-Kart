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
        console.log(queryCopy);

        //Filter based on price range and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        
        //no. of products to skip per page
        const skipProducts = resultsPerPage * (currentPage - 1);

        this.query = this.query.limit(resultsPerPage).skip(skipProducts);
        return this;
    }
}

module.exports = ApiFeatures