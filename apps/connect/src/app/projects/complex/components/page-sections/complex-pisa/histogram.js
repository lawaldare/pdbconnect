import * as d3 from 'd3';
import { formatLabel } from '../../../complex.constant';

// import * as d3 from "https://cdn.skypack.dev/d3@6";
// import { formatLabel } from "./utils.js";

/* -------------------------------------------------------------
   SVG geometry constants
   -------------------------------------------------------------
   W  = total SVG width   (inside the <svg>)
   H  = total SVG height
   M  = chart margins – the whitespace you keep around the
        plotting area for axes, tick-labels, title, etc.

        • t : top    margin  (room for the title)
        • r : right  margin  (room if you add a legend later)
        • b : bottom margin  (space for x-axis tick labels)
        • l : left   margin  (space for y-axis tick labels)
---------------------------------------------------------------- */
const W = 600,
  H = 260,
  M = { t: 14, r: 14, b: 50, l: 50 };

export function drawHistogram(rows, selectedId, param, selector) {
  const vals = rows.map((r) => r[1][param]);
  const selVal = rows.find((r) => r[0] === selectedId)?.[1][param];

  const svg = d3.select(selector).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();

  /* scales */
  const x = d3
    .scaleLinear()
    .domain(d3.extent(vals))
    .nice()
    .range([M.l, W - M.r]);
  const bins = d3.bin().domain(x.domain()).thresholds(10)(vals);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([H - M.b, M.t]);

  /* axes */
  const gx = svg
    .append('g')
    .attr('transform', `translate(0,${H - M.b})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('~s')));
  gx.selectAll('text').attr('transform', 'rotate(-35)').style('text-anchor', 'end');

  svg.append('g').attr('transform', `translate(${M.l},0)`).call(d3.axisLeft(y).ticks(5));

  /* bars */
  svg
    .selectAll('rect')
    .data(bins)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.x0))
    .attr('y', (d) => y(d.length))
    .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr('height', (d) => y(0) - y(d.length))
    .attr('class', 'bin-rect');

  /* highlight selected assembly */
  if (selVal != null) {
    const xpos = x(selVal);
    svg
      .append('line')
      .attr('x1', xpos)
      .attr('x2', xpos)
      .attr('y1', M.t)
      .attr('y2', H - M.b)
      .attr('class', 'highlight-line');
    svg
      .append('circle')
      .attr('cx', xpos)
      .attr('cy', H - M.b)
      .attr('r', 4)
      .attr('fill', 'red');
  }

  /* title */
  svg
    .append('text')
    .attr('x', W / 2)
    .attr('y', M.t - 2)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .text(formatLabel(param));
}
