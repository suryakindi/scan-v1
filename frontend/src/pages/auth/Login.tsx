import { FC, FormEventHandler, useEffect } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router";
import Fallback from "../../components/Fallback";
import { useXState } from "../../utils/hooks";

type LoginPayloadT = {
  username: string;
  password: string;
};

type LoginResponseT = ResponseT<{ user: UserT; token: string }>;

const Login: FC = () => {
  const navigate = useNavigate();
  const [form, setForm, formFn] = useXState<LoginPayloadT, LoginResponseT>(
    { username: "", password: "" },
    { url: "/auth/login-user", method: "POST" }
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await formFn.submit();
      localStorage.setItem("token", response.data.token);
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
        }
      };

      validate();
    };
  }, [navigate]);

  return (
    <>
      {formFn.status === "loading" && <Fallback />}
      <div className="flex flex-col max-w-1/6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col p-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="border"
              value={form.username}
              onChange={({ target: { value } }) => setForm({ username: value })}
            />
          </div>
          <div className="flex flex-col p-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border"
              value={form.password}
              onChange={({ target: { value } }) => setForm({ password: value })}
            />
          </div>
          <div className="flex flex-col p-2">
            <button
              type="submit"
              className="border"
              disabled={formFn.status === "loading"}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
