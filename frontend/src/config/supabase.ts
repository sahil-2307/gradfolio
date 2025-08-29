import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  phone?: string
  subscription_plan: 'free' | 'basic' | 'pro'
  subscription_expires_at?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Portfolio {
  id: string
  user_id: string
  username: string
  title: string
  template_type: 'modern' | 'creative' | 'professional' | 'minimal'
  portfolio_data: any
  html_content?: string
  is_published: boolean
  is_public: boolean
  custom_domain?: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: string
  user_id: string
  portfolio_id: string
  file_name: string
  file_type: 'image' | 'pdf' | 'video'
  file_size: number
  file_url: string
  uploaded_at: string
}

export interface College {
  id: string
  name: string
  domain?: string
  contact_email: string
  phone?: string
  address?: string
  subscription_plan: 'trial' | 'basic' | 'premium'
  student_limit: number
  created_at: string
  is_active: boolean
}

export interface Payment {
  id: string
  user_id?: string
  college_id?: string
  company_id?: string
  amount: number
  currency: string
  payment_method: string
  gateway: 'razorpay' | 'cashfree'
  gateway_payment_id?: string
  status: 'pending' | 'success' | 'failed' | 'refunded'
  plan_type: string
  billing_period: 'monthly' | 'yearly'
  created_at: string
  paid_at?: string
}