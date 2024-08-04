const express = require("express");
const router = express.Router();
const {
  getAllTrains,
  getTrain,
  addTrain,
  updateTrain,
  deleteTrain,
  getSeatAvailability,
} = require("./../controllers/trainController");

router.route("/").get(getAllTrains).post(addTrain);

router.route("/:id").get(getTrain).patch(updateTrain).delete(deleteTrain);

router.route("/train/:id").get(getSeatAvailability);
module.exports = router;
