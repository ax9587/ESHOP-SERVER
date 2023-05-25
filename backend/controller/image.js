const Image64 = require("../model/image");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();



// get image content
router.get(
  "/get-image-content/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const Image=await Image64.findById(req.params.id);
      console.log( Image);
     
      res.status(200).json(
        Image.imageBase64
      );
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);



module.exports = router;
