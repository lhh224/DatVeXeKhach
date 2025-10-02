# Repository Instructions for Bus Ticket Booking System

## 1. Ngôn ngữ phản hồi

- Luôn **trả lời bằng tiếng Việt** trong mọi gợi ý code, chat, giải thích.
- Nếu sinh code, hãy kèm comment giải thích bằng tiếng Việt.

## 2. Tổng quan dự án

- Hệ thống **đặt vé xe khách trực tuyến**, tương tự vexere.com.
- Chức năng chính:
  - Tìm kiếm tuyến/chuyến, lọc theo hãng xe, loại xe.
  - Quản lý ghế theo **chặng giữa** (giữa các điểm dừng).
  - Đặt nhiều ghế trong một lần.
  - Thanh toán bằng **QR ngân hàng của nhà xe**: hiển thị mã QR sau khi khách chọn ghế và bấm thanh toán.
  - Phát hành vé PDF có mã QR vé.
  - Quản trị đa nhà xe (multi-tenant), phân quyền.
  - Hỗ trợ khách hàng bằng **chat box AI**.
- Công nghệ chính:
  - **Frontend:** Next.js (React, TypeScript), TailwindCSS, React Query.
  - **Backend:** NestJS (TypeScript), kiến trúc module.
  - **CSDL:** SQL Server (mssql driver).
  - **Cache/lock:** Redis (giữ ghế, cache chuyến).
  - **Jobs:** BullMQ (gửi email, SMS, dọn lock, đối soát thanh toán).
  - **Triển khai:** Docker, CI/CD GitHub Actions.

## 3. Quy tắc code

- Dùng **TypeScript strict mode**.
- React component phải là **functional component**, dùng hooks chuẩn.
- Validate input bằng **zod** hoặc `class-validator`.
- Luôn viết API RESTful, chuẩn hóa response và mã lỗi.
- Tất cả logic đặt/giữ ghế phải gọi thủ tục `sp_LockSeats` và `sp_ConfirmPayment`.
- Đảm bảo transaction với mức cách ly **SERIALIZABLE** để tránh race condition.
- Khi sinh code thanh toán QR:
  - Tạo payload chuẩn **VietQR/EMV** (số tài khoản, ngân hàng, số tiền, nội dung = mã đơn).
  - Hiển thị QR bằng thư viện `qrcode` hoặc tương đương.
- Vé PDF tạo bằng `pdfkit` hoặc Puppeteer; kèm mã QR vé.

## 4. Hướng dẫn đặc biệt cho Copilot

- Khi gợi ý code hoặc giải thích: **luôn dùng tiếng Việt**, kể cả comment trong code.
- Khi gợi ý test case: mô tả kịch bản bằng tiếng Việt.
- Khi gợi ý cấu trúc API: endpoint, body, response đều có mô tả tiếng Việt.
- Khi viết stored procedure (T-SQL cho SQL Server): giải thích bằng tiếng Việt cách hoạt động.
- Khi viết logic AI chat: mô tả cách gọi API, tích hợp LLM, và dùng tiếng Việt trong câu trả lời mẫu cho khách.

## 5. Cấu trúc thư mục dự kiến

- `/apps/web` — frontend Next.js (khách + quản trị)
- `/apps/api` — backend NestJS
- `/db` — migration SQL Server, seed
- `/jobs` — BullMQ workers
- `/docs` — tài liệu kỹ thuật
- `.github/workflows` — CI/CD pipelines
- `.github/copilot-instructions.md` — file hướng dẫn này

## 6. Cách dùng

- File này được GitHub Copilot tham chiếu tự động khi sinh code/gợi ý trong repo.
- Nếu có mâu thuẫn với chỉ dẫn cá nhân, **chỉ dẫn cá nhân** sẽ ưu tiên hơn.
- Có thể tạm tắt repository instructions trong settings Copilot nếu cần.
