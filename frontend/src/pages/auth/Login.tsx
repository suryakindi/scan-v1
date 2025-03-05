import { FC, FormEventHandler } from "react";
import { useXState } from "../../utils/api";
import { useNavigate } from "react-router";

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

  return (
    <>
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
