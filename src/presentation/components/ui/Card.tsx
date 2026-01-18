import { cn } from '@/shared/utils';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden', className)}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="p-10 pb-6">
    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h3>
    {subtitle && <p className="text-slate-400 text-sm font-light italic mt-1">{subtitle}</p>}
  </div>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-10 pt-0', className)}>{children}</div>
);
