import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { prove, verify } from 'tlsn-js';
import { Proof } from 'tlsn-js/build/types';
import { Watch } from 'react-loader-spinner';

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

  // https: const domain = 'dummyjson.com';
  // const path = '/products/1';
  // const cookieStr = '';
  // const method = 'GET';

  // https: const domain = 'notion.so';
  // const path = '/api/v3/getTeams';
  // const cookieStr =
  //   'notion_browser_id=f31ad1a7-31eb-402b-b0c8-677e0bfaa603; device_id=f7cb4ad2-d54a-45b6-beb0-94918e47b343; NEXT_LOCALE=en-US; token_v2=v02%3Auser_token_or_cookies%3A8XwJOicQsYFH3lMGmgmZ648XWS4VLi0Tq86GYsN0C4l-xRj2wsov3OPLGTIJmwIlwh6WGf1EkSH_QRv3Vh8a36jr473rG2evPInpRMiEI76OXSHiMPjb5NPgXjzBF_mQ-F9d; notion_users=[%2229164011-057f-4bb0-8dc8-dc6901a07913%22%2C%22c9659223-073a-45c2-b9fd-655c40dc855b%22]; _cfuvid=LTsbxiVsMqrYh2vlPGA5x1h74HRWZmk5rxHlozLXtcw-1717429218340-0.0.1.1-604800000; notion_user_id=c9659223-073a-45c2-b9fd-655c40dc855b; notion_cookie_consent={%22id%22:%224be5d444-c2b7-4408-9df9-fec4e8ff0aa2%22%2C%22permission%22:{%22necessary%22:true%2C%22targeting%22:true%2C%22preference%22:true%2C%22performance%22:true}%2C%22policy_version%22:%22v9%22}; notion_check_cookie_consent=false; __cf_bm=t5txwMRc3Lh9Y6Hfholr7jByg5MHexJggbOI7baOtuk-1717479158-1.0.1.1-.DnCPBhpWYQEn3dSlIp07bEmtPq2CzvfkUIAsKHxaMaWH7_vDgzOUNci1yIpFmKEJlMsArKkQgglN8ffKnQNwA; notion_locale=en-US/autodetect; amp_af43d4=f31ad1a731eb402bb0c8677e0bfaa603.Yzk2NTkyMjMwNzNhNDVjMmI5ZmQ2NTVjNDBkYzg1NWI=..1hvgqud2k.1hvgsaqei.12t.34.161';
  // const method = 'POST';
  // const body = JSON.stringify({
  //   spaceId: '4661a76e-c153-4d6c-a592-1ee6ca33f891',
  //   includeArchived: false,
  // });

  https: const domain = 'huggingface.co';
  const path =
    '/api/recent-activity?limit=30&feedType=user&activityType=all&skip=0&savePreferences=true';
  const cookieStr =
    '__stripe_mid=281fb493-1907-4048-87b2-b87f559121d7cb77fb; token=OTbzbLBnKbovkeSjIPWGYCFWzNRvoWEAUZSXmEAoKDCtAPRZfBZfDEvVDtXTFOAWJqvDKCKreVFpOhFFuDwtbZnRtPLHvMoFyjOATXPLVgfxMLxcVBEztKbuorBMXTNp; token=OTbzbLBnKbovkeSjIPWGYCFWzNRvoWEAUZSXmEAoKDCtAPRZfBZfDEvVDtXTFOAWJqvDKCKreVFpOhFFuDwtbZnRtPLHvMoFyjOATXPLVgfxMLxcVBEztKbuorBMXTNp; __stripe_sid=e84faefc-df3f-4cbe-9150-ca80e63e731d108d1c; aws-waf-token=c809c0ad-879e-4ee4-8875-01a51b466e60:EQoAn54wlKkfAAAA:1xxBYqXx/ihNRPBijOdlT0iVeTZB3SQ3cb1+eNx7zP2x9pZFCg37/Z59KORTxCXVK4FwMLRQJ8rVqsNlnbtFoUeETDV/ZN9YC33JKAKNQ2eZiYcNru50FXa8gt40sJpjgYwE6fJf08OJE1kWXjmtoSHF9HsE2MlpecETM/ACrv1REd6oI3/HbqF34xr2nc9EdNBrPu2kYE4SZJOiM29t2Bj31I6ZhMK+xCD7UYYTcIMdwwe6BBls3+Vb2vd1qKcLiY1u+e+GjPUw3buikw==';
  const method = 'GET';

  const webUrl = 'https://' + domain + path;

  //=====================================================
  // const notaryUrl = 'https://notary.pse.dev/v0.1.0-alpha.5';
  // const websocketProxyUrl = 'wss://notary.pse.dev/proxy?token=' + domain;

  const notaryUrl = 'http://localhost:7047';
  const websocketProxyUrl = 'ws://localhost:55688';

  // const notaryUrl = 'https://notary.eternis.ai';
  // const websocketProxyUrl = 'wss://notary.eternis.ai:55688';

  // const notaryUrl = 'https://eternis-dev.com';
  // const websocketProxyUrl = 'wss://eternis-dev.com:55688';

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
        Cookie: cookieStr,
        'Content-Type': 'application/json',
        //'Content-Length': body.length.toString(),
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
