// GitHub OAuth 第一步：把使用者導去 GitHub 登入授權頁
// 需要在 Vercel 專案的環境變數設定 OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET
export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('尚未設定 OAUTH_CLIENT_ID 環境變數');
    return;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${req.headers.host}/api/callback`;
  const state = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  res.setHeader(
    'Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    state,
  });

  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
  res.end();
}
