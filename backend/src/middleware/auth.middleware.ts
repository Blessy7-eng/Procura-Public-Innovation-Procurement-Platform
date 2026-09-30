import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  userRole?: UserRole;
  userId?: string;
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const roleHeader = (req.headers['x-user-role'] as UserRole) || (req.query.role as UserRole);

    if (allowedRoles.length > 0 && roleHeader && !allowedRoles.includes(roleHeader)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges for this GovTech action',
        requiredRoles: allowedRoles,
        providedRole: roleHeader,
      });
    }

    req.userRole = roleHeader;
    next();
  };
}
