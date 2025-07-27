import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";

type JwtPayload = {
  username: string;
  expiresAt: Date;
};

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);

const loginExpirationSeconds =
  Number(process.env.LOGIN_EXPIRATION_SECONDS) || 3600;
const loginExpirationString = process.env.LOGIN_EXPIRATION_STRING || "1h";
const loginCookieName = process.env.LOGIN_COOKIE_NAME || "loginSession";

export async function hashPassword(rawPassword: string) {
  const hash = await bcrypt.hash(rawPassword, 10);
  const base64 = Buffer.from(hash).toString("base64");
  return base64;
}

export async function checkPassword(rawPassword: string, base64Hash: string) {
  const hash = Buffer.from(base64Hash, "base64").toString("utf-8");
  const isValid = await bcrypt.compare(rawPassword, hash);
  return isValid;
}

export async function createLoginSession(username: string) {
  const expiresAt = new Date(Date.now() + loginExpirationSeconds * 1000);
  const loginSession = await signJwt({ username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, loginSession, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: expiresAt,
  });
}

export async function createLoginSessionFromApi(jwt: string) {
  const expiresAt = new Date(Date.now() + loginExpirationSeconds * 1000);
  const loginSession = jwt;
  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, loginSession, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: expiresAt,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  cookieStore.set(loginCookieName, "", { expires: new Date(0) });
  cookieStore.delete(loginCookieName);
}

export async function signJwt(jwtPayload: JwtPayload) {
  return new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256", typ: "jwt" })
    .setIssuedAt()
    .setExpirationTime(loginExpirationString)
    .sign(jwtEncodedKey);
}

export async function verifyJwt(tokenJwt: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(tokenJwt, jwtEncodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    console.log("Token inválido");
    return false;
  }
}

export async function getLoginSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false;

  return verifyJwt(jwt);
}

export async function getLoginSessionFromApi() {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false;

  return jwt;
}

export async function requireLoginSessionForApiOrRedirect() {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!isAuthenticated) {
    redirect("/login");
  }
}

export async function checkLoginSession() {
  const jwtPayload = await getLoginSession();

  if (!jwtPayload) return false;

  return jwtPayload?.username === process.env.LOGIN_USER;
}

export async function requireLoginOrRedirect() {
  const isAuthenticated = await checkLoginSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}
