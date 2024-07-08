import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { prove, verify, verify_proofs } from 'tlsn-js';
import { Proof } from 'tlsn-js/build/types';
import { Watch } from 'react-loader-spinner';

import { notaryConfig, requests } from './requests';

import authProof from './proofs/auth_proof.json';
import attributeProof from './proofs/attribute_proof.json';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);

function App(): ReactElement {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [proof, setProof] = useState<Proof | null>(null);

  const { method, domain, path, cookieStr, body, headers } = requests.dummy;
  https: const webUrl = 'https://' + domain + path;
  const { notaryUrl, websocketProxyUrl } = notaryConfig.local;

  // @NOTE: need to add domain parameter to notaryUrl if using PSE notary
  const onClickProve = useCallback(async () => {
    setProcessing(true);
    const p = await prove(webUrl, {
      method,
      maxTranscriptSize: 20480, //16384 to 20480,
      // maxRecvData: 16384,
      // maxSentData: 16384,
      notaryUrl,
      websocketProxyUrl,
      headers,
      body,
      secretHeaders: [],
      secretResps: [],
      revealedResps: ['"rating"', ','],
    });
    setProof(p);
    setProcessing(false);
  }, [setProof, setProcessing]);

  const onClickVerify = useCallback(async () => {
    setProcessing(true);

    const r = await verify_proofs({
      auth_proof: JSON.stringify(authProof),
      attribute_proof: JSON.stringify(attributeProof),
      notary_url: notaryUrl,
      websocket_url: websocketProxyUrl,
    });

    console.log('result', r);
    setResult(JSON.parse(r));

    setProcessing(false);
  }, [proof, setProcessing]);

  return (
    <div>
      <button
        onClick={!processing ? onClickProve : undefined}
        disabled={processing}
      >
        Start demo
      </button>
      <div>
        <b>Proof: </b>
        {!processing && !proof ? (
          <i>not started</i>
        ) : !proof ? (
          <>
            Proving data from {domain}..
            <Watch
              visible={true}
              height="40"
              width="40"
              radius="48"
              color="#000000"
              ariaLabel="watch-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            Open <i>Developer tools</i> to follow progress
          </>
        ) : (
          <>
            <details>
              <summary>View Proof</summary>
              <pre>{JSON.stringify(proof, null, 2)}</pre>
            </details>
          </>
        )}
      </div>
      <div>
        <button
          onClick={!processing ? onClickVerify : undefined}
          disabled={processing}
        >
          Verify
        </button>
      </div>
      <div>
        <b>Verification: </b>
        {!result ? (
          <i>not started</i>
        ) : !result ? (
          <i>verifying</i>
        ) : (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
