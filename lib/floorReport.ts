import type { CompletedInteraction, FloorSession } from '@/types/floor';

export type WalkReasonStat = {
  reason: string;
  count: number;
};

export type AssociateReport = {
  associateId: string;
  name: string;
  customerParties: number;
  sales: number;
  walks: number;
  conversionRate: number;
  summaryParagraph: string;
};

export type FloorDayReport = {
  clientName: string;
  displayDate: string;
  generatedTime: string;
  dateKey: string;
  reportId: string;
  totalCustomerParties: number;
  totalSales: number;
  totalWalks: number;
  storeConversion: number;
  walkReasons: WalkReasonStat[];
  associates: AssociateReport[];
  conclusion: string;
};

export type FloorReportMeta = {
  reportId: string;
  generatedAt: Date;
};

export function formatReportPercent(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '0%';
  }
  return `${value.toFixed(1)}%`;
}

export function formatReportDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) {
    return dateKey;
  }
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatReportGeneratedTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function aggregateWalkReasons(
  interactions: CompletedInteraction[],
): WalkReasonStat[] {
  const counts = new Map<string, number>();

  for (const item of interactions) {
    if (item.outcome !== 'walk' || !item.walkReason) {
      continue;
    }
    const parties = item.customerCount ?? 1;
    counts.set(item.walkReason, (counts.get(item.walkReason) ?? 0) + parties);
  }

  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
}

type OpenerVariant = 0 | 1 | 2;

function partyLabel(count: number): string {
  return count === 1 ? 'party' : 'parties';
}

function openWithVariant(
  name: string,
  parties: number,
  variant: OpenerVariant,
): string {
  const label = partyLabel(parties);
  if (variant === 1) {
    return `${name} helped ${parties} customer ${label} today`;
  }
  if (variant === 2) {
    return `${name} worked with ${parties} customer ${label} today`;
  }
  return `${name} assisted ${parties} customer ${label} today`;
}

function buildAssociateSummary(
  name: string,
  parties: number,
  sales: number,
  walks: number,
  conversionRate: number,
  topWalkReason: string | null,
  variant: OpenerVariant,
): string {
  if (parties === 0) {
    return `${name} recorded no completed customer interactions today.`;
  }

  const opener = openWithVariant(name, parties, variant);

  if (walks === 0 && sales > 0) {
    return `${opener} and converted every recorded interaction into a sale.`;
  }

  if (sales === 0 && walks > 0) {
    const reasonText = topWalkReason ? `"${topWalkReason}"` : 'not recorded';
    return `${opener}. None resulted in a completed sale. The most common reason recorded was ${reasonText}.`;
  }

  return `${opener}. The day concluded with ${sales} ${
    sales === 1 ? 'sale' : 'sales'
  } and ${walks} ${walks === 1 ? 'walk' : 'walks'}, resulting in a conversion rate of ${formatReportPercent(conversionRate)}.`;
}

function buildConclusion(report: Omit<FloorDayReport, 'conclusion'>): string {
  const {
    totalCustomerParties,
    totalSales,
    totalWalks,
    storeConversion,
    walkReasons,
    associates,
  } = report;

  if (totalCustomerParties === 0) {
    return 'No completed floor interactions were recorded for this day.';
  }

  let text = `Today's floor activity included ${totalCustomerParties} customer ${
    totalCustomerParties === 1 ? 'party' : 'parties'
  }, resulting in ${totalSales} completed ${
    totalSales === 1 ? 'sale' : 'sales'
  } and ${totalWalks} ${totalWalks === 1 ? 'walk' : 'walks'}, for an overall ${formatReportPercent(storeConversion)} conversion rate.`;

  if (totalWalks > 0 && walkReasons.length > 0) {
    const [topReason] = walkReasons;
    const walkPartyTotal = walkReasons.reduce((sum, item) => sum + item.count, 0);
    const share =
      walkPartyTotal > 0 ? (topReason.count / walkPartyTotal) * 100 : 0;
    text += ` The most frequently recorded walk reason was ${topReason.reason}, accounting for ${formatReportPercent(share)} of all walks.`;
  }

  const rankedBySales = [...associates].sort((a, b) => b.sales - a.sales);
  const salesLeader = rankedBySales.find((item) => item.sales > 0);
  const partiesLeader = [...associates].sort(
    (a, b) => b.customerParties - a.customerParties,
  )[0];

  if (salesLeader) {
    text += ` ${salesLeader.name} led the team with ${salesLeader.sales} completed ${
      salesLeader.sales === 1 ? 'sale' : 'sales'
    }`;
    if (partiesLeader && partiesLeader.associateId !== salesLeader.associateId) {
      text += `, while ${partiesLeader.name} assisted ${partiesLeader.customerParties} customer ${
        partiesLeader.customerParties === 1 ? 'party' : 'parties'
      } throughout the day.`;
    } else {
      text += '.';
    }
  } else if (partiesLeader && partiesLeader.customerParties > 0) {
    text += ` ${partiesLeader.name} assisted the most customer parties today.`;
  }

  return text;
}

export function buildFloorDayReport(
  session: FloorSession,
  clientName: string,
  meta: FloorReportMeta,
): FloorDayReport {
  const completed = session.completed;
  const totalCustomerParties = completed.reduce(
    (sum, item) => sum + (item.customerCount ?? 1),
    0,
  );
  const totalSales = completed.filter((item) => item.outcome === 'sale').length;
  const totalWalks = completed.filter((item) => item.outcome === 'walk').length;
  const storeConversion =
    totalCustomerParties > 0 ? (totalSales / totalCustomerParties) * 100 : 0;
  const walkReasons = aggregateWalkReasons(completed);

  let associateIndex = 0;
  const associates = session.roster
    .map((associate) => {
      const interactions = completed.filter(
        (item) => item.associateId === associate.id,
      );
      if (interactions.length === 0) {
        return null;
      }

      const customerParties = interactions.reduce(
        (sum, item) => sum + (item.customerCount ?? 1),
        0,
      );
      const sales = interactions.filter((item) => item.outcome === 'sale').length;
      const walks = interactions.filter((item) => item.outcome === 'walk').length;
      const conversionRate =
        customerParties > 0 ? (sales / customerParties) * 100 : 0;
      const associateWalkReasons = aggregateWalkReasons(
        interactions.filter((item) => item.outcome === 'walk'),
      );
      const variant = (associateIndex % 3) as OpenerVariant;
      associateIndex += 1;

      return {
        associateId: associate.id,
        name: associate.name,
        customerParties,
        sales,
        walks,
        conversionRate,
        summaryParagraph: buildAssociateSummary(
          associate.name,
          customerParties,
          sales,
          walks,
          conversionRate,
          associateWalkReasons[0]?.reason ?? null,
          variant,
        ),
      } satisfies AssociateReport;
    })
    .filter((item): item is AssociateReport => item !== null);

  const base = {
    clientName: clientName.trim() || 'Maison de Données',
    displayDate: formatReportDisplayDate(session.date),
    generatedTime: formatReportGeneratedTime(meta.generatedAt),
    dateKey: session.date,
    reportId: meta.reportId,
    totalCustomerParties,
    totalSales,
    totalWalks,
    storeConversion,
    walkReasons,
    associates,
  };

  return {
    ...base,
    conclusion: buildConclusion(base),
  };
}
