import express from 'express';
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js"; //importing protectRoute from auth middleware


const router = express.Router();

// create
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    //save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ message: err.message });
  }
});

//const response = await fetch("https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY&query=books");

//pagination => infinite scroll
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = (await Book.find().sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage")).filter(book => book.user !== null);

    const total = await Book.countDocuments();
    res.send({
        books,
        currentPage: page,
        totalBooks: total,
        totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: err.message });
  }
});

// get recomended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: err.message });
  }
});

// delete
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const bookId = await Book.findById(req.params.id);
    if (!bookId) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (bookId.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this book" });
    }
    // delete the image from cloudinary
    if (bookId.image && bookId.image !== "") {
      try {
        const publicId = bookId.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        return res.status(500).json({ message: "Error deleting image from Cloudinary" });
      }
    }
    await Book.deleteOne({ _id: req.params.id }); // <-- fix: pass filter to deleteOne
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;