export type JwtPayload = {
  email: string;
  sub: string; // _id
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
