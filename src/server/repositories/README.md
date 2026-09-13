# Repositories

Repository layer là boundary truy cập persistence. Prisma query và data-access concern đặt ở đây,
không gọi trực tiếp từ UI.

P05 có repository cho Product, User, Role và Permission. Repository chịu trách nhiệm pagination,
search/filter, whitelist order field, transaction cho quan hệ role/permission và chọn public fields;
không trả `passwordHash`, token hoặc secret.
