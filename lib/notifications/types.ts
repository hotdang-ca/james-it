export interface EmailMessage {
    to: string
    subject: string
    html: string
    text?: string
}

export interface SMSMessage {
    to: string
    body: string
}

export interface INotificationProvider {
    sendEmail(message: EmailMessage): Promise<boolean>
    sendSMS(message: SMSMessage): Promise<boolean>
}
