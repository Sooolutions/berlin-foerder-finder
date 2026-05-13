
import { Funding } from '@/hooks/useFundingResults';
import { getColorScheme, GridPosition } from './fundingCardUtils';

interface FundingCardProps {
  funding: Funding;
  gridPos: GridPosition;
  isHorizontal: boolean;
  onExpand: (id: string) => void;
}

const FundingCard = ({ funding, gridPos, isHorizontal, onExpand }: FundingCardProps) => {
  const colors = getColorScheme(funding.funding_type, funding.id);

  return (
    <div
      style={{ gridColumn: gridPos.gridColumn, gridRow: gridPos.gridRow }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3.5 cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col"
      onClick={() => onExpand(funding.id)}
    >
      <p className="font-semibold text-[15px] leading-snug line-clamp-2 text-gray-900 mb-1">
        {funding.title}
      </p>
      <p className="text-xs font-medium truncate mb-2" style={{ color: colors.accent }}>
        {funding.organization}
      </p>
      <div className="bg-[#F3F3F3] rounded-lg px-2.5 py-2 flex-1 overflow-hidden">
        <p className={`text-xs text-gray-600 ${isHorizontal ? 'line-clamp-2' : 'line-clamp-4'}`}>
          {funding.description}
        </p>
      </div>
      <button
        type="button"
        className="mt-2 text-xs font-medium self-start hover:underline"
        style={{ color: colors.accent }}
        onClick={(e) => { e.stopPropagation(); onExpand(funding.id); }}
      >
        Mehr Details →
      </button>
    </div>
  );
};

export default FundingCard;
