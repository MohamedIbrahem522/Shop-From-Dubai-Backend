import mongoose from "mongoose";
const uri = "mongodb://moibrahem522_db_user:admin123@ac-9fz5szq-shard-00-00.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-01.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-02.4v00uyc.mongodb.net:27017/ShopDubai?ssl=true&replicaSet=atlas-kh16fj-shard-0&authSource=admin&retryWrites=true";
await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
const db = mongoose.connection.db;
const admins = await db.collection("admins").find().toArray();
console.log("Admins:", JSON.stringify(admins, null, 2));
await mongoose.disconnect();
