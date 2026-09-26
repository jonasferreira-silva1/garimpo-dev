/**
 * Garimpo Dev — Componente ArquiteturaDiagrama (Sprint 9)
 * 
 * Exibe o mapa visual do fluxo de dados da arquitetura reativa do app
 * e um painel de telemetria em tempo real no cliente (tamanho do cache, conexão, testes).
 */

import React, { useMemo } from 'react';
import { Activity, Server, Cpu, Database, Layout, ShieldCheck, HardDrive, Wifi } from 'lucide-react';
import type { TelemetriaApp } from '../types/diario';
import { calcularTelemetriaApp } from '../data/diarioTecnico';

interface ArquiteturaDiagramaProps {
  vagasCount?: number;
}

export const ArquiteturaDiagrama: React.FC<ArquiteturaDiagramaProps> = ({ vagasCount = 0 }) => {
  const telemetria: TelemetriaApp = useMemo(() => {
    return calcularTelemetriaApp(vagasCount);
  }, [vagasCount]);

  return (
    <div className="space-y-6">
      
      {/* Telemetria de Performance em Tempo Real */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Armazenamento</span>
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-extrabold text-amber-400">{telemetria.tamanhoCacheKB} KB</p>
          <span className="text-[10px] text-slate-500 block">ocupados no localStorage</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Status de Rede</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-extrabold text-emerald-400 uppercase">{telemetria.statusConexao}</p>
          <span className="text-[10px] text-slate-500 block">CORS direto habilitado</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Qualidade / CI</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-base font-extrabold text-sky-400">53 Testes</p>
          <span className="text-[10px] text-slate-500 block">100% aprovação (Vitest)</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Versão App</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-base font-extrabold text-slate-100">{telemetria.versao}</p>
          <span className="text-[10px] text-slate-500 block">Porto Digital Recife</span>
        </div>
      </div>

      {/* Diagrama Visual Reativo em ASCII / Layout Stylized */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 font-mono text-xs">
        <h4 className="text-slate-300 font-sans font-bold text-xs flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          Topologia de Dados & Fluxo de Reatividade
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          
          {/* Nó 1: API Externa */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 relative group">
            <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-200 text-[11px]">API Gateway Sólides</p>
            <span className="text-[10px] text-slate-500 block">https://apigw.solides.com.br</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">
              CORS Open
            </span>
          </div>

          {/* Seta 1 */}
          <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">
            ──► HTTP ──►
          </div>

          {/* Nó 2: Custom Hook & Cache */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="w-7 h-7 mx-auto rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-200 text-[11px]">useVagas + localStorage</p>
            <span className="text-[10px] text-slate-500 block">Stale-While-Revalidate (24h)</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[9px] font-semibold border border-sky-500/20">
              Auto-Polling 5m
            </span>
          </div>

          {/* Seta 2 */}
          <div className="hidden md:flex items-center justify-center text-slate-600 font-bold">
            ──► State ──►
          </div>

          {/* Nó 3: Analytics Engine */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="w-7 h-7 mx-auto rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-200 text-[11px]">mercadoAnalytics.ts</p>
            <span className="text-[10px] text-slate-500 block">Regex \b Parser + Mediana</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] font-semibold border border-purple-500/20">
              Zero Latency
            </span>
          </div>

          {/* Nó 4: UI & Export Engine */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 md:col-span-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Layout className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-200 text-[11px]">UI & PDF Export</p>
            <span className="text-[10px] text-slate-500 block">@media print + LinkedIn</span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">
              A4 Vector
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
