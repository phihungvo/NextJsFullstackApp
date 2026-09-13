# Redis infrastructure

Server-only Redis client/configuration boundary cho cache, rate limiting và temporary data phù hợp.
Redis không thay thế MySQL làm nguồn dữ liệu chính. Login rate limiting dùng Redis và fail-closed khi
Redis không khả dụng; không dùng in-memory fallback trong production.
