import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../middleware/asyncHandler.js";


// =====================================
// Helper: Upload buffer to Cloudinary
// =====================================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },

      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};



// =====================================
// Create Product
// =====================================
export const createProduct = asyncHandler(async (req, res) => {

  const {
    name,
    description,
    price,
    stock = 0,
    category,
    features,
    isBest,

  } = req.body;



  const categoryExist =
    await Category.findById(category);



  if (!categoryExist || categoryExist.isDeleted) {

    return res.status(400).json({

      message:"Invalid category"

    });

  }



  const imageUrls = req.body?.imageUrls;
  let images = [];
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    images = imageUrls.map(url => ({ url, public_id: "direct" }));
  } else if (req.files && req.files.length > 0) {
    const uploads = req.files.map(async (file) => {
      try {
        const result = await uploadToCloudinary(file.buffer);
        return { url: result.secure_url, public_id: result.public_id };
      } catch (_) {
        return { url: `https://placehold.co/600x400?text=${encodeURIComponent(name || "Product")}`, public_id: "placeholder" };
      }
    });
    images.push(...await Promise.all(uploads));
  } else {
    images.push({ url: `https://placehold.co/600x400?text=${encodeURIComponent(name || "Product")}`, public_id: "placeholder" });
  }









  let slug =
  slugify(name || "",{ lower:true, strict:true });
  if (!slug) slug = "product-" + Date.now();
  const existingSlug = await Product.findOne({ slug });
  if (existingSlug) slug = slug + "-" + Date.now();




  const product = await Product.create({

    name,

    slug,

    description,

    price:Number(price),

    stock:Number(stock),

    category,

    images,


    features: features
      ? typeof features === "string"
        ? features.startsWith("[")
          ? JSON.parse(features)
          : features.split(",").map((f) => f.trim()).filter(Boolean)
        : Array.isArray(features)
          ? features
          : []
      : [],



    isBest:
    isBest === "true" ||
    isBest === true,

  });



  res.status(201).json({

    message:"Product created successfully",

    product,

  });


});




// =====================================
// Get All Products
// =====================================
export const getProducts = asyncHandler(async(req,res)=>{


const {

page=1,

limit=10,

keyword,

category,

minPrice,

maxPrice

}=req.query;



const filter = {

isDeleted:false

};



if(keyword){

filter.name={

$regex:keyword,

$options:"i"

};

}



if(category)

filter.category = category;




if(minPrice || maxPrice){


filter.price={};



if(minPrice)

filter.price.$gte =
Number(minPrice);



if(maxPrice)

filter.price.$lte =
Number(maxPrice);


}





const products =
await Product.find(filter)


.populate(
"category",
"name"
)


.limit(Number(limit))


.skip(
(page-1)*limit
)


.sort({

createdAt:-1

});




const total =
await Product.countDocuments(filter);



res.json({

total,

page:Number(page),

pages:
Math.ceil(total / limit),


products

});


});




// =====================================
// Get Single Product
// =====================================
export const getProductById =
asyncHandler(async(req,res)=>{


const product =
await Product.findOne({

_id:req.params.id,

isDeleted:false

})

.populate(
"category",
"name"
);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



res.json(product);


});




// =====================================
// Update Product
// =====================================
export const updateProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product || product.isDeleted){


return res.status(404).json({

message:"Product not found"

});


}




const {

name,

description,

price,

stock,

category,

features,

isBest

}=req.body;









if(name){


product.slug =
slugify(name,{

lower:true,

strict:true

});


}




product.name =
name ?? product.name;


product.description =
description ?? product.description;


product.price =
price ?? product.price;

product.stock =
stock ?? product.stock;


product.category =
category ?? product.category;





if (features) {
  product.features = typeof features === "string"
    ? features.startsWith("[")
      ? JSON.parse(features)
      : features.split(",").map((f) => f.trim()).filter(Boolean)
    : Array.isArray(features)
      ? features
      : [];
}




if(isBest !== undefined){

product.isBest =
isBest === "true" ||
isBest === true;

}





if(req.files && req.files.length > 0){
  const uploads = req.files.map(async (file) => {
    try {
      const result = await uploadToCloudinary(file.buffer);
      return { url: result.secure_url, public_id: result.public_id };
    } catch (_) {
      return { url: `https://placehold.co/600x400?text=${encodeURIComponent(product.name || "Product")}`, public_id: "placeholder" };
    }
  });
  const newImages = await Promise.all(uploads);
  const existing = (product.images || []).filter(i => i.public_id !== "placeholder");
  product.images = [...existing, ...newImages];
}

const imageUrls = req.body?.imageUrls;
if (Array.isArray(imageUrls) && imageUrls.length > 0) {
  const existing = (product.images || []).filter(i => i.public_id !== "placeholder");
  const newImages = imageUrls.map(url => ({ url, public_id: "direct" }));
  product.images = [...existing, ...newImages];
}





await product.save();



res.json({

message:"Product updated successfully",

product

});


});




// =====================================
// Soft Delete
// =====================================
export const deleteProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product || product.isDeleted){


return res.status(404).json({

message:"Product not found"

});


}




product.isDeleted=true;



await product.save();



res.json({

message:"Product deleted successfully"

});


});




// =====================================
// Restore
// =====================================
export const restoreProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



product.isDeleted=false;



await product.save();



res.json({

message:"Product restored successfully",

product

});


});




// =====================================
// Hard Delete
// =====================================
export const hardDeleteProduct =
asyncHandler(async(req,res)=>{


const product =
await Product.findById(req.params.id);



if(!product){

return res.status(404).json({

message:"Product not found"

});

}



for(const img of product.images){


await cloudinary.uploader.destroy(
img.public_id
);


}



await Product.deleteOne({

_id:req.params.id

});



res.json({

message:"Product permanently deleted"

});


});