import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) throw new Error("JWT_SECRET missing in .env.local");

export type JwtPayload = {
  sub: string; // userId
  role: "admin" | "editor";
  email: string;
};

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
