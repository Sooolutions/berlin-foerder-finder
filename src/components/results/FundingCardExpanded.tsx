
import { useEffect, useRef } from 'react';
import { Funding } from '@/hooks/useFundingResults';
import { getColorScheme } from './fundingCardUtils';

interface FundingCardExpandedProps {
  funding: Funding;
  onClose: () => void;
}

const FundingCardExpanded = ({ funding, onClose }: FundingCardExpandedProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = getColorScheme(funding.funding_type, funding.id);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border animate-fade-in"
      style={{ backgroundColor: colors.bgExpanded, borderColor: colors.borderExpanded }}
    >
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none z-10"
      >
        ✕
      </button>

      <div className="p-5 pr-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2/3: title, org, description */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{funding.title}</h3>
          <p className="text-sm font-medium" style={{ color: colors.accent }}>
            {funding.organization}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">{funding.description}</p>
        </div>

        {/* Right 1/3: details */}
        <div className="space-y-3 text-sm">
          {funding.amount && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Förderhöhe</span>
              <p className="text-gray-800 mt-0.5">{funding.amount}</p>
            </div>
          )}
          {funding.application_deadline && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Antragsfrist</span>
              <p className="text-gray-800 mt-0.5">{funding.application_deadline}</p>
            </div>
          )}
          {funding.application_process && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Antragsprozess</span>
              <p className="text-gray-800 mt-0.5">{funding.application_process}</p>
            </div>
          )}
          {funding.contact_email && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Kontakt</span>
              <p className="mt-0.5">
                <a
                  href={`mailto:${funding.contact_email}`}
                  className="hover:underline"
                  style={{ color: colors.accent }}
                >
                  {funding.contact_email}
                </a>
              </p>
            </div>
          )}
          {funding.contact_phone && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Telefon</span>
              <p className="text-gray-800 mt-0.5">{funding.contact_phone}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="border-t border-black/10 pt-3">
          <a
            href={funding.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
            style={{ color: colors.accent }}
          >
            Zur Website →
          </a>
        </div>
      </div>
    </div>
  );
};

export default FundingCardExpanded;
