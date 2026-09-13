# Validation

Shared validation boundary. Zod schemas được đặt tại `src/server/api/schemas.ts` cho contract server dùng
chung; field-error mapping nằm tại `src/lib/validation/zod.ts`. Backend luôn validate lại input từ client,
bao gồm payload, resource id, pagination, search, filter và sorting.
