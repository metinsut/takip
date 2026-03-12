import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export function BreadCrumb() {
  const matches = useMatches();

  const items = matches
    .map((match) => {
      const loaderData = match.loaderData as
        | { breadcrumb?: string | Array<{ href: string; label: string }> }
        | undefined;

      if (Array.isArray(loaderData?.breadcrumb)) {
        return loaderData.breadcrumb;
      }

      if (loaderData?.breadcrumb) {
        return [
          {
            href: match.pathname,
            label: loaderData.breadcrumb,
          },
        ];
      }

      return null;
    })
    .filter(Boolean)
    .flat();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {items.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={
            <Link to="..">
              <ArrowLeftIcon />
            </Link>
          }
        />
      )}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {items.map((crumb, index) => (
            <Fragment key={crumb?.href || index}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{crumb?.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={crumb?.href} />}>{crumb?.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
