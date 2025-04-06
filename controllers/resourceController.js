const Resource = require("../models/resources"); // Import the schema
const cloudinary = require("../lib/cloudinary");
const mongoose = require("mongoose");

// Fetch all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    // console.log(resources)
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching resources", error });
  }
};

// Add a new resource (Admin only)
exports.addResource = async (req, res) => {
  try {
    const { title, description, thumbnail, link } = req.body;
    if(!title || !description || !thumbnail || !link){
      return res.status(400).json({message:"all feilds are requires"});
    }
    const uploadResponse = await cloudinary.uploader.upload(thumbnail);
    const newResource = new Resource({ title, description, thumbnail:uploadResponse.secure_url, link });
    await newResource.save();
    return res.status(201).json({ message: "Resource added successfully",newResource });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: "Error adding resource", error });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  const {title,description,link,thumbnail} = req.body;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    if(thumbnail!=='') {
      const uploadResponse = await cloudinary.uploader.upload(thumbnail);
      await Resource.findByIdAndUpdate(id,{title,description,link,thumbnail:uploadResponse.secure_url});
    }
    else{
      await Resource.findByIdAndUpdate(id,{title,description,link});
    }
    const resource=await Resource.findById(id);
    if(!resource){
      return res.status(404).json({message:"No such resource exist"});
    }
    res.status(200).json({ message: "Resource updated",resource });
  } catch (error) {
    res.status(500).json({ message: "Error updating resource", error });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    await Resource.findByIdAndDelete(id);
    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource", error });
  }
};
