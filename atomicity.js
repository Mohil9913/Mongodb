/*
    Transaction : Set of multiple query, which are inter-related with eachother
    Atomicity : Transaction execution should be performed fully, and there should be no partial transactions. If by any chances transaction is made partially, it should be reverted to maintain intigrity of database.

    Steps to active atomicity:
        start client session
        define the transaction [optional]
        define sequence of operations to perform inside an transaction
        release all resources
*/

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const config = require("./dbConfig")

const uri = config.uri;
const dbname = config.dbname;
const colname = config.colname;
const transfercol = "transfer"
const client = new MongoClient(uri);

const accounts = client.db(dbname).collection(colname);
const transfer = client.db(dbname).collection(transfercol);

const from = "Ashish Thanki";
const to = "Naman Thanki";

const sender_name = {account_holder : from};
const receiver_name = {account_holder : to};
const transaction_amount = 1000;

const session = client.startSession();

async function findId(query){
    let found = await accounts.findOne(query);
    return found._id.toString();
}

async function transfer_money(sid, rid, amount){
    const debit = await accounts.updateOne({_id : new ObjectId(sid)},{$inc: {balance: -amount}},{session});
    const credit = await accounts.updateOne({_id : new ObjectId(rid)},{$inc: {balance: amount}},{session});
    
    if(debit.modifiedCount > 0 && credit.modifiedCount > 0){
        await record_transfer(sid, rid, amount);
    } else {
        console.log("Transaction was partially aborted before Recording!");
    }
}

async function record_transfer(sid, rid, amount){
    const newTransfer = {
        amount: amount,
        sender: sid,
        receiver: rid
    };
    const recordTransaction = await transfer.insertOne(newTransfer, {session});
    
    if(recordTransaction){
        const senderUpdate = await accounts.updateOne({_id : new ObjectId(sid)},{$push: {transaction: recordTransaction}},{session});
        const receiverUpdate = await accounts.updateOne({_id : new ObjectId(rid)},{$push: {transaction: recordTransaction}},{session});

        if(senderUpdate.modifiedCount > 0 && receiverUpdate.modifiedCount > 0){
            console.log(`${sid} sent ${amount} to ${rid}`);
        } else {
            console.log("Transaction was partially aborted!");
        }
    } else {
        console.log("Transaction was fully aborted! while recording");
    }
}

async function main() {
    try {
        const transaction_result = await session.withTransaction(
            async()=>{
                sender_id = await findId(sender_name);
                receiver_id = await findId(receiver_name);
                await transfer_money(sender_id, receiver_id, transaction_amount);
            }
        );
        if (!transaction_result) {
            console.log("Transaction completed successfully!");
        } else {
            console.log("Transaction failed:", transaction_result);
        }
    } catch (err) {
        console.error(`Error Finding Documents: ${err}`);
        process.exit(1);
    } finally {
        await session.endSession();
        await client.close();
    }
}

main()