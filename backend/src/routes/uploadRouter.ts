import path from "path";
import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req: Request, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    throw new Error("Images only!");
  }
};

const options = {
  storage,
  fileFilter,
};
const upload = multer(options);
const uploadSingleImage = upload.single("image");

router.post("/", (req: Request, res: Response) => {
  uploadSingleImage(req, res, function (err: any) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "File upload failed" });
    }
  });
});
export default router;
