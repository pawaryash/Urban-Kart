const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then((db)=>{
        console.log(`Mongo DB connected with server: ${db.connections[0].host}`);
    }).catch((err)=>{
        console.log(err);
        throw err;
    });
}

module.exports = connectDatabase