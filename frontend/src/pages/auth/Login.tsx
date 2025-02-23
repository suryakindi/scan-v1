import { FC, FormEventHandler, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router";
import Fallback from "../../components/Fallback";

const Login: FC = () => {
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post<
        ResponseT<{ data: UserT; token: string }>
      >("/auth/login-user", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.data.token);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      const validate = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await api.get<
            ResponseT<{
              user: UserT;
              role_permissions: PermissionT;
              user_permissions: PermissionT;
            }>
          >("/check-token", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.data.user) navigate("/");
        } catch (error) {
          console.error(error);
        } finally {
          setIsFetching(false);
        }
      };

      validate();
    };
  }, [navigate]);

  return (
    <>
      {isFetching && <Fallback />}
      <div className="flex flex-col max-w-1/6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col p-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="border"
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
            />
          </div>
          <div className="flex flex-col p-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
          </div>
          <div className="flex flex-col p-2">
            <button type="submit" className="border" disabled={isFetching}>
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
