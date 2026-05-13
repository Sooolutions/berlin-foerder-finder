
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
      style={{
        gridColumn: gridPos.gridColumn,
        gridRow: gridPos.gridRow,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
      className="rounded-2xl border p-3.5 cursor-pointer transition-all duration-200 hover:shadow-md hover:brightness-95 overflow-hidden flex flex-col"
      onClick={() => onExpand(funding.id)}
    >
      <p className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 mb-1">
        {funding.title}
      </p>
      <p className="text-xs font-medium truncate mb-1.5" style={{ color: colors.accent }}>
        {funding.organization}
      </p>
      <p className={`text-xs text-gray-600 flex-1 overflow-hidden ${isHorizontal ? 'line-clamp-2' : 'line-clamp-4'}`}>
        {funding.description}
      </p>
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
