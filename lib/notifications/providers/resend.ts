import { Resend } from 'resend'
import { INotificationProvider, EmailMessage, SMSMessage } from '../types'

export class ResendProvider implements INotificationProvider {
    private client: Resend

    constructor(apiKey: string) {
        this.client = new Resend(apiKey)
    }

    async sendEmail(message: EmailMessage): Promise<boolean> {
        try {
            console.log(`[Resend] Sending email to ${message.to}`)

            const { data, error } = await this.client.emails.send({
                from: 'James-It <onboarding@resend.dev>', // Update this if you have a custom domain
                to: [message.to],
                subject: message.subject,
                html: message.html || message.text,
                text: message.text || ''
            })

            if (error) {
                console.error('[Resend] Error:', error)
                return false
            }

            console.log(`[Resend] Success! ID: ${data?.id}`)
            return true
        } catch (err) {
            console.error('[Resend] Exception:', err)
            return false
        }
    }

    async sendSMS(message: SMSMessage): Promise<boolean> {
        console.warn('[Resend] SMS not supported by Resend. Skipping.')
        return Promise.resolve(false)
    }
}
