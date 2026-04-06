function ensureBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Social login is only available in the browser');
  }
}

let googleScriptPromise;
let facebookInitPromise;

function hasScript(id) {
  return !!document.getElementById(id);
}

function waitFor(checker, { timeoutMs = 10000, intervalMs = 100 } = {}) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    function poll() {
      if (checker()) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('SDK initialization timed out'));
        return;
      }

      window.setTimeout(poll, intervalMs);
    }

    poll();
  });
}

function loadScript(src, id) {
  ensureBrowser();

  const existing = document.getElementById(id);
  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadGoogleSdk() {
  if (!googleScriptPromise) {
    googleScriptPromise = (async () => {
      if (!hasScript('google-identity-services')) {
        await loadScript('https://accounts.google.com/gsi/client', 'google-identity-services');
      }

      await waitFor(() => !!window.google?.accounts?.oauth2, { timeoutMs: 15000 });
    })();
  }

  await googleScriptPromise;
}

async function loadFacebookSdk(appId) {
  if (!facebookInitPromise) {
    facebookInitPromise = (async () => {
      if (!hasScript('facebook-jssdk')) {
        await loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk');
      }

      await waitFor(() => !!window.FB, { timeoutMs: 15000 });

      window.FB.init({
        appId,
        cookie: false,
        xfbml: false,
        version: 'v23.0',
      });
    })();
  }

  await facebookInitPromise;
}

export async function getGoogleAccessToken() {
  ensureBrowser();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing');
  }

  await loadGoogleSdk();

  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response) => {
        if (response?.error || !response?.access_token) {
          reject(new Error(response?.error || 'Google login was not completed'));
          return;
        }

        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(error?.message || error?.type || 'Google login failed'));
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  });
}

export async function getFacebookAccessToken() {
  ensureBrowser();

  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  if (!appId) {
    throw new Error('NEXT_PUBLIC_FACEBOOK_APP_ID is missing');
  }

  await loadFacebookSdk(appId);

  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        const token = response?.authResponse?.accessToken;

        if (!token) {
          reject(new Error('Facebook login was cancelled or failed'));
          return;
        }

        resolve(token);
      },
      { scope: 'public_profile' }
    );
  });
}
