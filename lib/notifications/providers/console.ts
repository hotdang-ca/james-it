import { INotificationProvider, EmailMessage, SMSMessage } from '../types'

export class ConsoleLogProvider implements INotificationProvider {
    async sendEmail(message: EmailMessage): Promise<boolean> {
        console.log('--- [DEV] EMAIL NOTIFICATION ---')
        console.log(`To: ${message.to}`)
        console.log(`Subject: ${message.subject}`)
        console.log(`Body (HTML): ${message.html}`)
        console.log('--------------------------------')
        return true
    }

    async sendSMS(message: SMSMessage): Promise<boolean> {
        console.log('--- [DEV] SMS NOTIFICATION ---')
        console.log(`To: ${message.to}`)
        console.log(`Body: ${message.body}`)
        console.log('------------------------------')
        return true
    }
}
