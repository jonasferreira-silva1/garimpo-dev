/**
 * Garimpo Dev — Aplicação Principal (App.tsx - Sprint 3)
 * 
 * Conecta a busca por múltiplos slugs, gerenciamento de favoritos com localStorage,
 * modal de detalhes de vaga em HTML e controles de paginação e filtros.
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { FiltroBar } from './components/FiltroBar';
import { VagaCard } from './components/VagaCard';
import { VagaDetalhesModal } from './components/VagaDetalhesModal';
import { Paginacao } from './components/Paginacao';
import { EmptyState } from './components/EmptyState';
import { useVagas } from './hooks/useVagas';
import { useFavoritos } from './hooks/useFavoritos';
import type { Vaga } from './types/vaga';
import { Loader2, Heart } from 'lucide-react';

const App: React.FC = () => {
  // Gerenciamento de Favoritos no localStorage
  const { favoritos, toggleFavorito, isFavorito, totalFavoritos } = useFavoritos();

  // Custom Hook de Vagas (conectado à lista de IDs favoritos para filtragem)
  const {
    vagas,
    loading,
    error,
    page,
    totalPages,
    setPage,
    filtros,
    setFiltros,
    ultimaAtualizacao,
    recarregar,
  } = useVagas(favoritos);

  // Estado para controlar a vaga exibida no modal de detalhes
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);

  const handleLimparFiltros = () => {
    setFiltros({
      busca: '',
      modelo: 'todos',
      slugEmpresa: 'todos',
      apenasFavoritas: false,
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Header Principal */}
      <Header
        ultimaAtualizacao={ultimaAtualizacao}
        onRecarregar={recarregar}
        loading={loading}
      />

      {/* Conteúdo Principal da Aplicação */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Barra de Busca e Filtros Avançados */}
        <FiltroBar
          filtros={filtros}
          onFiltrosChange={(novosFiltros) => {
            setFiltros(novosFiltros);
            setPage(1); // Volta para a página 1 ao alterar filtros
          }}
          totalVagas={vagas.length}
          totalFavoritos={totalFavoritos}
        />

        {/* Estado de Carregamento (Loading Spinner) */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-xs font-medium">Buscando vagas agregadas em múltiplos slugs da Sólides...</p>
          </div>
        )}

        {/* Estado de Erro de Conexão */}
        {!loading && error && (
          <EmptyState
            mensagem={`Erro de comunicação com a API: ${error}`}
            onLimparFiltros={recarregar}
          />
        )}

        {/* Estado Sem Vagas Encontradas ou Sem Favoritos */}
        {!loading && !error && vagas.length === 0 && (
          <EmptyState
            mensagem={
              filtros.apenasFavoritas
                ? 'Você ainda não possui nenhuma vaga salva nos favoritos.'
                : 'Nenhuma vaga corresponde aos critérios de pesquisa selecionados.'
            }
            onLimparFiltros={handleLimparFiltros}
          />
        )}

        {/* Grid de Cards das Vagas */}
        {!loading && !error && vagas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vagas.map((vaga) => (
              <VagaCard
                key={vaga.id}
                vaga={vaga}
                isFavorito={isFavorito(vaga.id)}
                onToggleFavorito={toggleFavorito}
                onVerDetalhes={(v) => setVagaSelecionada(v)}
              />
            ))}
          </div>
        )}

        {/* Controle de Paginação */}
        {!loading && !error && vagas.length > 0 && (
          <Paginacao
            paginaAtual={page}
            totalPaginas={totalPages}
            onPageChange={(novaPagina) => {
              setPage(novaPagina);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Modal de Detalhes da Vaga */}
      <VagaDetalhesModal
        vaga={vagaSelecionada}
        onClose={() => setVagaSelecionada(null)}
        isFavorito={vagaSelecionada ? isFavorito(vagaSelecionada.id) : false}
        onToggleFavorito={toggleFavorito}
      />

      {/* Rodapé da Aplicação */}
      <footer className="border-t border-slate-900 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> por{' '}
            <strong className="text-slate-300">Jonas Ferreira Silva</strong> — Recife, PE 🇧🇷
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jonasferreira-silva1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <span className="text-slate-700">•</span>
            <span>Sem backend · Agregação Multi-slug Sólides</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
