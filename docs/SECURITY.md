# Security architecture (prototype)

This prototype uses **in-memory storage** only (no database). Data resets when the server restarts. Application-layer controls remain for demonstration.

| Control | Location |
|--------|----------|
| BOLA / IDOR defense | `src/lib/authorization.ts` |
| Argon2id passwords | `src/lib/password.ts` |
| Secure session cookies | `src/lib/session.ts` |
| WebAuthn MFA | `src/lib/webauthn.ts` |
| XSS mitigation | React + `src/lib/sanitize.ts` |
| CSP, HSTS, frame denial | `src/middleware.ts` |
| CSRF | `src/lib/session.ts` |
| Rate limiting | `src/lib/rate-limit.ts`, middleware |
| CORS allowlist | `src/lib/cors.ts` |
| Audit buffer (memory) | `src/lib/audit.ts` |

For production, add a real database, WAF, DDoS protection, and TLS at the edge.
