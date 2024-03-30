import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decodedToken = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
        req['user'] = decodedToken; 
        next(); 
      } catch (error) {
        console.error('Error occurred while verifying token:', error);
        res.status(401).json({ message: 'Unauthorized' }); // Return 401 Unauthorized if token verification fails
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' }); // Return 401 Unauthorized if no token is provided
    }
  }
}