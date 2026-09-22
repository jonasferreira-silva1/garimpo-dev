/**
 * Garimpo Dev — Componente CacheBanner
 * 
 * Exibe um alerta no topo da página quando a API está indisponível e a aplicação
 * está funcionando em modo resiliente (Offline-First / Cache Fallback em localStorage).
 * Calcula o tempo decorrido dinamicamente em tempo de renderização a partir do timestamp.
 */

import React, { useMemo } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface CacheBannerProps {
  cacheTimestamp: number;
  onRecarregar: () => void;
  loading?: boolean;
}

export const CacheBanner: React.FC<CacheBannerProps> = ({
  cacheTimestamp,
  onRecarregar,
  loading = false,
}) => {
  // Cálculo dinâmico do tempo relativo e horário formatado
  const { textoTempo, horarioFormatado } = useMemo(() => {
    const agora = Date.now();
    const diffMs = Math.max(0, agora - cacheTimestamp);
    const minutos = Math.floor(diffMs / (60 * 1000));
    const horas = Math.floor(minutos / 60);

    let texto = 'há menos de 1 minuto';
    if (horas >= 1) {
      texto = `há aproximadamente ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (minutos >= 1) {
      texto = `há aproximadamente ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    const horario = new Date(cacheTimestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return { textoTempo: texto, horarioFormatado: horario };
  }, [cacheTimestamp]);

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
          <WifiOff className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span>Modo Resiliente (Cache Offline Ativo)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Offline Fallback
            </span>
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            Não foi possível conectar à API da Sólides. Exibindo a última lista salva em cache ({textoTempo} — às {horarioFormatado}).
          </p>
        </div>
      </div>

      <button
        onClick={onRecarregar}
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shrink-0 shadow-md shadow-amber-400/10 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Tentando Conectar...' : 'Tentar Reconectar'}
      </button>
    </div>
  );
};
