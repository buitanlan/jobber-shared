import { Request, Response, NextFunction } from 'express'

const token: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];
export function verifyGatewayRequest(req: Request, res: Response, next: NextFunction) {
  if(!req.headers?.gatewayToken) {

  }
  if (token.includes(req.path)) {
    next();
  } else {
    next();
  }
}
