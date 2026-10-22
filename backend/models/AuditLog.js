import mongoose from 'mongoose';

export const AuditActions = ['CREATE_PLACE', 'UPDATE_PLACE', 'DELETE_PLACE', 'ADMIN_LOGIN', 'FAILED_LOGIN'];

const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    adminId: String,
    adminEmail: String,
    action: { type: String, enum: AuditActions, required: true },
    details: String,
    targetId: String,
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export async function writeAudit({ adminId, adminEmail, action, details, targetId }) {
  return AuditLog.create({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminId,
    adminEmail,
    action,
    details,
    targetId
  });
}
