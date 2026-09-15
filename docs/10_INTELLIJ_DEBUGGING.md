# Debug backend Next.js trong Docker bằng IntelliJ IDEA

## Mục tiêu

Chỉ dùng một cấu hình IntelliJ: `Next.js Docker - Debug Backend`.

Khi nhấn **Debug**, IntelliJ tuần tự:

1. chạy `docker:debug:backend` để khởi động Compose development;
2. script chờ Node Inspector trong container sẵn sàng ở `127.0.0.1:9229`;
3. attach vào process Next.js server với mapping source host đến `/app` trong container.

Vì bước attach chỉ bắt đầu sau khi Inspector sẵn sàng, không có race condition giữa Docker startup
và IntelliJ. App luôn chạy trong Docker; IntelliJ không chạy `next dev` trên máy host.

## Chuẩn bị một lần

1. Mở đúng thư mục root của repository bằng IntelliJ IDEA Ultimate.
2. Bật các plugin `Node.js` và `JavaScript Debugger`.
3. Kiểm tra Docker Desktop đang chạy tại `Settings | Build, Execution, Deployment | Docker`.
4. Nếu cần override development riêng, tạo `docker/.env.dev`. Script nạp example trước rồi override
   bằng file local, vì vậy file local chỉ cần các giá trị muốn thay đổi. Không đổi `DEBUG_PORT`;
   workflow một nút dùng cố định `9229`.

IntelliJ tự nhận hai shared configuration trong `.run/` sau khi mở lại project hoặc đồng bộ Run
Configurations:

| Configuration                              | Vai trò                                  |
| ------------------------------------------ | ---------------------------------------- |
| `Next.js Docker - Start Backend Inspector` | Before-launch task, không chạy trực tiếp |
| `Next.js Docker - Debug Backend`           | Cấu hình duy nhất cần chọn và nhấn Debug |

## Debug breakpoint backend

1. Đặt breakpoint trong Route Handler (`src/app/api/**/route.ts`), module `src/server/**`, repository,
   service, Prisma hoặc Server Component.
2. Chọn `Next.js Docker - Debug Backend` ở góc trên phải IntelliJ.
3. Nhấn biểu tượng **Debug**.
4. Chờ Debug tool window hiện `Node Inspector is ready` và debugger attach.
5. Gọi route hoặc thao tác UI làm chạy backend code. IntelliJ sẽ dừng tại breakpoint.

Test không cần đăng nhập: đặt breakpoint tại `src/app/api/health/route.ts`, sau đó mở
`http://localhost:3000/api/health`.

Các file có `"use client"` là React chạy trong browser, không thuộc backend debugger này. Debug chúng
bằng JavaScript Debug/Chrome riêng.

## Cấu hình kỹ thuật

- Compose chạy `pnpm dev --inspect=0.0.0.0:9229`.
- Chỉ host loopback publish Inspector: `127.0.0.1:9229:9229`; cổng không mở ra LAN.
- IntelliJ attach tại `localhost:9229`, tự reconnect khi Fast Refresh restart server.
- Path mapping: local `$PROJECT_DIR$` → remote `file:///app/`.
- `scripts/intellij/start-backend-debug.mjs` chạy `docker compose up --build --detach app` và chỉ hoàn tất
  khi `/json/list` trả Node debug target.

## Dừng môi trường

Debugger IntelliJ chỉ detach; Docker vẫn chạy để giữ hot reload. Khi muốn dừng hẳn:

```bash
pnpm docker:dev:down
```

Không dùng `down -v` trừ khi chủ động muốn xóa volumes MySQL, Redis, dependency và cache development.

## Xử lý lỗi

| Hiện tượng                                        | Kiểm tra                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Before-launch task báo timeout 90 giây            | `docker compose --env-file docker/.env.dev -f docker-compose.yml logs app`         |
| IntelliJ không thấy configuration                 | đóng/mở lại project; xác nhận plugin Node.js được bật và `.run/` không bị excluded |
| Breakpoint server màu xám                         | xác nhận mapping `$PROJECT_DIR$` → `file:///app/`, sau đó stop/debug lại           |
| Breakpoint không hit trong file có `"use client"` | đây là browser code, không phải backend Node process                               |
