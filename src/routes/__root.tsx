/// <reference types="vite/client" />
import appCss from "@/styles/app.css?url";
import fontsCss from "@/styles/fonts.css?url";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Abdul Wahab",
      },
    ],
    links: [
      {
        rel: "preload",
        as: "font",
        href: "/fonts/inter-400.ttf",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        href: "/fonts/crimson-pro-300.ttf",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical font-face declarations */
              @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/inter-400.ttf') format('truetype');
              }
              @font-face {
                font-family: 'Crimson Pro';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: url('/fonts/crimson-pro-300.ttf') format('truetype');
              }
              @font-face {
                font-family: 'JetBrains Mono';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/jetbrains-mono-400.ttf') format('truetype');
              }
            `,
          }}
        />
        <link
          rel="preload"
          href={fontsCss}
          as="style"
          onLoad={(event) => {
            const target = event.currentTarget as HTMLLinkElement;
            target.onload = null;
            target.rel = "stylesheet";
          }}
        />
        <noscript>
          <link rel="stylesheet" href={fontsCss} />
        </noscript>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeToggle />
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
