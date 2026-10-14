import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), 'public', 'posts');

// Ensure the upload directory exists at startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})


const fileFilter = (req: any, file: any, callback: any) => {

  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video'))
    callback(null, true);
  else
    callback(null, false);

}

export const uploadSingleFile = (req: any, res: any, next: any) => {

  let type: string = ''
  if (req.params.type === 'image')
    type = 'image'
  else if (req.params.type === 'video')
    type = 'video'

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
  }).single(type);

  upload(req, res, (err: any) => {
    if (err) {
      return next(err)
    }
    next()
  })

}






export const upload = multer({ storage: storage });