# Configuration

Centralized application configuration. `env.ts` là server-only environment loader dùng Zod để validate
configuration khi được import; không đọc secret trực tiếp trong UI.
