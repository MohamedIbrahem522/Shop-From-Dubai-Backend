import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dw92smdvr",
  api_key: "933792927727872",
  api_secret: "-oZJB0wQEzIoAgd4Rge60sqVGOE",
});
try {
  const result = await cloudinary.api.ping();
  console.log("✅ Cloudinary connected:", result.status);
} catch (e) {
  console.log("❌ Cloudinary error:", e.message);
}
