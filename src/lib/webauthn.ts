import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { nanoid } from "nanoid";
import { getWebAuthnConfig } from "@/lib/env";
import {
  addWebAuthnCredential,
  clearWebAuthnChallenge,
  getWebAuthnChallenge,
  getWebAuthnCredentialByCredentialId,
  listWebAuthnCredentials,
  saveWebAuthnChallenge,
  updateWebAuthnCounter,
} from "@/lib/store";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

export async function beginRegistration(userId: string, email: string) {
  const { rpName, rpID } = getWebAuthnConfig();
  const existing = listWebAuthnCredentials(userId);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: email,
    userID: new TextEncoder().encode(userId),
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({
      id: c.credentialId,
      transports: c.transports?.split(",") as AuthenticatorTransport[] | undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  saveWebAuthnChallenge({
    userId,
    challenge: options.challenge,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
  });

  return options;
}

export async function finishRegistration(
  userId: string,
  tenantId: string,
  response: unknown,
) {
  const { rpID, origin } = getWebAuthnConfig();
  const challengeRow = getWebAuthnChallenge(userId);
  if (!challengeRow) {
    throw new Error("Challenge expired");
  }

  const verification = await verifyRegistrationResponse({
    response: response as Parameters<typeof verifyRegistrationResponse>[0]["response"],
    expectedChallenge: challengeRow.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("Registration failed");
  }

  const { credential } = verification.registrationInfo;
  addWebAuthnCredential({
    id: nanoid(),
    userId,
    tenantId,
    credentialId: credential.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    transports: credential.transports?.join(",") ?? null,
  });

  clearWebAuthnChallenge(userId);
  return true;
}

export async function beginAuthentication(userId: string) {
  const { rpID } = getWebAuthnConfig();
  const creds = listWebAuthnCredentials(userId);

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: creds.map((c) => ({
      id: c.credentialId,
      transports: c.transports?.split(",") as AuthenticatorTransport[] | undefined,
    })),
    userVerification: "preferred",
  });

  saveWebAuthnChallenge({
    userId,
    challenge: options.challenge,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
  });

  return options;
}

export async function finishAuthentication(userId: string, response: unknown) {
  const { rpID, origin } = getWebAuthnConfig();
  const challengeRow = getWebAuthnChallenge(userId);
  if (!challengeRow) {
    throw new Error("Challenge expired");
  }

  const credId = (response as { id?: string })?.id;
  if (!credId) throw new Error("Missing credential");

  const stored = getWebAuthnCredentialByCredentialId(credId);
  if (!stored || stored.userId !== userId) {
    throw new Error("Unknown credential");
  }

  const verification = await verifyAuthenticationResponse({
    response: response as Parameters<typeof verifyAuthenticationResponse>[0]["response"],
    expectedChallenge: challengeRow.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: stored.credentialId,
      publicKey: Buffer.from(stored.publicKey, "base64url"),
      counter: stored.counter,
    },
  });

  if (!verification.verified) {
    throw new Error("Authentication failed");
  }

  updateWebAuthnCounter(
    stored.id,
    verification.authenticationInfo.newCounter,
  );
  clearWebAuthnChallenge(userId);
  return true;
}
