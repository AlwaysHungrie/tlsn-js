const requests = {
    dummy: {
        method: 'GET',
        domain: 'dummyjson.com',
        path: '/products/1',
        cookieStr: '',
        body: null
    },
    notion: {
        method: 'POST',
        domain: 'notion.so',
        path: '/api/v3/getTeams',
        cookieStr: 'notion_browser_id=f31ad1a7-31eb-402b-b0c8-677e0bfaa603; device_id=f7cb4ad2-d54a-45b6-beb0-94918e47b343; NEXT_LOCALE=en-US; token_v2=v02%3Auser_token_or_cookies%3A8XwJOicQsYFH3lMGmgmZ648XWS4VLi0Tq86GYsN0C4l-xRj2wsov3OPLGTIJmwIlwh6WGf1EkSH_QRv3Vh8a36jr473rG2evPInpRMiEI76OXSHiMPjb5NPgXjzBF_mQ-F9d; notion_users=[%2229164011-057f-4bb0-8dc8-dc6901a07913%22%2C%22c9659223-073a-45c2-b9fd-655c40dc855b%22]; _cfuvid=LTsbxiVsMqrYh2vlPGA5x1h74HRWZmk5rxHlozLXtcw-1717429218340-0.0.1.1-604800000; notion_user_id=c9659223-073a-45c2-b9fd-655c40dc855b; notion_cookie_consent={%22id%22:%224be5d444-c2b7-4408-9df9-fec4e8ff0aa2%22%2C%22permission%22:{%22necessary%22:true%2C%22targeting%22:true%2C%22preference%22:true%2C%22performance%22:true}%2C%22policy_version%22:%22v9%22}; notion_check_cookie_consent=false; __cf_bm=t5txwMRc3Lh9Y6Hfholr7jByg5MHexJggbOI7baOtuk-1717479158-1.0.1.1-.DnCPBhpWYQEn3dSlIp07bEmtPq2CzvfkUIAsKHxaMaWH7_vDgzOUNci1yIpFmKEJlMsArKkQgglN8ffKnQNwA; notion_locale=en-US/autodetect; amp_af43d4=f31ad1a731eb402bb0c8677e0bfaa603.Yzk2NTkyMjMwNzNhNDVjMmI5ZmQ2NTVjNDBkYzg1NWI=..1hvgqud2k.1hvgsaqei.12t.34.161',
        body: JSON.stringify({
            spaceId: '4661a76e-c153-4d6c-a592-1ee6ca33f891',
            includeArchived: false,
        }),
    },
    kaggle: {
        method: 'POST',
        domain: 'www.kaggle.com',
        path: '/api/i/users.UsersService/GetCurrentUser',
        cookieStr: 'ka_sessionid=42ae7fceb9925bb23a9ed1f6ca2c089e; CSRF-TOKEN=CfDJ8CHCUm6ypKVLpjizcZHPE73Z7mTlrHy5JnkzRHcFIhU-A-0vbiY3SlQYRKpoEpk9GOcIliD0gJO_2tQSYhWNNbv83VRqW8O0if_fvJ5vgQ; GCLB=CO7s64L2y5XYThAD; __Host-KAGGLEID=CfDJ8GYiNaMVVSVCnegdIdgHCPM4JUuqWwnzu9VKtCsZsUu7bWZpE2V-Y5kzGgnsayU8-L2K3Mic-ZOL7f_mvMqn5cHeJuZI7Bt8EGEBy2ePlQ7GgUHqR_ZBz1dN; build-hash=bd5dc5b6280bba0568aa813e9308c10e932857d9; pdfcc=1; XSRF-TOKEN=CfDJ8GYiNaMVVSVCnegdIdgHCPPsPxEY5DY3s996AqeWKsfKhOD2JlJnnrNBL87lJ5gsK-7ki_nzspMTJEd1iFJ4Yv3wWdDcS7dovDQmByvKOd2E9Q8CtSxpvuBZD9sWJq0g9DhFfFNmoMwXuz2DU-l6Otg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiJ6bGltOTMyMDAiLCJuYnQiOiIyMDI0LTA2LTI4VDA0OjAyOjI4LjUwNTU4MjZaIiwiaWF0IjoiMjAyNC0wNi0yOFQwNDowMjoyOC41MDU1ODI2WiIsImp0aSI6IjdjM2Y1NTE0LWI0ODctNDc0Mi05MDRhLWIwZjI1ZDQyZDJkMCIsImV4cCI6IjIwMjQtMDctMjhUMDQ6MDI6MjguNTA1NTgyNloiLCJ1aWQiOjIxMTQyODg1LCJkaXNwbGF5TmFtZSI6IlpsaW05MzIwMCIsImVtYWlsIjoiYmF0Y2h0cmFpbkBnbWFpbC5jb20iLCJ0aWVyIjoiTm92aWNlIiwidmVyaWZpZWQiOmZhbHNlLCJwcm9maWxlVXJsIjoiL3psaW05MzIwMCIsInRodW1ibmFpbFVybCI6Imh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9rYWdnbGUtYXZhdGFycy90aHVtYm5haWxzL2RlZmF1bHQtdGh1bWIucG5nIiwiZmYiOlsiS2VybmVsc0RyYWZ0VXBsb2FkQmxvYiIsIktlcm5lbHNGaXJlYmFzZUxvbmdQb2xsaW5nIiwiQWxsb3dGb3J1bUF0dGFjaG1lbnRzIiwiS2VybmVsc1NhdmVDZWxsT3V0cHV0IiwiRnJvbnRlbmRFcnJvclJlcG9ydGluZyIsIlJlZ2lzdHJhdGlvbk5ld3NFbWFpbFNpZ251cElzT3B0T3V0IiwiRGlzY3Vzc2lvbnNSZWFjdGlvbnMiLCJEYXRhc2V0VXBsb2FkZXJEdXBsaWNhdGVEZXRlY3Rpb24iLCJEYXRhc2V0c0xsbUZlZWRiYWNrQ2hpcCIsIk1ldGFzdG9yZUNoZWNrQWdncmVnYXRlRmlsZUhhc2hlcyIsIktNTWF0ZXJpYWxVSURpYWxvZyIsIkFsbFJvdXRlc1RvUmVhY3RSb3V0ZXIiLCJDaGVja0VmZmljaWVudEV4dGVuc2lvbnMiLCJNdWlUYWJCYXIiXSwiZmZkIjp7Iktlcm5lbEVkaXRvckF1dG9zYXZlVGhyb3R0bGVNcyI6IjMwMDAwIiwiRW1lcmdlbmN5QWxlcnRCYW5uZXIiOiJ7fSIsIkNsaWVudFJwY1JhdGVMaW1pdFFwcyI6IjQwIiwiQ2xpZW50UnBjUmF0ZUxpbWl0UXBtIjoiNTAwIiwiRmVhdHVyZWRDb21tdW5pdHlDb21wZXRpdGlvbnMiOiI2MDA5NSw1NDAwMCw1NzE2Myw4MDg3NCIsIkFkZEZlYXR1cmVGbGFnc1RvUGFnZUxvYWRUYWciOiJkaXNhYmxlZCIsIk1vZGVsSW5mZXJlbmNlUGFyYW1ldGVycyI6InsgXCJtYXhfdG9rZW5zXCI6IDEyOCwgXCJ0ZW1wZXJhdHVyZVwiOiAwLjQsIFwidG9wX2tcIjogNSB9IiwiQ29tcGV0aXRpb25NZXRyaWNUaW1lb3V0TWludXRlcyI6IjMwIn0sInBpZCI6ImthZ2dsZS0xNjE2MDciLCJzdmMiOiJ3ZWItZmUiLCJzZGFrIjoiQUl6YVN5QTRlTnFVZFJSc2tKc0NaV1Z6LXFMNjU1WGE1SkVNcmVFIiwiYmxkIjoiYmQ1ZGM1YjYyODBiYmEwNTY4YWE4MTNlOTMwOGMxMGU5MzI4NTdkOSJ9.',
        body: JSON.stringify({
            includeGroups: false,
            includeLogins: false,
            includeVerificationStatus: false,
        }),
    },
};


//=====================================================
const notaryConfig = {
    local: {
        notaryUrl: 'http://localhost:7047',
        websocketProxyUrl: 'ws://localhost:55688'
    },
    pse: {
        notaryUrl: 'https://notary.pse.dev/v0.1.0-alpha.5',
        websocketProxyUrl: 'wss://notary.pse.dev/proxy?token='
    },
    eternis: {
        notaryUrl: 'https://notary.eternis.ai',
        websocketProxyUrl: 'wss://notary.eternis.ai:55688'
    },
    eternisDev: {
        notaryUrl: 'https://eternis-dev.com',
        websocketProxyUrl: 'wss://eternis-dev.com:55688'
    }
}



export { requests, notaryConfig };
