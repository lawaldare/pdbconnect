import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pdbc-pisa-comming-soon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="wrap">
      <section class="card" role="region" aria-label="Coming soon">
        <div class="content">
          <div>
            <div class="badge">
              <span class="dot" aria-hidden="true"></span>
              <span>Work in progress</span>
            </div>

            <h1>PISA is currently under active developement</h1>
            <p class="lead">A fresh experience is on the way — faster, cleaner, and more useful. We’re putting the finishing touches on it now.</p>

            <!-- <div class="cta">
              <button class="btn btn-primary" type="button">Notify me</button>
              <button class="btn btn-secondary" type="button">Follow updates</button>
            </div> -->
          </div>

          <aside class="panel" aria-label="Status panel">
            <p class="mini-title">Build status</p>
            <div class="progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100">
              <div class="bar"></div>
            </div>

            <div class="stats">
              <div class="stat">
                <strong>Design</strong>
                <span>Locked in</span>
              </div>
              <div class="stat">
                <strong>Build</strong>
                <span>In progress</span>
              </div>
              <div class="stat">
                <strong>Launch</strong>
                <span>Very soon</span>
              </div>
            </div>

            <div class="footer">
              <span> © EMBL-EBI · PDBe</span>
              <a href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noopener"> PDBe home </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      .wrap {
        color: var(--text);
        background: radial-gradient(1200px 800px at 20% 10%, rgba(124, 92, 255, 0.35), transparent 60%),
          radial-gradient(900px 700px at 90% 30%, rgba(34, 211, 238, 0.28), transparent 55%), linear-gradient(160deg, var(--bg-1), var(--bg-2));
        overflow-x: hidden;

        min-height: 100%;
        display: grid;
        place-items: center;
        padding: 28px 18px;
      }

      .card {
        width: min(920px, 100%);
        background: var(--card);
        border: 1px solid var(--card-border);
        border-radius: 20px;
        padding: clamp(22px, 4vw, 40px);
        backdrop-filter: blur(10px);
        box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        position: relative;
        overflow: hidden;
      }

      /* subtle moving highlight */
      .card::before {
        content: '';
        position: absolute;
        inset: -120px;
        background: conic-gradient(from 140deg, transparent, rgba(124, 92, 255, 0.22), transparent, rgba(34, 211, 238, 0.18), transparent);
        animation: spin 10s linear infinite;
        filter: blur(18px);
        opacity: 0.7;
      }

      .content {
        position: relative; /* above ::before */
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: clamp(18px, 4vw, 34px);
        align-items: center;
      }

      @media (max-width: 820px) {
        .content {
          grid-template-columns: 1fr;
        }
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(0, 0, 0, 0.18);
        font-size: 13px;
        letter-spacing: 0.2px;
        width: fit-content;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        box-shadow: 0 0 0 5px rgba(124, 92, 255, 0.12);
      }

      h1 {
        margin: 14px 0 10px;
        font-size: clamp(30px, 4.6vw, 52px);
        line-height: 1.05;
        letter-spacing: -0.6px;
      }

      .lead {
        margin: 0 0 22px;
        color: var(--muted);
        font-size: clamp(15px, 1.6vw, 18px);
        line-height: 1.6;
        max-width: 60ch;
      }

      .cta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      .btn {
        appearance: none;
        border: 0;
        cursor: pointer;
        padding: 12px 16px;
        border-radius: 12px;
        font-weight: 650;
        font-size: 14px;
        letter-spacing: 0.2px;
        transition:
          transform 120ms ease,
          filter 120ms ease;
      }

      .btn-primary {
        color: #06101a;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        box-shadow: 0 10px 30px rgba(124, 92, 255, 0.22);
      }

      .btn-secondary {
        color: var(--text);
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
      }

      .btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.02);
      }
      .btn:active {
        transform: translateY(0px);
      }

      /* Right side */
      .panel {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.2);
        padding: 18px;
      }

      .mini-title {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.75);
        margin: 0 0 10px;
      }

      .progress {
        height: 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .bar {
        height: 100%;
        width: 62%;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        animation: load 1.1s ease-out;
      }

      .stats {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .stat {
        padding: 12px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .stat strong {
        display: block;
        font-size: 16px;
        letter-spacing: -0.2px;
      }

      .stat span {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.72);
      }

      .footer {
        margin-top: 18px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.62);
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      a {
        color: rgba(255, 255, 255, 0.78);
        text-decoration: none;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.28);
      }
      a:hover {
        color: #fff;
        border-bottom-color: rgba(255, 255, 255, 0.45);
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes load {
        from {
          width: 0%;
        }
        to {
          width: 62%;
        }
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .card::before,
        .bar {
          animation: none;
        }
      }
    `,
  ],
})
export class PisaCommingSoonComponent {}
