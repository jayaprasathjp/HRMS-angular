const { Router } = require("express");
const router = Router();

router.use("/hrms/employee", require("./employee"));
router.use("/hrms/project", require("./project"));
router.use("/hrms/manager", require("./manager"));
router.use("/hrms/department", require("./department"));
router.use("/hrms/login", require("./login"));
router.use("/hrms/org-Chart", require("./login"));

module.exports = router;
