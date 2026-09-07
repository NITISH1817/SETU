import AuditLog, { IAuditLog } from '../models/AuditLog';

export const logAuditEvent = async (data: {
  userId?: string;
  userEmail?: string;
  role?: string;
  action: string;
  citizenId?: string;
  revenueId?: string;
  applicationId?: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: any;
  ipAddress?: string;
}): Promise<IAuditLog> => {
  try {
    const log = new AuditLog({
      ...data,
      timestamp: new Date()
    });
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Return transient mock audit record if DB write fails
    return new AuditLog({ ...data, timestamp: new Date() });
  }
};
