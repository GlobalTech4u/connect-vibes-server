import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinary } from "./cloudinary.lib.js";
import { CLOUDINARY_STORAGE_FOLDER } from "../constants/common.constants.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CLOUDINARY_STORAGE_FOLDER,
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
  },
});

const upload = multer({ storage: storage });

export { upload };
