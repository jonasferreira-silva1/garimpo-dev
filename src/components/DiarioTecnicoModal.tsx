/**
 * Garimpo Dev — Componente DiarioTecnicoModal (Sprint 9)
 * 
 * Modal interativo apresentando os 6 Architecture Decision Records (ADRs),
 * visualizador de arquitetura reativa com telemetria viva e exportação do artigo
 * completo em Markdown para Dev.to / Medium / LinkedIn.
 */

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Cpu, Copy, Check, Search, Filter, FileText, ExternalLink } from 'lucide-react';
import type { CategoriaADR } from '../types/diario';
import { obterADRs, gerarTextoArtigoEngenharia } from '../data/diarioTecnico';
import { ArquiteturaDiagrama } from './ArquiteturaDiagrama';
import { copiarParaAreaDeTransferencia } from '../utils/relatorioFormatter';

interface DiarioTecnicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vagasCount?: number;
}

export const DiarioTecnicoModal: React.FC<DiarioTecnicoModalProps> = ({
  isOpen,
  onClose,
  vagasCount = 0,
}) => {
  const [abaModal, setAbaModal] = useState<'adrs' | 'diagrama' | 'artigo'>('adrs');
  const [categoriaSel, setCategoriaSel] = useState<CategoriaADR | 'todas'>('todas');
  const [busca, setBusca] = useState<string>('');
  const [copiadoArtigo, setCopiadoArtigo] = useState<boolean>(false);

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

  if (!isOpen) return null;

  const adrsFiltrados = obterADRs(categoriaSel, busca);

  const handleCopiarArtigo = async () => {
    const textoArtigo = gerarTextoArtigoEngenharia();
    const ok = await copiarParaAreaDeTransferencia(textoArtigo);
    if (ok) {
      setCopiadoArtigo(true);
      setTimeout(() => setCopiadoArtigo(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Overlay transparente */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteúdo Principal do Modal */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10">
        
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
                  Diário Técnico & Bastidores de Engenharia
                </h3>
                <p className="text-[11px] text-slate-400">
                  Arquitetura, decisões técnicas (ADRs) e transparência do Garimpo Dev.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Botão Copiar Artigo em Markdown */}
              <button
                onClick={handleCopiarArtigo}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  copiadoArtigo
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-400 text-slate-950 border-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/10'
                }`}
                title="Copiar artigo completo em Markdown para Dev.to / Medium / LinkedIn"
              >
                {copiadoArtigo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiadoArtigo ? 'Artigo Copiado!' : 'Copiar Artigo p/ Dev.to'}</span>
                <span className="sm:hidden">{copiadoArtigo ? 'Copiado!' : 'Artigo'}</span>
              </button>

              {/* Botão Fechar */}
              <button
                onClick={onClose}
                aria-label="Fechar modal de diário técnico"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Abas Superiores do Modal */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setAbaModal('adrs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                abaModal === 'adrs'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Decisões de Arquitetura ({obterADRs().length} ADRs)
            </button>

            <button
              onClick={() => setAbaModal('diagrama')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                abaModal === 'diagrama'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Arquitetura & Telemetria
            </button>

            <button
              onClick={() => setAbaModal('artigo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                abaModal === 'artigo'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Artigo Completo (Markdown)
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ============================================== */}
          {/* VISÃO 1: DECISÕES DE ARQUITETURA (ADRs)         */}
          {/* ============================================== */}
          {abaModal === 'adrs' && (
            <div className="space-y-4">
              
              {/* Barra de Filtros e Busca */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                
                {/* Campo de Busca */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar decisão (ex: CORS, Polling, Mediana)..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2 outline-none"
                  />
                </div>

                {/* Filtro por Categoria */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
                  <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-400" />
                    Cat:
                  </span>
                  {[
                    { id: 'todas', label: 'Todas' },
                    { id: 'arquitetura', label: 'Arquitetura' },
                    { id: 'performance', label: 'Performance' },
                    { id: 'resiliencia', label: 'Resiliência' },
                    { id: 'estatistica', label: 'Estatística' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaSel(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                        categoriaSel === cat.id
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Lista de ADRs */}
              {adrsFiltrados.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Nenhum Registro de Decisão encontrado para os termos pesquisados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adrsFiltrados.map((adr) => (
                    <div
                      key={adr.id}
                      className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 rounded-xl p-4 space-y-2.5 transition-all shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                            {adr.id}
                          </span>
                          <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{adr.titulo}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">{adr.data}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                            {adr.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300">
                        <p><strong>Contexto:</strong> {adr.contexto}</p>
                        <p><strong>Decisão Tomada:</strong> {adr.decisao}</p>
                        <p className="text-emerald-400/90"><strong>Consequência / Impacto:</strong> {adr.consequencias}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 text-[11px] text-amber-300/80 italic flex items-center gap-1">
                        <span>💡 Lição de Engenharia:</span> {adr.licoesAprendidas}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ============================================== */}
          {/* VISÃO 2: ARQUITETURA & TELEMETRIA              */}
          {/* ============================================== */}
          {abaModal === 'diagrama' && (
            <ArquiteturaDiagrama vagasCount={vagasCount} />
          )}

          {/* ============================================== */}
          {/* VISÃO 3: ARTIGO COMPLETO (MARKDOWN)            */}
          {/* ============================================== */}
          {abaModal === 'artigo' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-300">
                <p>
                  Este artigo narra em 1ª pessoa os bastidores de engenharia do Garimpo Dev. Clique ao lado para copiar e publicar no <strong>Dev.to</strong>, <strong>Medium</strong> ou <strong>LinkedIn</strong>.
                </p>
                <button
                  onClick={handleCopiarArtigo}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiadoArtigo ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[50vh]">
                {gerarTextoArtigoEngenharia()}
              </pre>
            </div>
          )}

        </div>

        {/* Rodapé do Modal */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            Documentação Técnica do Projeto · Garimpo Dev
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
