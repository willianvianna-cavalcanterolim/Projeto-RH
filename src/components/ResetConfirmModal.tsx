import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#0C3B2E] shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-neutral-900">
              Restaurar Pautas Originais da Reunião
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Deseja restaurar as 11 pautas oficiais cadastradas da ata da reunião de Implantação de RH/DP da Cavalcante & Rolim (Uniformes, Jovem Aprendiz, Benefícios, Processos DP, SST, Cargos/BSC, Eventos)?
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0C3B2E] hover:bg-[#165643] rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Pautas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
