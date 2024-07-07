import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { prove, verify } from 'tlsn-js';
import { Proof } from 'tlsn-js/build/types';
import { Watch } from 'react-loader-spinner';

import { notaryConfig, requests } from './requests';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);

function App(): ReactElement {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    time: number;
    sent: string;
    recv: string;
    notaryUrl: string;
  } | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);

  const { method, domain, path, cookieStr, body } = requests.dummy;
  https: const webUrl = 'https://' + domain + path;
  const { notaryUrl, websocketProxyUrl } = notaryConfig.local;

  // @NOTE: need to add domain to notaryUrl if using PSE notary

  const onClick = useCallback(async () => {
    setProcessing(true);
    const p = await prove(webUrl, {
      method,
      maxTranscriptSize: 20480, //16384 to 20480,
      // maxRecvData: 16384,
      // maxSentData: 16384,
      notaryUrl,
      websocketProxyUrl,
      headers: {
        // Cookie: cookieStr,
        'Content-Type': 'application/json',
        //'Content-Length': body.length.toString(),
        //   'x-xsrf-token': 'CfDJ8CHCUm6ypKVLpjizcZHPE712YgsbiQ4imqcQViJXIygKh986FeB0dk7_ep4OmeLvn5rm40mSzMXEvnKA0PQ1x9HmEda5e-r8hp0QD76QfFCIJrotbOslQSZNBLwBlxhF9_WZgSrWPFxywc7CVl9V0R4',
      },
      // body,
      secretHeaders: [],
      secretResps: [],
    });
    setProof(p);
  }, [setProof, setProcessing]);

  useEffect(() => {
    (async () => {
      if (proof) {
        const r = await verify(proof);
        setResult(r);
        setProcessing(false);
      }
    })();
  }, [proof, setResult]);

  return (
    <div>
      <button onClick={!processing ? onClick : undefined} disabled={processing}>
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
        <b>Verification: </b>
        {!proof ? (
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
