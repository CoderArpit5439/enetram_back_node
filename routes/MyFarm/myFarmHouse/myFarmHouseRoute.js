import express from "express";
import upload from "../../../config/multerConfig.js";
import {
  addFarmHouse,
  updateFarmHouse,
  deleteFarmHouse,
  getFarmHouseById,

  getAllFarmHouses
} from "../../../controller/MyFarm/MyFarmHouse/MyFarmHouseController.js";

import { authenticate } from "../../../middleware/auth.js";

const myFarmHouseRoute = express.Router();

myFarmHouseRoute.post(
  "/add-farmhouse",
  upload.fields([
    { name: "front_image", maxCount: 1 },
    { name: "slider_images", maxCount: 20 }
  ]),
  addFarmHouse
);

myFarmHouseRoute.put(
  "/update-farmhouse/:id",
  upload.fields([
    { name: "front_image", maxCount: 1 },
    { name: "slider_images", maxCount: 20 }
  ]),
  updateFarmHouse
);

myFarmHouseRoute.delete("/delete-farmhouse/:id",authenticate, deleteFarmHouse);

myFarmHouseRoute.get("/single-farmhouse/:id",authenticate, getFarmHouseById);

myFarmHouseRoute.get("/get-all-farmhouse/:user_id",authenticate, getAllFarmHouses);


export default myFarmHouseRoute;
