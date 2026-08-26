declare global {
  interface AuthPayload {
    userId: string;
    sessionId: string;
    jti: string;
  }

  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export {AuthPayload};