# Temporary Custom Nightingale Builds

This folder contains temporary builds of modified Nightingale libraries needed for PDBe-specific functionality. These builds are **not intended for long-term use** and should be removed once the official Nightingale library supports the required features.

## Included Libraries

### 1. `pdbe-pv-conservation`

- Based on commit: [`f8b9da1`](https://github.com/ebi-webcomponents/nightingale/tree/f8b9da1be92286816026b90c4e47060dc1f11bde) from the `midlik/sequence-conservation` branch.
- Provides sequence conservation support required by PDBe.
- Modified for Angular compatibility (see below)

### 2. `pdbe-pv-new-core`

- Required dependency for `pdbe-pv-conservation`.
- Pulled from the same commit as above.
- `pdbe-pv-conservation` was modified to support this renamed core (`@nightingale-elements/nightingale-new-core-adam`)

### 3. `pdbe-track-canvas`

- Based on [`@nightingale-elements/nightingale-track-canvas`](https://www.npmjs.com/package/@nightingale-elements/nightingale-track-canvas).
- Modified to include `FeatureLocation` coloring logic consistent with PDBe API endpoint formats.

  See [`@nightingale-elements/nightingale-track`](https://www.npmjs.com/package/@nightingale-elements/nightingale-track) for `FeatureLocation` type.

## Future Cleanup

These custom builds should be **removed** once:

- The official Nightingale library supports conservation track rendering natively.
- `FeatureLocation` coloring and PDBe-specific compatibility are merged upstream.

Until then, this folder serves as a bridge for current functional needs.
