import Notification, { INotification } from '../models/Notification';

export const createNotification = async (data: {
  citizenId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  applicationId?: string;
}): Promise<INotification> => {
  try {
    const notif = new Notification({
      citizenId: data.citizenId,
      title: data.title,
      message: data.message,
      type: data.type || 'INFO',
      applicationId: data.applicationId,
      read: false
    });
    await notif.save();
    return notif;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return new Notification(data);
  }
};
