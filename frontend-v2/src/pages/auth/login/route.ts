import { RouteObject } from "react-router";
import Login from ".";
import services from "./services";

const route: RouteObject = {
  path: "/login",
  Component: Login,
  loader: services.loader,
};

export default route;
