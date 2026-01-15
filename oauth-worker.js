// Cloudflare Worker for GitHub OAuth
// Deploy this to Cloudflare Workers

const CLIENT_ID = 'Ov23liWCZ6QaUcMQ8IBu';
const CLIENT_SECRET = 'a07ef08ea2b2b8bc7ea55a51d7155941cfc04896';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // OAuth callback endpoint
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      
      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.CLIENT_ID || CLIENT_ID,
            client_secret: env.CLIENT_SECRET || CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          return new Response(`Error: ${tokenData.error_description}`, { status: 400 });
        }

        // Return HTML that sends the token back to the opener window
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Callback</title>
</head>
<body>
  <script>
    (function() {
      function sendMessage(message) {
        const opener = window.opener;
        if (opener) {
          opener.postMessage(
            'authorization:github:success:' + JSON.stringify(message),
            '*'
          );
        }
      }
      
      sendMessage({
        token: '${tokenData.access_token}',
        provider: 'github'
      });
      
      window.close();
    })();
  </script>
  <p>Authenticating... You can close this window if it doesn't close automatically.</p>
</body>
</html>`;

        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch (error) {
        return new Response(`OAuth error: ${error.message}`, { status: 500 });
      }
    }

    // Auth endpoint - redirects to GitHub
    if (url.pathname === '/auth') {
      const clientId = env.CLIENT_ID || CLIENT_ID;
      const scope = url.searchParams.get('scope') || 'repo,user';
      const redirectUri = `${url.origin}/callback`;
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      return Response.redirect(githubAuthUrl, 302);
    }

    // Default response
    return new Response('Chaya OAuth Server', { 
      status: 200,
      headers: CORS_HEADERS 
    });
  },
};
