export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            contacts: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    email: string
                    service_interest: string | null
                    message: string | null
                    status: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    email: string
                    service_interest?: string | null
                    message?: string | null
                    status?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    email?: string
                    service_interest?: string | null
                    message?: string | null
                    status?: string | null
                }
            }
            jobs: {
                Row: {
                    id: string
                    created_at: string
                    contact_id: string | null
                    status: string | null
                    description: string | null
                    quoted_price: number | null
                    start_time: string | null
                    end_time_est: string | null
                    stripe_payment_link: string | null
                    customer_uuid: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    contact_id?: string | null
                    status?: string | null
                    description?: string | null
                    quoted_price?: number | null
                    start_time?: string | null
                    end_time_est?: string | null
                    stripe_payment_link?: string | null
                    customer_uuid?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    contact_id?: string | null
                    status?: string | null
                    description?: string | null
                    quoted_price?: number | null
                    start_time?: string | null
                    end_time_est?: string | null
                    stripe_payment_link?: string | null
                    customer_uuid?: string | null
                }
            }
            messages: {
                Row: {
                    id: string
                    created_at: string
                    job_id: string | null
                    sender_role: string
                    content: string
                    is_read: boolean | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    job_id?: string | null
                    sender_role: string
                    content: string
                    is_read?: boolean | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    job_id?: string | null
                    sender_role?: string
                    content?: string
                    is_read?: boolean | null
                }
            }
            geolocation_logs: {
                Row: {
                    id: number
                    created_at: string
                    job_id: string | null
                    latitude: number
                    longitude: number
                }
                Insert: {
                    id?: number
                    created_at?: string
                    job_id?: string | null
                    latitude: number
                    longitude: number
                }
                Update: {
                    id?: number
                    created_at?: string
                    job_id?: string | null
                    latitude?: number
                    longitude?: number
                }
            }
        }
    }
}
