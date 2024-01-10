const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);
const accountsCollection = client.db(dbname).collection(colname);

const docToUpdate = {_id: new ObjectId("659e2b565b484a122333c7fb")};
const update = {$set : {balance: 3000}};

async function main() {
    try {
        let result = await accountsCollection.updateOne(docToUpdate, update);
        console.log(result.modifiedCount===1 ? "Updated One Document Successfully!" : "No Documents were Updated!");
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`)
    } finally {
        await client.close();
    }
}

main()