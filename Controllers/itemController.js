const Items = require("./../Models/itemModel");
const { uploadProductImage } = require("./../Middlewares/multer");
const cloudinary = require("./../Utils/cloudinary");

exports.uploadItemImage = uploadProductImage.fields([
  { name: "itemImage", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]);

exports.uploadAndResizeProductImage = async (req, res, next) => {
  try {
    if (JSON.stringify(req.files) === "{}") {
      return next();
    }
    const { itemImage, image1, image2, image3 } = req.files;
    if (!itemImage || !image1 || !image2 || !image3) {
      throw new Error("please upload all image");
    }
    const imagesArray = [...itemImage, ...image1, ...image2, ...image3];
    let url = [];

    const newPath = imagesArray.map(async (file) => {
      const { path } = file;
      await cloudinary.uploader.upload(
        path,
        { folder: "uploads/products" },
        (error, result) => {
          if (error) {
            res.status(500);
            //  .json({ message: "An error occured while uploading image" });
            next({ message: "An error occured while uploadin an image" });
          }
          if (result) {
            url.unshift(result.secure_url);
          }
        }
      );
    });

    const results = await Promise.all(newPath);
    imagesArray.forEach((file, index) => (file.filename = url[index]));
    next();
  } catch (error) {
    res.status(500);
    next(error);
  }
};

//create item
exports.createItem = async (req, res, next) => {
  try {
    const { itemImage, image1, image2, image3 } = req.files;
    const {
      itemName,
      category,
      quantity,
      itemBrand,
      price,
      weight,
      description,
    } = req.body;
    if (
      !itemName ||
      !category ||
      !quantity ||
      !itemBrand ||
      !price ||
      !weight ||
      !description
    ) {
      throw new Error("All fields are required");
    }
    const body = {
      itemName,
      category,
      quantity,
      itemBrand,
      price,
      weight,
      description,
    };
    if (req.files) {
      body.itemImage = itemImage[0].filename;
      body.images = [
        image1[0].filename,
        image2[0].filename,
        image3[0].filename,
      ];
    }
    // console.log(body)
    const item = await Items.create({ userId: res.user.id, ...body });
    if (!item) throw new Error("there was an error in adding item");
    res.status(200).json({
      status: "success",
      item,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

//Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    //PAGINATION
    // console.log(req.query)
    //     const page= req.query.page *1 || 1;
    //     const limit= req.query.limit *1 || 7;
    //     const skip= (page-1) *limit

    //     // query=query.skip(skip).limit(limit)
    // if(req.query.page){
    //     const numProducts= await Items.countDocuments();
    //     if(skip >= numProducts) throw new Error('This page does not exist');
    // }

    const items = await Items.find().sort("-createdAt");
    if (!items) {
      throw new Error("no item found");
    }
    res.status(200).json({
      status: "success",
      data: {
        items,
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getSimilarProducts = async (req, res, next) => {
  try {
    // console.log(req.query);

    const items = await Items.find()
      .where("category")
      .equals(req.query.category)
      .limit(6)
      .sort("-createdAt");
    if (!items) {
      throw new Error("no item found");
    }
    res.status(200).json({
      status: "success",
      data: {
        items,
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
//Update Item
exports.updateItem = async (req, res, next) => {
  try {
    // console.log(req.body)
    const { id } = req.params;
    const updatedItem = await Items.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedItem) {
      throw new Error("item not found");
    }
    res.status(200).json({
      status: "success",
      updatedItem,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

//Delete Item
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedItem = await Items.findByIdAndDelete(id);
    if (!deletedItem) throw new Error("item not found");
    res.status(200).send(null);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

//Get single Item
exports.getSingleItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Items.findById(id);
    if (!item) throw new Error("Item not found");
    res.status(200).json({
      status: "success",
      item,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.searchItem = async (req, res, next) => {
  try {
    const { key } = req.params;

      const products = await Items.aggregate(
        [
          {
            $search: {
              index: "default",
              text: {
                query: key,
                path: {
                  wildcard: "*"
                }
              }
            }
          }
        ]
      );    if (!products) {
      throw new Error("no item found");
    }
    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
