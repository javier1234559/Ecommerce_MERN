import uploadSingleImage from "../utils/uploadFile";
import { Request, Response } from "express";

class UploadController {

  uploadImage(req: Request, res: Response) {
    uploadSingleImage(req, res, (err: any) => {
      if (err) {
        res.status(400).send({ message: err.message });
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
  }
}

export default UploadController;
