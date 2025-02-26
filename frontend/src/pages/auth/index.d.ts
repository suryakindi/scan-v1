type LoginPayloadT = {
  username: string;
  password: string;
};

type LoginResponseT = ResponseT<{ user: UserT; token: string }>;
