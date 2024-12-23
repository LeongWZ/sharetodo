import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from 'react-cookie';
import { queryClient } from "./services/queryClient";
import { router } from "./router";
import useToken from "./hooks/useToken";

export default function App() {
  return (
    <CookiesProvider>
      <InnerApp />
    </CookiesProvider>
  );
}

function InnerApp() {
  const [token] = useToken();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ isAuthenticated: token }}
      />
    </QueryClientProvider>
  );
}
