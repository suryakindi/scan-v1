import { FC, FormEventHandler, useEffect, useState } from "react";
import loginImage from "../../assets/images/login.png";
import { useNavigate } from "react-router";
import { api, ResponseT } from "../../utils/api";
import { AuthObject, Role } from "../../utils/global-types";
import Fallback from "../base/fallback";

type LoginPayload = { username: string; password: string };
type LoginResponse = {
  data: {
    id: number;
    name: string;
    role: Role;
  };
  token: string;
};

const Login: FC = () => {
  const navigate = useNavigate();
  const [isProcess, setIsProcess] = useState<boolean>(true);

  const [payload, setPayload] = useState<LoginPayload>({
    username: "",
    password: "",
  });

  const login: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();

      const response = await api.post<ResponseT<LoginResponse>>(
        "/auth/login-user",
        payload
      );

      if (response.data.data) {
        localStorage.setItem("token", response.data.data.token);
        navigate("/");
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data } = await api.get<AuthObject>("/check-token", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (data) {
          navigate("/");
        }
      } catch (error) {
        console.log("Token invalid, stay on login page.", error);
      } finally {
        setIsProcess(false);
      }
    };

    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isProcess) {
    return <Fallback />;
  } else {
    return (
      <div className="grid grid-cols-[3fr_2fr] p-5 gap-5 min-h-screen">
        <div className="grid h-full rounded-xl overflow-hidden">
          <img
            src={loginImage}
            alt="login.."
            className="object-contain h-full w-full"
          />
        </div>

        <form
          onSubmit={login}
          className="flex flex-col h-full justify-center rounded-xl overflow-hidden p-40"
        >
          <span className="text-xl">Account</span>
          <span className="text-5xl font-bold">Sign in to your account</span>
          <div className="py-10 flex flex-col gap-5">
            <div className="relative h-fit">
              <input
                type="text"
                id="username"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 placeholder-shown:border-gray-400 appearance-none focus:outline-none peer hover:border-black focus:hover:border-indigo-700 focus:border-indigo-700 focus:ring focus:ring-inset focus:ring-indigo-700"
                placeholder=""
                value={payload.username}
                onChange={({ currentTarget: { value } }) =>
                  setPayload((prev) => ({
                    ...prev,
                    username: value,
                  }))
                }
              />
              <label
                htmlFor="username"
                className="absolute text-sm peer-placeholder-shown:text-gray-400 duration-100 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-hover:text-black peer-focus:text-indigo-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
              >
                Username
              </label>
            </div>
            <div className="relative h-fit">
              <input
                type="password"
                id="password"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 placeholder-shown:border-gray-400 appearance-none focus:outline-none peer hover:border-black focus:hover:border-indigo-700 focus:border-indigo-700 focus:ring focus:ring-inset focus:ring-indigo-700"
                placeholder=""
                value={payload.password}
                onChange={({ currentTarget: { value } }) =>
                  setPayload((prev) => ({
                    ...prev,
                    password: value,
                  }))
                }
              />
              <label
                htmlFor="password"
                className="absolute text-sm peer-placeholder-shown:text-gray-400 duration-100 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-hover:text-black peer-focus:text-indigo-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
              >
                Password
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="cursor-pointer bg-indigo-700 text-white px-10 py-2.5 rounded-lg flex items-center gap-2"
              >
                <span>Login</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default Login;
