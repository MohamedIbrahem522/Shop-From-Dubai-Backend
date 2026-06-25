import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const uri = "mongodb://moibrahem522_db_user:admin123@ac-9fz5szq-shard-00-00.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-01.4v00uyc.mongodb.net:27017,ac-9fz5szq-shard-00-02.4v00uyc.mongodb.net:27017/ShopDubai?ssl=true&replicaSet=atlas-kh16fj-shard-0&authSource=admin&retryWrites=true";
await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
const db = mongoose.connection.db;
const password = "admin123";
const hashed = await bcrypt.hash(password, 12);
await db.collection("admins").insertOne({
  name: "Admin",
  email: "admin@shopfromdubai.com",
  password: hashed,
  role: "super_admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
console.log("✅ Admin created: admin@shopfromdubai.com / admin123");
await mongoose.disconnect();
