
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
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl bg-white border border-gray-100 shadow-md animate-fade-in"
    >
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none z-10"
      >
        ✕
      </button>

      <div className="p-5 pr-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2/3: title, org, description */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-base font-semibold text-gray-900 leading-snug">{funding.title}</p>
          <p className="text-sm font-medium" style={{ color: colors.accent }}>
            {funding.organization}
          </p>
          <div className="bg-[#F3F3F3] rounded-lg px-3 py-2.5">
            <p className="text-sm text-gray-700 leading-relaxed">{funding.description}</p>
          </div>
        </div>

        {/* Right 1/3: details — all text-sm for uniformity */}
        <div className="space-y-3">
          {funding.amount && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Förderhöhe</span>
              <p className="text-sm font-semibold text-green-600 mt-0.5">{funding.amount}</p>
            </div>
          )}
          {funding.application_deadline && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Antragsfrist</span>
              <p className="text-sm text-gray-700 mt-0.5">{funding.application_deadline}</p>
            </div>
          )}
          {funding.application_process && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Antragsprozess</span>
              <p className="text-sm text-gray-700 mt-0.5">{funding.application_process}</p>
            </div>
          )}
          {funding.contact_email && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Kontakt</span>
              <p className="mt-0.5">
                <a
                  href={`mailto:${funding.contact_email}`}
                  className="text-sm hover:underline"
                  style={{ color: colors.accent }}
                >
                  {funding.contact_email}
                </a>
              </p>
            </div>
          )}
          {funding.contact_phone && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Telefon</span>
              <p className="text-sm text-gray-700 mt-0.5">{funding.contact_phone}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="border-t border-gray-100 pt-3">
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
