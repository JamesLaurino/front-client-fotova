import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
  sub:string;
  [key: string]: any;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000); // En secondes
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
}

export function getEmailFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub ?? null;
  } catch (e) {
    console.error('Erreur lors du décodage du token :', e);
    return null;
  }
}
