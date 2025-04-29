// server/src/modules/audit-logs/interceptors/audit-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../audit-logs.service';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { Request } from 'express';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, user, body, ip, headers } = request;
    
    // Skip logging for certain endpoints like health checks
    if (url.includes('/health') || url.includes('/audit-logs')) {
      return next.handle();
    }
    
    // Determine entity type and action based on URL and method
    const entityType = this.getEntityTypeFromUrl(url);
    const action = this.getActionFromMethod(method);
    
    if (!entityType || !action) {
      return next.handle();
    }
    
    const userId = user ? (user as any).id : null;
    const entityId = this.getEntityIdFromUrl(url);
    
    const auditLogDto: CreateAuditLogDto = {
      entityType,
      entityId,
      action,
      userId,
      ipAddress: ip,
      userAgent: headers['user-agent'],
      description: `${method} ${url}`,
      newValues: method !== 'GET' ? body : undefined,
    };
    
    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.auditLogsService.create(auditLogDto);
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      }),
    );
  }
  
  private getEntityTypeFromUrl(url: string): any {
    const parts = url.split('/').filter(Boolean);
    
    if (parts.length < 2) {
      return null;
    }
    
    const entityMap = {
      'leads': 'lead',
      'tasks': 'task',
      'users': 'user',
      'notes': 'note',
      'campaigns': 'campaign',
      'integrations': 'integration',
      'teams': 'team',
      'files': 'file',
    };
    
    return entityMap[parts[1]];
  }
  
  private getEntityIdFromUrl(url: string): string | undefined {
    const parts = url.split('/').filter(Boolean);
    
    if (parts.length < 3) {
      return undefined;
    }
    
    return parts[2];
  }
  
  private getActionFromMethod(method: string): any {
    const actionMap = {
      'GET': 'view',
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'update',
      'DELETE': 'delete',
    };
    
    return actionMap[method];
  }
}