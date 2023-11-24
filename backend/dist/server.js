"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = __importDefault(require("./config/database"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const uploadRouter_js_1 = __importDefault(require("./routes/uploadRouter.js"));
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
// -------------------------------------------
// STEP TO CREATE SERVER API
// 1. Initialize configuration variables, import necessary modules, and connect to the database 
// 2. Base server config (config json(), config cor() ,..)
// 3. Define middleware (authen(), validate() ,...)
// 4  Define router
// 5. Start server
// --------------------------------------------
// 1. Initialize configuration variables, import necessary modules, and connect to the database 
const port = process.env.PORT || 5000;
(0, database_1.default)();
// 2. Base server config (config json(), config cor() ,..)
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// // 3. Define middleware (authen(), validate() ,...)
// // 4  Define router and errorHandler
app.use('/api/products', productRoutes_js_1.default);
app.use('/api/users', userRoutes_js_1.default);
app.use('/api/orders', orderRoutes_js_1.default);
app.use('/api/upload', uploadRouter_js_1.default);
app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));
if (process.env.NODE_ENV === 'production') {
    const __dirname = path_1.default.resolve();
    app.use('/uploads', express_1.default.static('/var/data/uploads'));
    app.use(express_1.default.static(path_1.default.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) => res.sendFile(path_1.default.resolve(__dirname, 'frontend', 'build', 'index.html')));
}
else {
    const __dirname = path_1.default.resolve();
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}
app.use(errorMiddleware_js_1.notFound);
app.use(errorMiddleware_js_1.errorHandler);
// 5. Start server
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));
