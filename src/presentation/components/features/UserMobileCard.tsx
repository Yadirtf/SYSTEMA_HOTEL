import { Mail, Activity, User as UserIcon, XCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { cn } from '@/shared/utils';
import { UserWithDetails } from '@/presentation/types/UserWithDetails';

interface UserMobileCardProps {
    user: UserWithDetails;
    onEdit: (user: UserWithDetails) => void;
    onToggleStatus: (user: UserWithDetails) => void;
    onDelete: (user: UserWithDetails) => void;
}

export const UserMobileCard = ({ user, onEdit, onToggleStatus, onDelete }: UserMobileCardProps) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg border-2 border-white shadow-inner shrink-0">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">{user.firstName} {user.lastName}</h4>
                        <span className={cn(
                            "inline-block px-2 py-0.5 rounded-lg text-[8px] font-extrabold tracking-[0.1em] uppercase border mt-1",
                            user.role === 'ADMIN' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 shadow-sm"
                        )}>
                            {user.role}
                        </span>
                    </div>
                </div>
                {user.isActive ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 py-4 border-y border-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <Mail size={14} className="shrink-0" />
                    <span className="text-[11px] font-medium truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <Activity size={14} className="shrink-0" />
                    <span className="text-[11px] font-medium">
                        Estado: <span className={user.isActive ? "text-emerald-600 font-bold" : "text-slate-400 font-bold"}>
                            {user.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button onClick={() => onEdit(user)} className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border-none gap-2 text-[10px] font-bold uppercase tracking-wider shadow-none">
                    <UserIcon size={14} /> Editar
                </Button>
                <Button onClick={() => onToggleStatus(user)} className={cn("flex-1 h-11 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-wider border-none shadow-none", user.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}>
                    {user.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />} {user.isActive ? "Desactivar" : "Activar"}
                </Button>
                <Button onClick={() => onDelete(user)} variant="secondary" className="h-11 w-11 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white border-none shadow-none">
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
};
