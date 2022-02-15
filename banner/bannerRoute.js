const bannerController = require("./bannerController");
const route = require("express").Router();

route.post("/", bannerController.addBanner);
route.get("/selected/:id", bannerController.getBanner);
route.get("/all/", bannerController.getAllBanner);
route.put("/:id", bannerController.editBanner);
route.delete("/:id", bannerController.deleteBanner);

module.exports = route;