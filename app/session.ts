import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  authToken: string;
};

const sessionExpirationTime = 2 * 24 * 60 * 60 * 1000;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: sessionExpirationTime,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
