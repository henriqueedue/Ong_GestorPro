// Notification service for Ong Gestor Pro
// Simple notification via email or logging

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new Error("Notification title is required.");
  }
  if (!isNonEmptyString(input.content)) {
    throw new Error("Notification content is required.");
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new Error(`Notification title must be at most ${TITLE_MAX_LENGTH} characters.`);
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new Error(`Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`);
  }

  return { title, content };
};

/**
 * Sends a notification. Currently logs to console.
 * Can be extended to send emails via SMTP, SendGrid, etc.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  // Log the notification
  console.log(`[NOTIFICATION] ${title}: ${content}`);

  // TODO: Implement email/SMS notifications
  // Options: SendGrid, AWS SES, Nodemailer, etc.

  return true;
}