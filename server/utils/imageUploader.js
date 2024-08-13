const cloudinary = require("cloudinary").v2

// use height and quality for compress the image 
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  options.resource_type = "auto"  // determine automatically which type  of resource
  console.log("OPTIONS", options)
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}
