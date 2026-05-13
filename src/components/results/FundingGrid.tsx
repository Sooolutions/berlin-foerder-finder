
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Funding } from '@/hooks/useFundingResults';
import FundingCard from './FundingCard';
import FundingCardExpanded from './FundingCardExpanded';
import {
  getCardGridPosition,
  isHorizontalCard,
  getCardGridPositionSimple,
  isHorizontalCardSimple,
} from './fundingCardUtils';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
};

interface GridSectionProps {
  cards: Funding[];
  isDesktop: boolean;
  onExpand: (id: string) => void;
}

const GridSection = ({ cards, isDesktop, onExpand }: GridSectionProps) => {
  const containerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
    gridAutoRows: '150px',
    gap: '12px',
  };

  const getPos = isDesktop ? getCardGridPosition : getCardGridPositionSimple;
  const getIsHoriz = isDesktop ? isHorizontalCard : isHorizontalCardSimple;

  return (
    <div style={containerStyle}>
      {cards.map((card, i) => (
        <FundingCard
          key={card.id}
          funding={card}
          gridPos={getPos(i)}
          isHorizontal={getIsHoriz(i)}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
};

interface FundingGridProps {
  fundings: Funding[];
  expandedId: string | null;
  onExpand: (id: string) => void;
  onClose: () => void;
}

const FundingGrid = ({ fundings, expandedId, onExpand, onClose }: FundingGridProps) => {
  const isDesktop = useIsDesktop();

  const expandedIdx = expandedId ? fundings.findIndex(f => f.id === expandedId) : -1;

  if (expandedIdx < 0) {
    return <GridSection cards={fundings} isDesktop={isDesktop} onExpand={onExpand} />;
  }

  const expandedFunding = fundings[expandedIdx];
  // Split at the end of the cycle containing the expanded card
  const cycleEndIdx = Math.min((Math.floor(expandedIdx / 6) + 1) * 6, fundings.length);
  const grid1 = fundings.slice(0, cycleEndIdx).filter(f => f.id !== expandedId);
  const grid2 = fundings.slice(cycleEndIdx);

  return (
    <div className="space-y-3">
      {grid1.length > 0 && (
        <GridSection cards={grid1} isDesktop={isDesktop} onExpand={onExpand} />
      )}
      <FundingCardExpanded funding={expandedFunding} onClose={onClose} />
      {grid2.length > 0 && (
        <GridSection cards={grid2} isDesktop={isDesktop} onExpand={onExpand} />
      )}
    </div>
  );
};

export default FundingGrid;
