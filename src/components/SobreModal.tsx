/**
 * Garimpo Dev — Componente SobreModal (Sprint 4)
 * 
 * Modal informativo sobre a história do Garimpo Dev, o ecossistema do Porto Digital (Recife/PE),
 * a arquitetura Zero-Backend e o perfil profissional do desenvolvedor Jonas Ferreira Silva.
 */

import React, { useEffect } from 'react';
import { X, Compass, MapPin, Code2, Server, ExternalLink, Heart, Layers } from 'lucide-react';

interface SobreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SobreModal: React.FC<SobreModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Overlay para fechar ao clicar fora */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteúdo do Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Compass className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                Sobre o Garimpo Dev
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Radar Pessoal de Vagas Tech em Recife & Porto Digital
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Informativo */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          
          {/* Motivação e O Que É */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              O Propósito do Projeto
            </h3>
            <p>
              O <strong>Garimpo Dev</strong> nasce como uma ferramenta web responsiva, gratuita e sem anúncios criada para garimpar e consolidar vagas de tecnologia em tempo real diretamente do ecossistema do <strong>Porto Digital</strong> e de Recife/PE.
            </p>
          </div>

          {/* Arquitetura */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-sky-400" />
              Arquitetura Zero-Backend
            </h3>
            <p>
              Graças ao CORS aberto na API da Sólides, o Garimpo Dev consome os endpoints estritamente no lado do cliente (Frontend em React + TypeScript), eliminando a necessidade de servidores ou proxies intermediários. As requisições ocorrem de forma paralela e concorrente com a máxima velocidade.
            </p>
          </div>

          {/* Tecnologias Utilizadas */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Tecnologias Utilizadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React 19', 'TypeScript 6', 'Vite 8', 'Tailwind CSS v4', 'Axios', 'Docker Multi-stage', 'Oxlint'].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-200 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Perfil do Desenvolvedor */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Desenvolvido por</h4>
            <p className="text-sm font-bold text-slate-100">Jonas Ferreira Silva</p>
            <p className="text-slate-400 text-xs">
              Engenheiro e desenvolvedor focado em criar soluções web limpas, performáticas e orientadas a dados reais em Pernambuco, Brasil. 🇧🇷
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/jonasferreira-silva1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                GitHub
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> em Recife, PE
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
