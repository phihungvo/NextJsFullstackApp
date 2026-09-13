export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEALTH_RESPONSE = {
  status: "ok",
  checks: {
    application: "ok",
  },
} as const;

export function GET(): Response {
  return Response.json(
    {
      ...HEALTH_RESPONSE,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
