const { Router } = require("express");
const userRouter = Router();
const usersController = require("../controllers/usersController");

userRouter.get("/", usersController.usersListGet);
userRouter.get("/create", usersController.usersCreateGet);
userRouter.get("/:id/update", usersController.usersUpdateGet);
userRouter.get("/search", usersController.usersSearchGet);
userRouter.post("/:id/update", usersController.usersUpdatePost);
userRouter.post("/create", usersController.usersCreatePost);
userRouter.post("/:id/delete", usersController.usersDeletePost);
module.exports = userRouter;
