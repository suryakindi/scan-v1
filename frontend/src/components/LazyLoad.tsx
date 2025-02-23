import { ComponentType, lazy, Suspense } from "react";
import Fallback from "./Fallback";

const LazyLoad = (load: () => Promise<{ default: ComponentType }>) => {
  const Component = lazy(load);
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
};

export default LazyLoad;
