import { enforceCors, jsonError, jsonOk, clientIp } from "@/lib/api";
import { getProjectForUser } from "@/lib/authorization";
import { sanitizePlainText } from "@/lib/sanitize";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) {
    return jsonError(401, "unauthenticated", origin);
  }

  const { id } = await params;
  const project = getProjectForUser(id, session, clientIp(request));
  if (!project) {
    return jsonError(404, "not_found", origin);
  }

  return jsonOk(
    {
      id: project.id,
      title: sanitizePlainText(project.title),
      summary: sanitizePlainText(project.summary),
      phase: sanitizePlainText(project.phase),
    },
    origin,
  );
}
