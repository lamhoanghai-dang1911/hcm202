# 🚀 HƯỚNG DẪN TRIỂN KHAI (DEPLOY) GAME HCM202

Hệ thống ôn tập **Tư Tưởng Hồ Chí Minh (HCM202)** đã được cấu hình sẵn sàng để triển khai lên các nền tảng đám mây.

---

## 📌 LƯU Ý QUAN TRỌNG VỀ ĐẶC THÙ CỦA DỰ ÁN

Dự án này gồm 2 phần:
1. **Frontend (Giao diện web)**: 15 câu hỏi trắc nghiệm, 3 màn ghép tranh 3x3, bảng vinh danh, âm thanh và hiệu ứng pháo hoa.
2. **Backend Real-time (Socket.IO + Express)**: Quản lý phòng chờ, khóa phòng thi đấu khi Admin bấm Bắt đầu, đua thanh tiến trình trực tiếp trên máy chiếu, tính thời gian hoàn thành chính xác từng mili-giây.

> ⚠️ **Đặc thù nền tảng Vercel:**  
> Vercel là nền tảng **Serverless (Edge / Stateless)**:
> - **Khi deploy lên Vercel:** Giao diện web tải cực nhanh toàn cầu. Người chơi có thể vào nhập tên và chơi **chế độ Tự ôn tập cá nhân (Solo Mode)** hoàn chỉnh, tính giờ và vinh danh bình thường.
> - **Tuy nhiên, tính năng phòng đấu nhiều người thời gian thực (Socket.IO)** kết nối giữa Màn hình Admin và hàng chục/hàng trăm điện thoại khán giả cần một máy chủ **Node.js chạy liên tục (Persistent Server)** để giữ kết nối WebSocket. Serverless của Vercel sẽ tự đóng sau vài giây nên không duy trì được phòng thi đấu realtime.

---

## 🅰️ CÁCH 1: DEPLOY LÊN VERCEL (Theo yêu cầu của bạn)

File cấu hình [`vercel.json`](./vercel.json) và [`api/index.js`](./api/index.js) đã được thiết lập chuẩn 100%.

### Cách 1.1: Deploy qua GitHub (Khuyên dùng, dễ cập nhật)
1. Đẩy mã nguồn lên một repository trên GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "HCM202 Quiz & Puzzle Game"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Nhấp vào nút **"Add New..."** ➔ Chọn **"Project"**.
4. Chọn repository GitHub vừa tạo và nhấp **"Import"**.
5. Giữ nguyên các cài đặt mặc định (Framework Preset: *Other*, Root Directory: `./`) và nhấn **"Deploy"**.
6. Sau khoảng 30 giây, Vercel sẽ cấp cho bạn một tên miền miễn phí (ví dụ: `https://game-hcm202.vercel.app`).

### Cách 1.2: Deploy trực tiếp bằng lệnh Vercel CLI
Nếu bạn đã cài Node.js, chỉ cần mở Terminal tại thư mục này và chạy:
```bash
npx vercel
```
- Đăng nhập tài khoản Vercel theo hướng dẫn trên màn hình.
- Nhấn `Enter` để chọn các thiết lập mặc định.
- Chạy tiếp `npx vercel --prod` để phát hành bản chính thức.

---

## 🅱️ CÁCH 2: DEPLOY LÊN RENDER.COM (KHUYÊN DÙNG CHO CHẾ ĐỘ HỘI THƯỜNG / ADMIN)

Để tổ chức hội thi trên máy chiếu với hàng trăm khán giả quét mã QR cùng lúc, **Render.com** là giải pháp tối ưu nhất (100% Miễn phí, hỗ trợ đầy đủ WebSocket Socket.IO 24/7). Dự án đã có sẵn file [`render.yaml`](./render.yaml).

### Các bước thực hiện:
1. Đẩy code lên GitHub (tương tự như Cách 1.1).
2. Truy cập [render.com](https://render.com) và đăng nhập (bằng GitHub).
3. Nhấp vào nút **"New +"** ➔ Chọn **"Web Service"** (hoặc chọn **"Blueprint"** để Render tự đọc file `render.yaml`).
4. Kết nối tới repo GitHub của bạn.
5. Cấu hình cơ bản:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
6. Nhấp **"Create Web Service"**.
7. Render sẽ tự động cấp một đường dẫn HTTPS (ví dụ: `https://game-hcm202.onrender.com`).
   - Mã QR trên trang Admin (`/admin`) sẽ **tự động sinh theo tên miền này**, khán giả dùng 4G hoặc Wi-Fi bất kỳ đều quét vào thi đấu được ngay!

---

## 🅲 CÁCH 3: CHẠY TRỰC TIẾP TRÊN MẠNG WI-FI / MÁY CHIẾU TẠI HỘI TRƯỜNG (Không cần Internet mạnh)

Nếu hội thi diễn ra tại hội trường, bạn chỉ cần dùng chính máy tính xách tay của mình:
1. Kết nối laptop vào Wi-Fi của hội trường / lớp học.
2. Mở Terminal tại thư mục dự án và chạy:
   ```bash
   npm start
   ```
3. Màn hình console sẽ in ra đường link mạng nội bộ, ví dụ:
   ```
   [LOCAL]       http://localhost:3000
   [LAN / WI-FI] http://192.168.1.9:3000
   [ADMIN URL]   http://192.168.1.9:3000/admin (PIN: 1234)
   ```
4. Cắm máy chiếu vào laptop, mở trình duyệt vào link `http://localhost:3000/admin`, nhập mã PIN `1234`.
5. Màn hình lớn sẽ hiện mã QR to rõ. Tất cả khán giả kết nối cùng Wi-Fi giơ điện thoại quét mã QR là vào phòng chờ tức thì với độ trễ siêu thấp (ping < 1ms)!
