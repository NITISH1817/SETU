import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  citizenId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  applicationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    citizenId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'], default: 'INFO' },
    read: { type: Boolean, default: false },
    applicationId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
