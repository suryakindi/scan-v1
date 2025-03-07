import { ComponentType, lazy } from "react";

const LazyLoad = (load: () => Promise<{ default: ComponentType }>) => {
  const Component = lazy(load);
  return <Component />;
};

export default LazyLoad;
