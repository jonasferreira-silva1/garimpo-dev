/**
 * Garimpo Dev — Componente RadarOutrasFontes (Sprint 4)
 * 
 * Conectores inteligentes e rápidos para explorar mais vagas de tecnologia em Recife
 * no LinkedIn, GeekHunter e Remotar (excluindo totalmente a Gupy por preferência do projeto).
 */

import React from 'react';
import { ExternalLink, Compass, Laptop, Code2 } from 'lucide-react';

export const RadarOutrasFontes: React.FC = () => {
  const linkedinUrl = 'https://www.linkedin.com/jobs/search/?keywords=desenvolvedor%20tecnologia&location=Recife%2C%20Pernambuco%2C%20Brasil';
  const geekhunterUrl = 'https://www.geekhunter.com.br/vagas';
  const remotarUrl = 'https://remotar.com.br/';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          Radar de Fontes Tech Complementares em Recife
        </h3>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          100% Focado em Devs & Tech
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Quer expandir a sua busca para além da plataforma Sólides? Acesse os radares inteligentes filtrados para tecnologia:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        
        {/* Link para Busca Tech Recife no LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/40 text-xs font-semibold text-slate-200 hover:text-sky-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <span>LinkedIn Recife (Tech)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
        </a>

        {/* Link para GeekHunter */}
        <a
          href={geekhunterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/40 text-xs font-semibold text-slate-200 hover:text-purple-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <span>GeekHunter (Devs)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
        </a>

        {/* Link para Remotar */}
        <a
          href={remotarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span>Remotar (100% Remoto)</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
        </a>

      </div>
    </div>
  );
};
