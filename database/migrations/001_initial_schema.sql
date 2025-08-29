-- GradFolio Initial Database Schema
-- Run this in Supabase SQL Editor

-- 1. Users table (Authentication & Profile)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  subscription_plan VARCHAR DEFAULT 'free', -- free, basic, pro
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Portfolios table
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  template_type VARCHAR NOT NULL, -- modern, creative, professional, minimal
  portfolio_data JSONB NOT NULL, -- All portfolio content
  html_content TEXT, -- Generated HTML
  is_published BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  custom_domain VARCHAR,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Media files table
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL, -- image, pdf, video
  file_size INTEGER,
  file_url VARCHAR NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Colleges table (B2B)
CREATE TABLE colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  domain VARCHAR UNIQUE, -- college.edu
  contact_email VARCHAR NOT NULL,
  phone VARCHAR,
  address TEXT,
  subscription_plan VARCHAR DEFAULT 'trial', -- trial, basic, premium
  student_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 5. College users mapping
CREATE TABLE college_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'student', -- student, admin, placement_officer
  graduation_year INTEGER,
  course VARCHAR,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Companies table (B2B)
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  domain VARCHAR,
  contact_email VARCHAR NOT NULL,
  phone VARCHAR,
  industry VARCHAR,
  size VARCHAR, -- startup, small, medium, large
  subscription_plan VARCHAR DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 7. Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  college_id UUID REFERENCES colleges(id),
  company_id UUID REFERENCES companies(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR DEFAULT 'INR',
  payment_method VARCHAR, -- upi, card, netbanking
  gateway VARCHAR, -- razorpay, cashfree
  gateway_payment_id VARCHAR,
  status VARCHAR DEFAULT 'pending', -- pending, success, failed, refunded
  plan_type VARCHAR, -- basic, pro, college_basic, company_premium
  billing_period VARCHAR, -- monthly, yearly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- 8. Portfolio views analytics
CREATE TABLE portfolio_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  viewer_ip VARCHAR,
  viewer_location VARCHAR,
  user_agent TEXT,
  referrer VARCHAR,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Job applications tracking
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  portfolio_id UUID REFERENCES portfolios(id),
  job_title VARCHAR,
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR DEFAULT 'applied', -- applied, viewed, shortlisted, rejected, hired
  notes TEXT
);

-- Essential indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_username ON portfolios(username);
CREATE INDEX idx_portfolios_published ON portfolios(is_published) WHERE is_published = true;
CREATE INDEX idx_media_files_portfolio_id ON media_files(portfolio_id);
CREATE INDEX idx_college_users_college_id ON college_users(college_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_portfolio_views_portfolio_id ON portfolio_views(portfolio_id);
CREATE INDEX idx_portfolio_views_date ON portfolio_views(viewed_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY portfolios_own_data ON portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY portfolios_public_read ON portfolios FOR SELECT USING (is_public = true AND is_published = true);
CREATE POLICY media_files_own_data ON media_files FOR ALL USING (auth.uid() = user_id);