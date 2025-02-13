import { FC } from "react";
import { WrapRoutePropsT } from "./routes";
import { Route } from "react-router";

export const RecursiveRoute = () => (
  <Route path="/w" element={<div>Lorem, ipsum dolor.</div>} />
);
