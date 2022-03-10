const bannerController = require("./bannerController");
const route = require("express").Router();
const {Admin} = require("../../api/middleware/permission.middleware");
const path = require('path')

route.post(
    "/",
    Admin,
    bannerController.addBanner
);

route.get(
    "/selected/:id",
    bannerController.getBanner
);

route.get(
    "/all/",
    bannerController.getAllBanner
);
route.get(
    "/all/no-paging",
    bannerController.getAllBannerWithoutPagination
);
route.put(
    "/update/:id",
    Admin,
    bannerController.editBanner
);
route.delete(
    "/delete/:id",
    Admin,
    bannerController.deleteBanner
);
route.put(
    "/bottom-banner",
    Admin,
    bannerController.updateBottomBanner
);
route.get(
    "/bottom-banner",
    bannerController.getBottomBanner
)

//Bottom banner new API routes start 27/02/2022 by Radoan Hossan
route.post(
    "/bottom/create",
    Admin,
    bannerController.addBottomBanner
);
route.put(
    "/bottom/update/:id",
    Admin,
    bannerController.editBottomBanner
);

route.delete(
    "/bottom/delete/:id",
    Admin,
    bannerController.deleteBottomBanner
);
route.get(
    "/bottom/all",
    bannerController.getAllBottomBanner
);
route.get(
    "/bottom/all/no-paging",
    bannerController.getAllBottomBannerWithoutPagination
);

route.get(
    "/bottom/single/:id",
    bannerController.getBottomBannerSingle
);
//Bottom banner new API routes end 27/02/2022 by Radoan Hossan

module.exports = route;