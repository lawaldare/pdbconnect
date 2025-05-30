import * as d3 from 'https://cdn.skypack.dev/d3@6';
import { fmt2, formatLabel } from './utils.js';
import { PARAMS } from './params.js';

const W = 550;
const H = 34;
const pad = { l: 75, r: 25 };

export function drawSliders(rows, selectedId) {
  const datum = rows.find((r) => r[0] === selectedId)?.[1] ?? rows[0][1];
  const wrap = d3.select('#sliders').html(''); // clear old

  const ext = Object.fromEntries(PARAMS.map((k) => [k, d3.extent(rows.map((r) => r[1][k]))]));

  PARAMS.forEach((k) => {
    const row = wrap.append('div').attr('class', 'slider-row');
    row.append('div').attr('class', 'param-name').text(formatLabel(k));

    /* svg for this slider */
    const svg = row
      .append('svg')
      .attr('width', W)
      .attr('height', H + 12);

    /* per-slider gradient so defs ids don’t collide */
    const gid = `grad-${k}`;
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', gid).attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#afe2f2');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#429fbf');

    const x = d3
      .scaleLinear()
      .domain(ext[k])
      .range([pad.l, W - pad.r])
      .clamp(true);

    /* track */
    svg
      .append('rect')
      .attr('x', x(ext[k][0]))
      .attr('y', H / 2 - 5)
      .attr('width', x(ext[k][1]) - x(ext[k][0]))
      .attr('height', 10)
      .attr('fill', `url(#${gid})`);

    /* handle */
    svg
      .append('circle')
      .attr('cx', x(datum[k]))
      .attr('cy', H / 2)
      .attr('r', 5)
      .attr('class', 'slider-circle');

    /* value label */
    svg
      .append('text')
      .attr('x', x(datum[k]))
      .attr('y', H / 2 - 8)
      .attr('text-anchor', 'middle')
      .attr('class', 'slider-text')
      .text(fmt2(datum[k]));

    /* min / max numbers */
    svg
      .append('text')
      .attr('x', x(ext[k][0]) - 6)
      .attr('y', H / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('class', 'slider-text')
      .text(fmt2(ext[k][0]));

    svg
      .append('text')
      .attr('x', x(ext[k][1]) - 6)
      .attr('y', H / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('class', 'slider-text')
      .text(fmt2(ext[k][1]));

    /* explicit “min / max” tags */
    svg
      .append('text')
      .attr('x', x(ext[k][0]))
      .attr('y', H + 6)
      .attr('text-anchor', 'middle')
      .attr('class', 'slider-text')
      .text('min');

    svg
      .append('text')
      .attr('x', x(ext[k][1]))
      .attr('y', H + 6)
      .attr('text-anchor', 'middle')
      .attr('class', 'slider-text')
      .text('max');
  });
}
