## WebAssembly usage in the mmCIF Editor

The mmCIF Editor uses WebAssembly through [Pyodide](https://pyodide.org/) to run the existing Python mmCIF validation logic directly in the browser.

This is used so that the editor can validate mmCIF text client-side without rewriting the Python validator in TypeScript or sending user input to a backend validation service.

The implementation consists of:

| Area                | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| Angular service     | `CifValidationService` creates and communicates with a Web Worker                  |
| Web Worker          | Loads Pyodide, loads Python validator files, and executes validation code          |
| Python bridge       | `validator_bridge.py` exposes validation and dictionary functions to JavaScript    |
| Static assets       | Python validator files and the PDBx/mmCIF dictionary are served from public assets |
| WebAssembly runtime | Pyodide runs Python in the browser using WebAssembly                               |

The Angular service sends messages to the worker:

```ts
this.worker.postMessage({
  type: 'VALIDATE',
  payload: { cifText },
});
```
