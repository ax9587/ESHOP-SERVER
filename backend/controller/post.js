const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Post = require("../model/post");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");

// create post
router.post(
  "/create-post",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        const postData = req.body;
        postData.images = imageUrls;
        postData.shop = shop;

        const post = await post.create(postData);

        res.status(201).json({
          success: true,
          post,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all posts of a user
router.get(
  "/get-all-posts-user/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const posts = await Post.find({ userId: req.params.id });

      res.status(201).json({
        success: true,
        posts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete post of a user
router.delete(
  "/delete-user-post/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const postId = req.params.id;

      const postData = await Post.findById(postId);

      postData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const post = await post.findByIdAndDelete(postId);

      if (!post) {
        return next(new ErrorHandler("Post not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Post Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all posts
router.get(
  "/get-all-posts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const posts = await Post.find().sort({createdAt: -1});

      res.status(201).json({
        success: true,
        posts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a post
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, postId, orderId } = req.body;

      const post = await post.findById(postId);

      const review = {
        user,
        rating,
        comment,
        postId,
      };

      const isReviewed = post.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        post.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        post.reviews.push(review);
      }

      let avg = 0;

      post.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      post.ratings = avg / post.reviews.length;

      await post.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": postId }], new: true }
      );      

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
