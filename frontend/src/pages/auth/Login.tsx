import { FC, FormEventHandler } from "react";
import { useXState } from "../../utils/api";
import { useNavigate } from "react-router";
import * as HeroOutline from "@heroicons/react/24/outline";
import { Alert } from "../../utils/alert";

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
      Alert.fire({
        title: "Gagal",
        text: "username atau password salah",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="inset-0 bg-blue-200 fixed flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full grid grid-cols-2 p-9 rounded-xl gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <img
              src="/images/logo_bg_transparent.png"
              alt="logo-scan"
              className="w-[70px]"
            />

            <div className="flex flex-col font-bold text-blue-800">
              <span className="text-xl">SCAN Digital</span>
              <span className="text-lg">Nusantara</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold">Selamat datang 👋🏻</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="mb-1 text-sm" htmlFor="username">
                Nama Pengguna
              </label>
              <input
                type="text"
                id="username"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={form.username}
                onChange={({ target: { value } }) =>
                  setForm({ username: value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm" htmlFor="password">
                Kata Sandi
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={form.password}
                onChange={({ target: { value } }) =>
                  setForm({ password: value })
                }
              />
            </div>

            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm flex items-center gap-2"
              >
                <HeroOutline.ArrowRightEndOnRectangleIcon className="size-6" />
                <span>Masuk</span>
              </button>
            </div>
          </form>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="/images/login.png"
            alt="login-gambar"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
