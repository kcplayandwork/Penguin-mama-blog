// GitHub OAuth 第二步：GitHub 導回這裡，帶著 code，換成 access token
// 再用 postMessage 把 token 傳回 Decap CMS 的登入視窗
function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .filter(Boolean)
      .map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
  );
}

function renderMessage(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const statusText = status === 'success' ? '登入成功，這個視窗會自動關閉…' : '登入失敗';
  const detail = status === 'success' ? '' : JSON.stringify(payload);
  return `<!DOCTYPE html>
<html>
  <body>
    <p id="status">${statusText}</p>
    <pre id="detail">${detail}</pre>
    <script>
      (function () {
        if (!window.opener) {
          document.getElementById('status').textContent =
            '找不到開啟這個視窗的來源頁面，請直接關閉分頁，回到 /admin 重新登入一次。';
          return;
        }
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
          setTimeout(function () { window.close(); }, 300);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parseCookies(req.headers.cookie);

  if (!state || state !== cookies.oauth_state) {
    res.status(400).send(renderMessage('error', { message: '驗證失敗，請重新登入' }));
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      res.status(400).send(renderMessage('error', data));
      return;
    }

    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; Max-Age=0');
    res.status(200).send(renderMessage('success', { token: data.access_token, provider: 'github' }));
  } catch (err) {
    res.status(500).send(renderMessage('error', { message: err.message }));
  }
}
