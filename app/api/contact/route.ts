import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { notificationService } from '@/lib/notifications/service';

export async function POST(request: Request) {
    // Contact Form Submission Handler
    try {
        const supabase = await createClient()
        const data = await request.json()
        const { name, email, service_interest, message } = data;

        // 1. Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Insert into Supabase
        const { error: dbError } = await supabase
            .from('contacts')
            // @ts-ignore
            .insert({
                name,
                email,
                service_interest,
                message,
                status: 'NEW'
            })

        if (dbError) {
            console.error('Supabase Error:', dbError)
            return NextResponse.json({ error: dbError.message }, { status: 500 })
        }

        // 3. Send Email Notification
        await notificationService.sendContactFormSubmission({
            name,
            email,
            service_interest: service_interest || 'General',
            message
        });

        return NextResponse.json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
