import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';

const region = import.meta.env.VITE_COGNITO_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

if (!region || !userPoolId || !clientId) {
  console.error('Missing required Cognito environment variables');
}

const poolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};

export const userPool = new CognitoUserPool(poolData);

export type CognitoLoginResponse = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  email: string;
};

export type CognitoSession = CognitoUserSession | null;

export const cognitoLogin = (
  email: string,
  password: string
): Promise<CognitoLoginResponse> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        resolve({
          idToken,
          accessToken,
          refreshToken,
          email,
        });
      },
      onFailure: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const cognitoSignOut = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const getCognitoUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

export const getIdToken = async (): Promise<string | null> => {
  const cognitoUser = getCognitoUser();
  if (!cognitoUser) return null;

  return new Promise((resolve) => {
    cognitoUser.getSession((err: Error | null, session: CognitoSession) => {
      if (err) {
        resolve(null);
      } else if (session && session.isValid()) {
        resolve(session.getIdToken().getJwtToken());
      } else {
        resolve(null);
      }
    });
  });
};

export const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getEmailFromIdToken = (idToken: string): string | null => {
  const payload = decodeJwt(idToken);
  return payload?.email ? String(payload.email) : null;
};
