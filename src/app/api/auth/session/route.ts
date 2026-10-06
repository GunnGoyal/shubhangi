import { enforceCors, jsonError, jsonOk } from "@/lib/api";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) {
    return jsonError(401, "unauthenticated", origin);
  }

  return jsonOk(
    {
      email: session.email,
      role: session.role,
      mfaEnabled: session.mfaEnabled,
      csrfToken: session.csrfToken,
    },
    origin,
  );
}
