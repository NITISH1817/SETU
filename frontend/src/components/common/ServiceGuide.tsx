import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Building2, CheckCircle, ChevronRight } from 'lucide-react';
import { findRecommendedServices, GovernmentService, departmentsRegistry } from '../../data/serviceRegistry';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUGGESTIONS = [
  'I want to start a business',
  'I need a birth certificate',
  'Register a grievance',
  'Get an income certificate',
  'Find a government scheme',
];

export const ServiceGuide: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GovernmentService[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) { setResults([]); setHasSearched(false); return; }
    setResults(findRecommendedServices(trimmed));
    setHasSearched(true);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); doSearch(query); };

  const handleSuggestion = (s: string) => { setQuery(s); doSearch(s); };

  return (
    <div className="gc-glass rounded-2xl overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--gradient-primary)' }} />

      <div className="p-6 sm:p-8 space-y-6 relative">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        {/* Header */}
        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 gc-badge gc-badge-primary mb-1">
            <Sparkles className="w-3 h-3" />
            {t('guide.badge', 'Intelligent Service Navigator')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            {t('guide.title', 'What do you want to do?')}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {t('guide.subtitle', 'Describe your requirement and we will guide you to the right department.')}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search className="w-5 h-5 text-slate-500 ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('guide.placeholder', 'e.g., I want to start a business...')}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 py-2"
            />
            <button type="submit"
              className="gc-btn-primary text-sm px-5 py-2 shrink-0">
              {t('guide.search', 'Search')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggestion chips */}
        {!hasSearched && (
          <div className="flex flex-wrap justify-center gap-2 relative z-10">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => handleSuggestion(s)}
                className="px-3 py-1.5 rounded-full text-xs text-slate-400 border border-[var(--color-border)] hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="relative z-10 max-w-2xl mx-auto border-t border-[var(--color-border)] pt-5 space-y-4">
            {results.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">We found the right services for you</span>
                </div>

                <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="gc-section-label mb-0.5">Recommended Department</div>
                    <div className="text-sm font-semibold text-white">
                      {departmentsRegistry[results[0].departmentId]?.name || results[0].departmentName}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {results.slice(0, 3).map(service => (
                    <Link key={service.id} to={service.route}
                      className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">{service.name}</div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">{service.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-3 transition-colors" />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm font-semibold text-white mb-1">We couldn't find an exact match.</p>
                <p className="text-xs text-slate-500 mb-4">Did you mean one of these?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['business', 'certificate', 'grievance', 'scheme'].map(s => (
                    <button key={s} onClick={() => handleSuggestion(s)}
                      className="px-3 py-1.5 rounded-full text-xs text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
