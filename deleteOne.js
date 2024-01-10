const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);
const accountsCollection = client.db(dbname).collection(colname);

const docToDelete = {_id: new ObjectId("659e2ad70bda54aa33223a38")};

async function main() {
    try {
        let result = await accountsCollection.deleteOne(docToDelete);
        console.log(result.deletedCount ? `Deleted Document Successfully!` : "No Documents were Deleted!");
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`)
    } finally {
        await client.close();
    }
}

main()