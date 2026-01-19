'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';

export interface ColumnDef<T> {
  header: string;
  key: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderMobileCard?: (row: T) => ReactNode; // Template para vista móvil
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  isLoading, 
  emptyMessage = "No se encontraron registros",
  renderMobileCard
}: DataTableProps<T>) {

  if (isLoading) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-400 animate-pulse uppercase tracking-[0.2em]">Cargando datos</p>
    </div>
  );

  if (data.length === 0) return (
    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
        <div className="h-6 w-6 border-2 border-slate-200 rounded-md" />
      </div>
      <p className="text-sm font-medium uppercase tracking-widest">{emptyMessage}</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* VISTA DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={cn(
                    "py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]",
                    col.align === 'right' && "text-right",
                    col.align === 'center' && "text-center",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row) => (
              <motion.tr 
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {columns.map((col) => (
                  <td 
                    key={`${row.id}-${col.key}`} 
                    className={cn(
                      "py-5 px-8",
                      col.align === 'right' && "text-right",
                      col.align === 'center' && "text-center",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MOBILE: Se usa el template renderMobileCard si existe */}
      {renderMobileCard && (
        <div className="md:hidden space-y-4 pt-4">
          {data.map((row) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderMobileCard(row)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

