const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController"); 
const {requireAuth, isAdmin} = require("../middleware/auth.middleware")
router.use(requireAuth)

router.get("/", resourceController.getAllResources);
router.post("/", isAdmin, resourceController.addResource);
router.put("/:id", isAdmin, resourceController.updateResource);
router.delete("/:id", isAdmin, resourceController.deleteResource);

module.exports = router;
