import type { FloorDayReport } from '@/lib/floorReport';
import { formatReportPercent } from '@/lib/floorReport';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textToHtml(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function renderWalkReasonBlock(paragraph: string | null): string {
  if (!paragraph) {
    return '';
  }

  if (paragraph.startsWith('Walk reasons included:')) {
    const lines = paragraph.split('\n');
    const [heading, ...bullets] = lines;
    return `
      <p class="walk-heading">${escapeHtml(heading)}</p>
      <ul class="walk-list">
        ${bullets
          .map((line) => {
            const cleaned = line.replace(/^•\s*/, '');
            return `<li>${escapeHtml(cleaned)}</li>`;
          })
          .join('')}
      </ul>
    `;
  }

  return `<p class="walk-copy">${textToHtml(paragraph)}</p>`;
}

/** Build editorial HTML for the Floor Summary PDF. */
export function buildFloorReportHtml(report: FloorDayReport): string {
  const associateSections = report.associates
    .map(
      (associate) => `
        <section class="associate-block">
          <p class="body-copy">${textToHtml(associate.summaryParagraph)}</p>
          ${renderWalkReasonBlock(associate.walkReasonParagraph)}
        </section>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
      rel="stylesheet"
    />
    <style>
      @page {
        margin: 48px 56px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 48px 56px 64px;
        background: #f5f2ec;
        color: #121212;
        font-family: "EB Garamond", "Times New Roman", serif;
        font-size: 13px;
        line-height: 1.65;
      }

      .client-name {
        font-size: 22px;
        letter-spacing: -0.2px;
        margin: 0 0 8px;
      }

      .date-line {
        font-size: 13px;
        margin: 0 0 6px;
      }

      .title-line {
        font-size: 13px;
        margin: 0 0 28px;
      }

      .rule {
        border-top: 1px solid #121212;
        margin: 24px 0;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.4px;
        margin: 0 0 16px;
      }

      .metric-line {
        margin: 0 0 8px;
      }

      .associate-block {
        margin-bottom: 28px;
      }

      .body-copy,
      .walk-copy,
      .walk-heading,
      .conclusion {
        margin: 0 0 12px;
      }

      .walk-list {
        margin: 0 0 12px 18px;
        padding: 0;
      }

      .walk-list li {
        margin-bottom: 6px;
      }

      .footer {
        margin-top: 36px;
        font-size: 11px;
        color: #121212;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <header>
      <h1 class="client-name">${escapeHtml(report.clientName)}</h1>
      <p class="date-line">${escapeHtml(report.dateLabel)}</p>
      <p class="title-line">Floor Summary | printed results</p>
    </header>

    <div class="rule"></div>

    <section>
      <h2 class="section-title">Store Details</h2>
      <p class="metric-line">Total Customers seen: ${report.totalCustomerParties}</p>
      <p class="metric-line">Total Sales: ${report.totalSales}</p>
      <p class="metric-line">Total Walks: ${report.totalWalks}</p>
      <p class="metric-line">Store Conversion: ${formatReportPercent(report.storeConversion)}</p>
    </section>

    <div class="rule"></div>

    <section>
      <h2 class="section-title">Associate Performance</h2>
      ${
        associateSections ||
        '<p class="body-copy">No associate interactions were completed today.</p>'
      }
    </section>

    <div class="rule"></div>

    <section>
      <h2 class="section-title">Conclusion</h2>
      <p class="conclusion">${textToHtml(report.conclusion)}</p>
    </section>

    <p class="footer">Maison de Données · L&apos;Étape</p>
  </body>
</html>`;
}
