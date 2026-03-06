import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getThemeServerFn } from "@/functions/theme/theme-server";
import type { ThemeTypes } from "@/functions/theme/types";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import appCss from "../tailwind.css?url";

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
  notFoundComponent: () => <div>{m.notFound()}</div>,
  shellComponent: RootComponent,
  loader: async () => {
    const theme = await getThemeServerFn();
    const locale = getLocale();
    return { theme, locale };
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
            <Scripts />
          </TooltipProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
