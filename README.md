
## Hướng dẫn cài đặt :



Cài đặt git và chạy lệnh sau đây để tải project
```shell
git clone https://github.com/javier1234559/Ecommerce_MERN
```

Di chuyển vào thư mục gốc chạy và chạy lênh `npm install`

```shell
cd Ecommerce_MERN
npm install
```

Di chuyển vào thư mục frontend dùng lệnh “npm install” để tải các package cần thiết cho phần client


```shell
cd frontend
npm install
```

Sau đó `cd ..` trở về thư mục gốc

Tạo file .env ở thư mục gốc và thêm vào các cấu hình cần thiết

```shell
NODE_ENV=DEVELOPMENT
# PAGINATION_LIMIT= 5
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=<secreckey>
PAYPAL_CLIENT_ID= <client id của paypal>
PAYPAL_APP_SECRET= <secret key của paypal>
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```


Chạy lệnh `npm run data:import` để thêm data mẫu vào database hoặc `npm run data:destroy` để hủy data trước đó

Di chuyển vào thư mục gốc dùng lệnh `npm run dev` để chạy projec
