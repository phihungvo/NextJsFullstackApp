import type { z } from "zod";

export function zodFieldErrors(error: z.ZodError): Record<string, readonly string[]> {
  const fields = new Map<string, string[]>();

  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "body";
    const messages = fields.get(field) ?? [];
    messages.push(issue.message);
    fields.set(field, messages);
  }

  return Object.fromEntries(fields);
}
