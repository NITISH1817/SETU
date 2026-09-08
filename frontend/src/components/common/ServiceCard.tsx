import React, { useState } from 'react';
import { GovernmentService } from '../../data/serviceRegistry';
import { Building2, Clock, FileText, ArrowRight, CheckCircle, ShieldCheck, Database, UserCheck } from 'lucide-react';
import { ServiceGuidanceModal } from './ServiceGuidanceModal';

export const ServiceCard: React.FC<{ service: GovernmentService }> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryColors: Record<string, string> = {
    'Business':       'gc-badge-warning',
    'Industry':       'gc-badge-warning',
    'Certificates':   'gc-badge-info',
    'Grievance':      'gc-badge-error',
    'Welfare Schemes':'gc-badge-success',
  };

  const badgeClass = categoryColors[service.category] || 'gc-badge-primary';

  return (
    <>
      <div className="gc-card p-5 flex flex-col gap-4 h-full">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <span className={`gc-badge ${badgeClass}`}>{service.category}</span>
          <span className="text-[10px] text-slate-500 text-right truncate max-w-[140px]">{service.departmentName}</span>
        </div>

        {/* Title + description */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-base font-semibold text-white leading-snug">{service.name}</h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{service.description}</p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="gc-section-label mb-0.5">Eligibility</div>
              <p className="text-xs text-slate-400">{service.eligibility}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="gc-section-label mb-0.5">Documents Required</div>
              <ul className="text-xs text-slate-400 space-y-0.5">
                {service.documents.slice(0, 3).map((doc, i) => <li key={i}>· {doc}</li>)}
                {service.documents.length > 3 && <li className="text-slate-500">+{service.documents.length - 3} more</li>}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div>
              <div className="gc-section-label mb-0.5">Processing Time</div>
              <p className="text-xs text-slate-400">{service.processingTime}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="gc-btn-primary w-full justify-center text-sm mt-auto"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isModalOpen && (
        <ServiceGuidanceModal service={service} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
