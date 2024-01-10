const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);
const accountsCollection = client.db(dbname).collection(colname);

const docToFind = {balance: { $gt: 12345678 }};

async function main() {
    try {
        let result = accountsCollection.find(docToFind);
        let docCount = accountsCollection.countDocuments(docToFind);
        console.log(`\n\nFound ${await docCount} Documents!\n`);
        await result.forEach(doc => console.log(doc));
        // await result.forEach(doc => console.log(doc.account_holder +"--->"+ doc.balance));
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`)
    } finally {
        await client.close();
    }
}

main()