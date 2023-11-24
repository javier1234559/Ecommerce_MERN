"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
function fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Images only!'), false);
    }
}
const upload = (0, multer_1.default)({ storage, fileFilter });
const uploadSingleImage = upload.single('image');
router.post('/', (req, res) => {
    uploadSingleImage(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        res.status(200).send({
            message: 'Image uploaded successfully',
            image: `/${req.file.path}`,
        });
    });
});
exports.default = router;
