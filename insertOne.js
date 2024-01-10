const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const client = new MongoClient(uri);

const sampleAccount =
{
  account_holder: "Moihl Mokaria",
  account_id: "22SOECE13023",
  account_type: "checking",
  balance: 236549093,
  lastupdated: new Date(),
}

async function main() {
  try {
    const accountsCollection = client.db(dbname).collection(colname);
    let result = await accountsCollection.insertOne(sampleAccount);
    console.log(`Inserted document : ${result.insertedId}`);
  } catch (err) {
    console.error(`Error inserting document: ${err}`)
  } finally {
    await client.close();
  }
}

main()