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

  https: const domain = 'kaggle.com';
  const path = '/api/i/users.UsersService/GetCurrentUser';
  const cookieStr =
    'ka_sessionid=42ae7fceb9925bb23a9ed1f6ca2c089e; CSRF-TOKEN=CfDJ8CHCUm6ypKVLpjizcZHPE710behvzMLQjeaPS210sFcV5GsgnFWv2uedN-v6DctSgdxvqyUIk-kK4akpXsCjwyzrveX9H_oCfo6yTUM3pQ; GCLB=CMjvivq9vPqbHBAD; build-hash=7b4be2769bcc2693c6a4dcae319cecda677dc19b; __Host-KAGGLEID=CfDJ8CHCUm6ypKVLpjizcZHPE71JU5t_noYzelPN7B5x3NkKohE0tqhnEJotKqOK9UCfr3Ea4rwXQRIf759bdh1hbgE2auX2x986rg_1jTfMGN3LKZZTP8_h1LC9; pdfcc=5; recaptcha-ca-t=AaGzOmegnidLS4PRKmtWZH2_kPbte5nzRWXl_Zr6oa9MW9eoTYS3SnrT8ACBay27OgYHhWRBkQTogSnaFlMPskyRBoAm7E1nTk26vwXXG-jJ0OlH1eECDGTi2JtFT2nGHPXXXv8IG5q1C2bTcw:U=408777e2a0000000; XSRF-TOKEN=CfDJ8CHCUm6ypKVLpjizcZHPE712YgsbiQ4imqcQViJXIygKh986FeB0dk7_ep4OmeLvn5rm40mSzMXEvnKA0PQ1x9HmEda5e-r8hp0QD76QfFCIJrotbOslQSZNBLwBlxhF9_WZgSrWPFxywc7CVl9V0R4; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiJ6bGltOTMyMDAiLCJuYnQiOiIyMDI0LTA2LTEzVDIxOjA4OjA1LjA5NjA4MjZaIiwiaWF0IjoiMjAyNC0wNi0xM1QyMTowODowNS4wOTYwODI2WiIsImp0aSI6ImQ3OGY0ZWViLWFmMDQtNDJmOS1hMDQzLTJjM2I3MzU1NzE4OSIsImV4cCI6IjIwMjQtMDctMTNUMjE6MDg6MDUuMDk2MDgyNloiLCJ1aWQiOjIxMTQyODg1LCJkaXNwbGF5TmFtZSI6IlpsaW05MzIwMCIsImVtYWlsIjoiYmF0Y2h0cmFpbkBnbWFpbC5jb20iLCJ0aWVyIjoiTm92aWNlIiwidmVyaWZpZWQiOmZhbHNlLCJwcm9maWxlVXJsIjoiL3psaW05MzIwMCIsInRodW1ibmFpbFVybCI6Imh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9rYWdnbGUtYXZhdGFycy90aHVtYm5haWxzL2RlZmF1bHQtdGh1bWIucG5nIiwiZmYiOlsiS2VybmVsc0RyYWZ0VXBsb2FkQmxvYiIsIktlcm5lbHNGaXJlYmFzZUxvbmdQb2xsaW5nIiwiQWxsb3dGb3J1bUF0dGFjaG1lbnRzIiwiS2VybmVsc1NhdmVDZWxsT3V0cHV0IiwiRnJvbnRlbmRFcnJvclJlcG9ydGluZyIsIlJlZ2lzdHJhdGlvbk5ld3NFbWFpbFNpZ251cElzT3B0T3V0IiwiRGlzY3Vzc2lvbnNSZWFjdGlvbnMiLCJEYXRhc2V0VXBsb2FkZXJEdXBsaWNhdGVEZXRlY3Rpb24iLCJEYXRhc2V0c0xsbUZlZWRiYWNrQ2hpcCIsIk1ldGFzdG9yZUNoZWNrQWdncmVnYXRlRmlsZUhhc2hlcyIsIktNTWF0ZXJpYWxVSURpYWxvZyIsIkFsbFJvdXRlc1RvUmVhY3RSb3V0ZXIiXSwiZmZkIjp7Iktlcm5lbEVkaXRvckF1dG9zYXZlVGhyb3R0bGVNcyI6IjMwMDAwIiwiRW1lcmdlbmN5QWxlcnRCYW5uZXIiOiJ7fSIsIkNsaWVudFJwY1JhdGVMaW1pdFFwcyI6IjQwIiwiQ2xpZW50UnBjUmF0ZUxpbWl0UXBtIjoiNTAwIiwiRmVhdHVyZWRDb21tdW5pdHlDb21wZXRpdGlvbnMiOiI2MDA5NSw1NDAwMCw1NzE2Myw4MDg3NCIsIkFkZEZlYXR1cmVGbGFnc1RvUGFnZUxvYWRUYWciOiJkaXNhYmxlZCIsIk1vZGVsSWRzQWxsb3dJbmZlcmVuY2UiOiIzMzAxLDM1MzMiLCJNb2RlbEluZmVyZW5jZVBhcmFtZXRlcnMiOiJ7IFwibWF4X3Rva2Vuc1wiOiAxMjgsIFwidGVtcGVyYXR1cmVcIjogMC40LCBcInRvcF9rXCI6IDUgfSIsIkNvbXBldGl0aW9uTWV0cmljVGltZW91dE1pbnV0ZXMiOiIzMCJ9LCJwaWQiOiJrYWdnbGUtMTYxNjA3Iiwic3ZjIjoid2ViLWZlIiwic2RhayI6IkFJemFTeUE0ZU5xVWRSUnNrSnNDWldWei1xTDY1NVhhNUpFTXJlRSIsImJsZCI6IjdiNGJlMjc2OWJjYzI2OTNjNmE0ZGNhZTMxOWNlY2RhNjc3ZGMxOWIifQ.';
  const method = 'POST';
  const body = JSON.stringify({
    includeGroups: false,
    includeLogins: false,
    includeVerificationStatus: false,
  });

  const webUrl = 'https://www.' + domain + path;

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
        'x-xsrf-token':
          'CfDJ8CHCUm6ypKVLpjizcZHPE712YgsbiQ4imqcQViJXIygKh986FeB0dk7_ep4OmeLvn5rm40mSzMXEvnKA0PQ1x9HmEda5e-r8hp0QD76QfFCIJrotbOslQSZNBLwBlxhF9_WZgSrWPFxywc7CVl9V0R4',
      },
      body,
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
