interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-1 flex items-center gap-1 text-xs text-muted-foreground"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-primary hover:underline">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
