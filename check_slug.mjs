import mongoose from "mongoose";
const uri = "mongodb://moibrahem522_db_user:admin123@ac-9fz5szq-shard-00-00.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-01.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-02.4v00uyc.mongodb.net:27017/ShopDubai?ssl=true&replicaSet=atlas-kh16fj-shard-0&authSource=admin&retryWrites=true";
await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
const db = mongoose.connection.db;
const products = await db.collection("products").find({ slug: /tqm-maalq-wshwk/ }).toArray();
console.log("Matching products:", products.length);
products.forEach(p => console.log("  -", p.slug, p._id));
await mongoose.disconnect();
