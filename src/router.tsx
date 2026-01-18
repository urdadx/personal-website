import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultErrorComponent: () => <div>An error occured</div>,
    defaultPendingComponent: () => (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        <Loader2 className="animate-spin text-white" />
      </div>
    ),
    defaultNotFoundComponent: () => (
      <div className="text-2xl flex justify-center min-h-screen">404 - Page Not Found</div>
    ),
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
