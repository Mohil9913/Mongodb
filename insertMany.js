const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);

const sampleAccount = [
    {
        account_holder: "Naman Thanki",
        account_id: "22SOECE13030",
        account_type: "checking",
        balance: 237687243,
        lastupdated: new Date(),
        transaction: []
    },
    {
        account_holder: "Ashish Thanki",
        account_id: "22SOECE13031",
        account_type: "checking",
        balance: 236549093,
        lastupdated: new Date(),
        transaction: []
    }
]

async function main() {
    try {
        const accountsCollection = client.db(dbname).collection(colname);
        let result = await accountsCollection.insertMany(sampleAccount);
        console.log(`Inserted document : ${result.insertedCount}`);
    } catch (err) {
        console.error(`Error inserting document: ${err}`)
    } finally {
        await client.close();
    }
}

main()