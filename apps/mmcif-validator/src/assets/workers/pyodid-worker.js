/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
let pyodide = null;
let filesLoaded = false;

const initPyodide = async () => {
  if (!pyodide) {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
    });
  }
};

const loadTextFile = async (url) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const trimmed = text.trim().toLowerCase();

  if (trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')) {
    throw new Error(`Expected file at ${url}, but got HTML instead. Check that the file exists under apps/mmcif-validator/public and is being served correctly.`);
  }

  return text;
};

const ensurePythonFilesLoaded = async () => {
  if (filesLoaded) return;

  pyodide.FS.mkdirTree('/app/mmcif_validator/completeness');
  pyodide.FS.mkdirTree('/work');

  const base = '/py/mmcif_validator';

  const pythonFiles = ['validate_mmcif', 'validator', 'cif_parser', 'dict_parser', 'mmcif_types', 'protocol', 'download', 'metadata_completeness'];

  for (const file of pythonFiles) {
    const code = await loadTextFile(`${base}/${file}.txt`);
    pyodide.FS.writeFile(`/app/mmcif_validator/${file}.py`, code, {
      encoding: 'utf8',
    });
  }

  const completenessPythonFiles = ['__init__', 'mandatory_categories'];

  for (const file of completenessPythonFiles) {
    const content = await loadTextFile(`${base}/completeness/${file}.txt`);
    pyodide.FS.writeFile(`/app/mmcif_validator/completeness/${file}.py`, content, {
      encoding: 'utf8',
    });
  }

  const completenessListFiles = ['xray_mandatory_cat.list', 'em_mandatory_cat.list', 'nmr_mandatory_cat.list', 'entity_src_cat.list'];

  for (const file of completenessListFiles) {
    const content = await loadTextFile(`${base}/completeness/${file}`);
    pyodide.FS.writeFile(`/app/mmcif_validator/completeness/${file}`, content, {
      encoding: 'utf8',
    });
  }

  const bridgeCode = await loadTextFile('/py/validator_bridge.txt');
  pyodide.FS.writeFile('/app/validator_bridge.py', bridgeCode, {
    encoding: 'utf8',
  });

  const dictText = await loadTextFile('/py/mmcif_pdbx.dic');
  pyodide.FS.writeFile('/app/mmcif_pdbx.dic', dictText, {
    encoding: 'utf8',
  });

  await pyodide.runPythonAsync(`
      import sys
      sys.path.append('/app')
      sys.path.append('/app/mmcif_validator')
`);

  filesLoaded = true;
};

self.addEventListener('message', async ({ data }) => {
  try {
    await initPyodide();
    await ensurePythonFilesLoaded();
    if (data.type === 'VALIDATE') {
      pyodide.globals.set('cif_text_js', data.payload.cifText);
      pyodide.globals.set('dict_path_js', '/app/mmcif_pdbx.dic');

      const result = await pyodide.runPythonAsync(`
      import json
      from validator_bridge import validate_text

      res = validate_text(cif_text_js, dict_path_js)
      json.dumps(res)
`);

      postMessage({
        type: 'RESULT',
        payload: JSON.parse(result),
      });
    }

    if (data.type === 'LOAD_DICTIONARY') {
      pyodide.globals.set('dict_path_js', '/app/mmcif_pdbx.dic');

      const result = await pyodide.runPythonAsync(`
        import json
        from validator_bridge import get_dictionary_map

        res = get_dictionary_map(dict_path_js)
        json.dumps(res)
  `);

      postMessage({
        type: 'DICTIONARY_READY',
        payload: JSON.parse(result),
      });
      return;
    }
  } catch (err) {
    postMessage({
      type: 'ERROR',
      payload: err?.message || String(err),
    });
  }
});
