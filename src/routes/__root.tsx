import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  ErrorComponent,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AppMetadata } from "@/components/global/app-metadata";
import { NotFoundComponent } from "@/components/global/not-found";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProjectServerFn, getProjects } from "@/functions/projects";
import { getThemeServerFn } from "@/functions/theme/theme-server";
import type { ThemeTypes } from "@/functions/theme/types";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import appCss from "../tailwind.css?url";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
        title: m.appTitle(),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => <NotFoundComponent />,
  shellComponent: RootComponent,
  errorComponent: (props) => <ErrorComponent {...props} />,
  loader: async () => {
    const theme = await getThemeServerFn();
    const activeProjectId = await getProjectServerFn();
    const projects = await getProjects();
    const locale = getLocale();
    return { theme, activeProjectId, projects, locale, breadcrumb: undefined };
  },
});

function RootComponent() {
  const { theme, locale } = Route.useLoaderData();
  return (
    <RootDocument theme={theme} locale={locale}>
      <Outlet />
    </RootDocument>
  );
}

type RootDocumentProps = {
  children: React.ReactNode;
  theme: ThemeTypes;
  locale: string;
};

function RootDocument(props: RootDocumentProps) {
  const { children, theme, locale } = props;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
        <AppMetadata />
      </head>
      <body>
        <DirectionProvider direction={direction}>
          <TooltipProvider>
            {children}
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Toaster richColors />
            <Scripts />
          </TooltipProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
