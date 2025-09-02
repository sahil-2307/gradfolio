-- Create user_payments table for tracking payments
CREATE TABLE IF NOT EXISTS user_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium')),
    amount DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_payments_user_id ON user_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payments_template_id ON user_payments(template_id);
CREATE INDEX IF NOT EXISTS idx_user_payments_plan_type ON user_payments(plan_type);
CREATE INDEX IF NOT EXISTS idx_user_payments_status ON user_payments(status);
CREATE INDEX IF NOT EXISTS idx_user_payments_created_at ON user_payments(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own payment records
CREATE POLICY "Users can view own payments" ON user_payments
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: System can insert payment records (for API endpoints)
CREATE POLICY "System can insert payments" ON user_payments
    FOR INSERT WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_payments_updated_at BEFORE UPDATE ON user_payments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add some comments for documentation
COMMENT ON TABLE user_payments IS 'Stores user payment records for template purchases';
COMMENT ON COLUMN user_payments.plan_type IS 'Type of plan purchased: basic (₹10) or premium (₹99)';
COMMENT ON COLUMN user_payments.template_id IS 'Template ID that was purchased (1=Basic, 2=Plus, 3=Pro, 4=Executive)';
COMMENT ON COLUMN user_payments.amount IS 'Amount paid in INR';
COMMENT ON COLUMN user_payments.payment_id IS 'Cashfree payment ID for reference';
COMMENT ON COLUMN user_payments.order_id IS 'Cashfree order ID for reference';