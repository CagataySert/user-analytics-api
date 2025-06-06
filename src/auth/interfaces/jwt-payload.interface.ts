export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
