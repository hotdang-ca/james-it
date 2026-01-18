import { INotificationProvider, EmailMessage, SMSMessage } from '../types'

export class MailgunProvider implements INotificationProvider {
    constructor(private apiKey: string, private domain: string) { }

    async sendEmail(message: EmailMessage): Promise<boolean> {
        // TODO: Implement actual Mailgun API call
        console.log(`[Mailgun Stub] Sending Email to ${message.to}: ${message.subject}`)
        return true
    }

    async sendSMS(message: SMSMessage): Promise<boolean> {
        console.warn('MailgunProvider does not support SMS. Ignoring.')
        return false
    }
}
