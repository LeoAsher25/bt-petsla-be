export type JwtPayload = {
  email: string;
  sub: string; // _id
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
