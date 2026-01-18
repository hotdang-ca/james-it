import { INotificationProvider, EmailMessage, SMSMessage } from './types'
import { ConsoleLogProvider } from './providers/console'
import { TwilioProvider } from './providers/twilio'
import { MailgunProvider } from './providers/mailgun'

class NotificationService {
    private provider: INotificationProvider

    constructor() {
        // Simple factory logic based on env vars
        // For this prototype, we default to Console provider unless explicit keys are set
        if (process.env.TWILIO_SID && process.env.MAILGUN_API_KEY) {
            // Ideally we might want a CompositeProvider to handle both Email (Mailgun) and SMS (Twilio)
            // For now, let's just stick to Console for safety until keys are provided.
            this.provider = new ConsoleLogProvider()
        } else {
            this.provider = new ConsoleLogProvider()
        }
    }

    async sendMagicLink(email: string, jobUuid: string, customerName: string) {
        const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/job/${jobUuid}`

        return this.provider.sendEmail({
            to: email,
            subject: 'Your James-It Job Status & Link',
            html: `
        <h2>Hi ${customerName},</h2>
        <p>Your job with James-It has been created.</p>
        <p>You can view the status, chat with me, and track progress securely at the following link:</p>
        <p><a href="${magicLink}">${magicLink}</a></p>
        <br/>
        <p>Thanks,<br/>James</p>
      `,
            text: `Hi ${customerName}, your job is ready. View it here: ${magicLink}`
        })
    }

    // Add other business-logic methods here (sendReceipt, requestReview, etc.)
}

export const notificationService = new NotificationService()
