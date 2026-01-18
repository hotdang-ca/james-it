import { INotificationProvider, EmailMessage, SMSMessage } from '../types'

export class TwilioProvider implements INotificationProvider {
    constructor(private accountSid: string, private authToken: string, private fromNumber: string) { }

    async sendEmail(message: EmailMessage): Promise<boolean> {
        console.warn('TwilioProvider does not support email (usually). Ignoring.')
        return false
    }

    async sendSMS(message: SMSMessage): Promise<boolean> {
        // TODO: Implement actual Twilio API call
        // await client.messages.create({ body: message.body, from: this.fromNumber, to: message.to })
        console.log(`[Twilio Stub] Sending SMS to ${message.to}: ${message.body}`)
        return true
    }
}
