import Cookies from 'js-cookie';

export function saveAuth(accessToken, refreshToken, user) {
  Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
}

export function clearAuth() {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('user');
}

export function getUserFromCookie() {
  try {
    const raw = Cookies.get('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return Cookies.get('accessToken') || null;
}

export function getRefreshToken() {
  return Cookies.get('refreshToken') || null;
}

export function isLoggedIn() {
  return !!Cookies.get('accessToken');
}

export function isAdminUser() {
  const user = getUserFromCookie();
  return user?.role === 'admin';
}

