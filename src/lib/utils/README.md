# Shared utilities

Thư mục này dành cho utility thuần dùng chung giữa nhiều consumer đã tồn tại.

## Policy

- Chỉ thêm utility khi đã có consumer thực tế và behavior có thể mô tả rõ.
- Utility phải thuần, có input/output rõ ràng và không chứa business rule của feature.
- Không truy cập database, Redis, secret hoặc request state từ utility thuần.
- Type dùng riêng cho một feature nên đặt gần feature đó; chỉ đưa type vào `src/types` khi có từ
  hai consumer trở lên.
- Utility dùng được ở client và server phải không phụ thuộc module server-only; utility server-only
  cần được đánh dấu và đặt boundary rõ ràng.
- Khi utility có behavior, bổ sung unit test cùng task/feature sử dụng nó.

Hiện chưa có runtime utility nào được tạo vì repository chưa có consumer phù hợp. README này giữ
boundary và policy cho các phase sau, tránh tạo abstraction dự phòng không có nhu cầu thực tế.
