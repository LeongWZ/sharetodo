import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import NavigationBar from "../components/NavigationBar";
import ErrorPage from "../components/ErrorPage";

export const Route = createRootRouteWithContext()({
  component: Root,
  errorComponent: ErrorPage,
});

function Root() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
