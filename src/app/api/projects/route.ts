import { enforceCors, jsonError, jsonOk } from "@/lib/api";
import { listProjectsForUser } from "@/lib/authorization";
import { sanitizePlainText } from "@/lib/sanitize";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) {
    return jsonError(401, "unauthenticated", origin);
  }

  const projects = listProjectsForUser(session).map((p) => ({
    id: p.id,
    title: sanitizePlainText(p.title),
    summary: sanitizePlainText(p.summary),
    phase: sanitizePlainText(p.phase),
  }));

  return jsonOk({ projects }, origin);
}
