import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = "mongodb://moibrahem522_db_user:admin123@ac-xwhchbk-shard-00-00.han9xio.mongodb.net:27017,ac-xwhchbk-shard-00-01.han9xio.mongodb.net:27017,ac-xwhchbk-shard-00-02.han9xio.mongodb.net:27017/ShopDubai?ssl=true&replicaSet=atlas-144q51-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "admin" },
  isActive: { type: Boolean, default: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true });

adminSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const Admin = mongoose.model("Admin", adminSchema);

try {
  await mongoose.connect(MONGO_URI);
  console.log("Connected");

  const del = await Admin.deleteMany({});
  console.log(`Deleted ${del.deletedCount} admin(s)`);

  const admin = new Admin({ name: "Admin", email: "admin@shopfromdubai.com", password: "admin123", role: "super_admin" });
  await admin.save();
  console.log("Created: admin@shopfromdubai.com / admin123");

  await mongoose.disconnect();
  console.log("Done!");
} catch (err) {
  console.error("Error:", err.message);
}
