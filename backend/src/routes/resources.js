const express = require("express");
const router = express.Router();
const Resource = require("../models/Resources");
const User = require("../models/User");
const authMiddleware = require("../middleware/authmiddleware");

//  Add a Resource
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, url, skill } = req.body;
    const userId = req.user.id; // Logged-in user ID

    // Check if skill exists for the user
    const user = await User.findById(userId).populate("skills");
    if (!user.skills.some(s => s._id.toString() === skill)) {
      return res.status(400).json({ error: "You can only add resources for your own skills." });
    }

    const newResource = new Resource({ title, url, skill, user: userId });
    await newResource.save();

    res.status(201).json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    console.error("Error Adding Resource:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get All Resources for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const resources = await Resource.find({ user: userId }).populate("skill");

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error Fetching Resources:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  Delete a Resource (Only the User Who Added It)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const resource = await Resource.findById(req.params.id);

    if (!resource) return res.status(404).json({ error: "Resource not found" });

    if (resource.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await resource.deleteOne();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Resource:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
