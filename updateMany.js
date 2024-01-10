const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);
const accountsCollection = client.db(dbname).collection(colname);

const docToUpdate = {balance : {$gt : 10000}};
const update = {$set : {balance: 1000}};

async function main() {
    try {
        let result = await accountsCollection.updateMany(docToUpdate, update);
        console.log(result.modifiedCount>0 ? `Updated ${result.modifiedCount} Document(s) Successfully!` : "No Documents were Updated!");
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`)
    } finally {
        await client.close();
    }
}

main()