import { INotificationProvider, EmailMessage, SMSMessage } from './types'
import { ConsoleLogProvider } from './providers/console'
import { ResendProvider } from './providers/resend'

class NotificationService {
    private provider: INotificationProvider
    // Using 'any' for the specific client to allow flexible type checking internally before assignment
    private client: any

    constructor() {
        // Factory logic
        if (process.env.RESEND_API_KEY) {
            this.client = new ResendProvider(process.env.RESEND_API_KEY)
        } else if (process.env.TWILIO_SID && process.env.MAILGUN_API_KEY) {
            // Fallback or future use
            this.client = new ConsoleLogProvider()
        } else {
            this.client = new ConsoleLogProvider()
        }

        this.provider = this.client as INotificationProvider
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
    async sendContactFormSubmission(data: { name: string, email: string, service_interest: string, message: string }) {
        // Send TO the admin (James)
        const adminEmail = process.env.ADMIN_EMAIL || 'james@hotdang.ca'

        return this.provider.sendEmail({
            to: adminEmail,
            subject: `New Inquiry: ${data.service_interest} - ${data.name}`,
            html: `
        <h2>New Web Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Service:</strong> ${data.service_interest}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
          ${data.message.replace(/\n/g, '<br/>')}
        </blockquote>
      `,
            text: `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service_interest}\nMessage: ${data.message}`
        })
    }
}

export const notificationService = new NotificationService()
