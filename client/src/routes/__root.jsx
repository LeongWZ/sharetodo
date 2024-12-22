import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import NavigationBar from '../../components/NavigationBar';


export const Route = createRootRouteWithContext()({
  component: Root
})

function Root() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}