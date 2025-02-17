import { Button, Field, Input, Label } from "@headlessui/react";
import { FC, FormEventHandler, useEffect, useState } from "react";
import { AppState, slice } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import client from "../../api";
import { isAxiosError } from "axios";
import { PermissionT } from "../../routes";
import { useNavigate } from "react-router";

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.token);
  const { setIsLoading, setToken, setUser, setPermissions } = slice.actions;

  const checkToken = async (token: string | null) => {
    dispatch(setIsLoading(true));
    try {
      const response = await client.get<{
        user: UserT;
        role_permissions: PermissionT[];
        user_permissions: PermissionT[];
      }>("/check-token", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (token !== null) localStorage.setItem("token", token ?? "");
      dispatch(setUser(response.data.user));
      dispatch(setToken(token));
      dispatch(
        setPermissions(
          [response.data.role_permissions, response.data.user_permissions].flat(
            1
          )
        )
      );
      navigate("/");
    } catch (error) {
      if (isAxiosError(error) && error.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    return () => {
      if (token) {
        checkToken(token);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [form, setForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    dispatch(setIsLoading(true));
    try {
      const response = await client.post<
        ApiResponseT<{ data: UserT; token: string }>
      >("/auth/login-user", form);

      checkToken(response.data.data.token);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-2/3 relative">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-40">
          <img src="/login.png" alt="login.png" className="object-cover" />
        </div>
      </div>

      <div className="w-1/3 bg-white flex flex-col justify-center items-center">
        <div>
          <div className="mb-10">
            <h3 className="text-indigo-600 font-bold text-2xl">
              SCAN DIGITAL NUSANTARA
            </h3>
            <p>Welcome To SCAN DIGITAL NUSANTARA ( Company ) 👋!</p>
          </div>

          <form onSubmit={onSubmit}>
            <Field className="mb-2">
              <Label className="text-sm/6">Username</Label>
              <Input
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
                placeholder="Username"
                className="w-full rounded-md border border-indigo-600/70 bg-indigo-600/5 py-1.5 px-3 text-sm/6 text-indigo-600 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-600/25"
              />
            </Field>

            <Field className="mb-4">
              <Label className="text-sm/6">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
                placeholder="Password"
                className="w-full rounded-md border border-indigo-600/70 bg-indigo-600/5 py-1.5 px-3 text-sm/6 text-indigo-600 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-600/25"
              />
            </Field>

            <Button
              disabled={
                form.password.trim() === "" || form.username.trim() === ""
              }
              type="submit"
              className="w-full items-center rounded-md bg-indigo-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-500 data-[open]:bg-indigo-500 cursor-pointer data-[disabled]:bg-indigo-300"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
