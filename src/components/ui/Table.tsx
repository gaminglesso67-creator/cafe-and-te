import React from 'react';
import clsx from 'clsx';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

export interface ResponsiveTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Responsive Table (PRD 5.9 & Mobile-First Rules):
 * Renders card-based stacked rows on mobile (<768px) and a structured table on tablet/desktop.
 */
export function ResponsiveTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = '{{TABLE_EMPTY_STATE}}',
  className,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center border border-gold/20 rounded-sm bg-surface text-muted text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Mobile Card List (<768px) */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row) => (
          <div
            key={rowKey(row)}
            className="p-4 rounded-sm border border-gold/25 bg-surface space-y-2.5"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-muted text-xs uppercase tracking-wider shrink-0 pt-0.5">
                  {col.header}
                </span>
                <div className="text-right text-text font-medium break-words">
                  {col.render(row)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Tablet / Desktop Table (>=768px) */}
      <div className="hidden md:block overflow-x-auto border border-gold/25 rounded-sm bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold/25 bg-bg/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3.5 text-xs uppercase tracking-widest text-muted font-medium"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15 text-sm">
            {data.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-white/[0.02] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-text align-middle">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

