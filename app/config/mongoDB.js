let MONGO_DB= require('mongodb') ; 
const MongoClient = MONGO_DB.MongoClient ; 
MONGO_URL= "mongodb://localhost:27017/Notes4You"
const url = MONGO_URL ; 

try {
    var M_CONNECT = MongoClient.connect(url, {
        useUnifiedTopology: true
    });
    module.exports = { MONGO_DB, M_CONNECT };
} catch (err) {
    console.log(err);
}