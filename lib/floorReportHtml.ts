import type { FloorDayReport, WalkReasonStat } from '@/lib/floorReport';
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

function renderMetricRow(label: string, value: string): string {
  return `
    <div class="metric-row">
      <span class="metric-label">${escapeHtml(label)}</span>
      <span class="metric-value">${escapeHtml(value)}</span>
    </div>
  `;
}

function renderWalkReasonRows(reasons: WalkReasonStat[]): string {
  const items = reasons.slice(0, reasons.length === 1 ? 1 : 3);
  return items
    .map(
      (item) => `
        <div class="walk-reason-row">
          <span class="walk-reason-label">• ${escapeHtml(item.reason)}</span>
          <span class="walk-reason-leader" aria-hidden="true"></span>
          <span class="walk-reason-count">${item.count}</span>
        </div>
      `,
    )
    .join('');
}

function renderNoteLines(count: number): string {
  return Array.from({ length: count }, () => '<div class="note-line"></div>').join(
    '',
  );
}

/** Build editorial HTML for the Floor Summary PDF. */
export function buildFloorReportHtml(report: FloorDayReport): string {
  const associateSections = report.associates
    .map(
      (associate) => `
        <article class="associate-block">
          <p class="body-copy">${textToHtml(associate.summaryParagraph)}</p>
        </article>
      `,
    )
    .join('');

  const walkReasonSection =
    report.walkReasons.length > 0
      ? `
        <section class="section">
          <h2 class="section-title">Walk Reasons</h2>
          ${renderWalkReasonRows(report.walkReasons)}
        </section>
        <div class="rule"></div>
      `
      : '';

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
        margin: 52px 60px;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #121212;
        font-family: "EB Garamond", "Times New Roman", serif;
        font-size: 13px;
        line-height: 1.7;
      }

      body {
        padding: 52px 60px 72px;
      }

      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        pointer-events: none;
        text-align: center;
        opacity: 0.04;
        color: #121212;
        letter-spacing: 4px;
        text-transform: uppercase;
        line-height: 1.5;
      }

      .watermark-brand {
        font-size: 22px;
        font-weight: 500;
        margin: 0 0 8px;
      }

      .watermark-app {
        font-size: 16px;
        letter-spacing: 6px;
        margin: 0;
      }

      .document {
        position: relative;
        z-index: 1;
      }

      .letterhead {
        text-align: center;
        margin-bottom: 40px;
      }

      .letterhead-brand {
        font-size: 12px;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin: 0 0 6px;
        font-weight: 500;
      }

      .letterhead-app {
        font-size: 14px;
        letter-spacing: 5px;
        text-transform: uppercase;
        margin: 0;
        font-weight: 400;
      }

      .report-meta {
        margin-bottom: 36px;
      }

      .report-title {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 18px;
        letter-spacing: -0.2px;
      }

      .meta-line {
        margin: 0 0 6px;
      }

      .meta-label {
        display: inline-block;
        min-width: 88px;
      }

      .rule {
        border-top: 1px solid #121212;
        margin: 36px 0;
      }

      .section {
        margin-bottom: 12px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin: 0 0 20px;
      }

      .metrics-grid {
        max-width: 380px;
      }

      .metric-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 12px;
      }

      .metric-label {
        flex: 1;
      }

      .metric-value {
        min-width: 56px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .associate-block {
        margin-bottom: 28px;
      }

      .body-copy,
      .conclusion {
        margin: 0 0 12px;
      }

      .walk-reason-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        max-width: 420px;
        margin-bottom: 10px;
      }

      .walk-reason-label {
        white-space: nowrap;
      }

      .walk-reason-leader {
        flex: 1;
        border-bottom: 1px dotted #bdb8b0;
        min-width: 24px;
        transform: translateY(-3px);
      }

      .walk-reason-count {
        min-width: 24px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .second-page {
        page-break-before: always;
        break-before: page;
      }

      .notes-lines {
        margin-top: 20px;
      }

      .note-line {
        border-bottom: 1px solid #121212;
        height: 32px;
        margin-bottom: 18px;
      }

      .report-footer {
        margin-top: 48px;
        text-align: center;
      }

      .footer-rule {
        border-top: 1px solid #121212;
        width: 220px;
        margin: 0 auto 20px;
      }

      .footer-brand {
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 0 0 8px;
      }

      .footer-line {
        font-size: 11px;
        margin: 0 0 4px;
        color: #121212;
      }

      .footer-id {
        font-size: 11px;
        margin-top: 12px;
        letter-spacing: 0.4px;
      }
    </style>
  </head>
  <body>
    <div class="watermark" aria-hidden="true">
      <p class="watermark-brand">Maison de Données</p>
      <p class="watermark-app">L&apos;Étape</p>
    </div>

    <div class="document">
      <header class="letterhead">
        <p class="letterhead-brand">Maison de Données</p>
        <p class="letterhead-app">L&apos;Étape</p>
      </header>

      <div class="report-meta">
        <h1 class="report-title">Floor Summary</h1>
        <p class="meta-line">
          <span class="meta-label">Client:</span>
          ${escapeHtml(report.clientName)}
        </p>
        <p class="meta-line">
          <span class="meta-label">Date:</span>
          ${escapeHtml(report.displayDate)}
        </p>
        <p class="meta-line">
          <span class="meta-label">Generated:</span>
          ${escapeHtml(report.generatedTime)}
        </p>
      </div>

      <div class="rule"></div>

      <section class="section">
        <h2 class="section-title">Store Details</h2>
        <div class="metrics-grid">
          ${renderMetricRow('Total Customer Parties', String(report.totalCustomerParties))}
          ${renderMetricRow('Total Sales', String(report.totalSales))}
          ${renderMetricRow('Total Walks', String(report.totalWalks))}
          ${renderMetricRow('Store Conversion', formatReportPercent(report.storeConversion))}
        </div>
      </section>

      <div class="rule"></div>

      <section class="section">
        <h2 class="section-title">Associate Performance</h2>
        ${
          associateSections ||
          '<p class="body-copy">No associate interactions were completed today.</p>'
        }
      </section>

      <div class="rule"></div>

      ${walkReasonSection}

      <section class="second-page">
        <h2 class="section-title">Conclusion</h2>
        <p class="conclusion">${textToHtml(report.conclusion)}</p>

        <div class="rule"></div>

        <section class="section">
          <h2 class="section-title">Manager Notes</h2>
          <div class="notes-lines">
            ${renderNoteLines(5)}
          </div>
        </section>

        <footer class="report-footer">
          <div class="footer-rule"></div>
          <p class="footer-brand">Maison de Données · L&apos;Étape</p>
          <p class="footer-line">Analytics in Steps</p>
          <p class="footer-line">Generated automatically from Floor activity</p>
          <p class="footer-id">Report ID: ${escapeHtml(report.reportId)}</p>
        </footer>
      </section>
    </div>
  </body>
</html>`;
}
