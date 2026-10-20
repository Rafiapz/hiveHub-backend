import multer from "multer";

// Use memoryStorage so buffers can be piped directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, callback: any) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video"))
    callback(null, true);
  else callback(null, false);
};

export const uploadSingleFile = (req: any, res: any, next: any) => {
  let type: string = "";
  if (req.params.type === "image") type = "image";
  else if (req.params.type === "video") type = "video";

  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB to support video uploads
    fileFilter,
  }).single(type);

  upload(req, res, (err: any) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

export const upload = multer({ storage });