/**
 * Garimpo Dev — Componente RelatorioModal (Sprint 8)
 * 
 * Modal interativo de exportação do relatório de inteligência de mercado com opções:
 * 1. Copiar texto formatado para LinkedIn / WhatsApp (com feedback toast)
 * 2. Imprimir / Salvar em PDF (window.print)
 * 3. Copiar link de compartilhamento direto (?aba=mercado)
 */

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Printer, Share2, FileText } from 'lucide-react';
import type { MercadoSnapshot } from '../types/mercado';
import { RelatorioView } from './RelatorioView';
import { gerarTextoRelatorioLinkedin, copiarParaAreaDeTransferencia } from '../utils/relatorioFormatter';

interface RelatorioModalProps {
  snapshot: MercadoSnapshot | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RelatorioModal: React.FC<RelatorioModalProps> = ({ snapshot, isOpen, onClose }) => {
  const [copiadoTexto, setCopiadoTexto] = useState<boolean>(false);
  const [copiadoLink, setCopiadoLink] = useState<boolean>(false);

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !snapshot) return null;

  const handleCopiarLinkedin = async () => {
    const texto = gerarTextoRelatorioLinkedin(snapshot);
    const ok = await copiarParaAreaDeTransferencia(texto);
    if (ok) {
      setCopiadoTexto(true);
      setTimeout(() => setCopiadoTexto(false), 3000);
    }
  };

  const handleCopiarLink = async () => {
    const urlCompartilhamento = `${window.location.origin}/?aba=mercado`;
    const ok = await copiarParaAreaDeTransferencia(urlCompartilhamento);
    if (ok) {
      setCopiadoLink(true);
      setTimeout(() => setCopiadoLink(false), 3000);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static">
      
      {/* Overlay transparente */}
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      {/* Conteúdo Principal do Modal */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 print:max-h-none print:border-none print:bg-white print:shadow-none print:static">
        
        {/* Cabeçalho de Ações (Oculto na impressão) */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 space-y-3 bg-slate-900/90 print:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-xs sm:text-sm">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Exportar Relatório & Compartilhar</span>
            </div>

            {/* Botão Fechar Modal */}
            <button
              onClick={onClose}
              aria-label="Fechar modal de relatório"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
            {/* Botão Copiar Texto para LinkedIn */}
            <button
              onClick={handleCopiarLinkedin}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                copiadoTexto
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-400 text-slate-950 border-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/10'
              }`}
            >
              {copiadoTexto ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiadoTexto ? 'Texto Copiado!' : 'Copiar p/ LinkedIn'}
            </button>

            {/* Botão Copiar Link Direto */}
            <button
              onClick={handleCopiarLink}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                copiadoLink
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {copiadoLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              {copiadoLink ? 'Link Copiado!' : 'Copiar Link'}
            </button>

            {/* Botão Imprimir / Salvar PDF */}
            <button
              onClick={handleImprimir}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Visualização de Prévia do Relatório */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible">
          <RelatorioView snapshot={snapshot} />
        </div>

      </div>
    </div>
  );
};
