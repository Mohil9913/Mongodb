const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);
const accountsCollection = client.db(dbname).collection(colname);

const docToDelete = {balance : {$gt : 1234}};

async function main() {
    try {
        let result = await accountsCollection.deleteMany(docToDelete);
        console.log(result.deletedCount>0 ? `Deleted ${result.deletedCount} Document(s) Successfully!` : "No Documents were Deleted!");
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`)
    } finally {
        await client.close();
    }
}

main()