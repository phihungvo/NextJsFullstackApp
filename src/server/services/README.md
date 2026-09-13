# Services

Service layer điều phối business use case. Service không được đưa vào Client Component và không để
Route Handler trở thành nơi chứa business logic.

P05 có service cho Product, User, Role và Permission. Service map Prisma record thành DTO an toàn,
chuẩn hóa lỗi not-found/conflict, hash password khi tạo/cập nhật user, bảo vệ system role và điều phối
soft-delete/session revoke cho user.
