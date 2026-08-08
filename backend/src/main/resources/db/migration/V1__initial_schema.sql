CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    occupation VARCHAR(120),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    country VARCHAR(80),
    bio VARCHAR(1000),
    avatar_url VARCHAR(500),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE assets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(140) NOT NULL,
    category VARCHAR(60) NOT NULL,
    purchase_value NUMERIC(19,2) NOT NULL CHECK (purchase_value >= 0),
    current_value NUMERIC(19,2) NOT NULL CHECK (current_value >= 0),
    purchase_date DATE,
    ownership NUMERIC(5,2) NOT NULL DEFAULT 100 CHECK (ownership >= 0 AND ownership <= 100),
    status VARCHAR(30) NOT NULL,
    description VARCHAR(1500),
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_assets_user ON assets(user_id);

CREATE TABLE liabilities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(140) NOT NULL,
    category VARCHAR(60) NOT NULL,
    original_amount NUMERIC(19,2) NOT NULL CHECK (original_amount >= 0),
    outstanding NUMERIC(19,2) NOT NULL CHECK (outstanding >= 0),
    interest_rate NUMERIC(7,3) NOT NULL CHECK (interest_rate >= 0),
    monthly_payment NUMERIC(19,2) NOT NULL CHECK (monthly_payment >= 0),
    start_date DATE,
    due_date DATE,
    status VARCHAR(30) NOT NULL,
    description VARCHAR(1500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_liabilities_user ON liabilities(user_id);

CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    title VARCHAR(160) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount NUMERIC(19,2) NOT NULL,
    account_name VARCHAR(120),
    note VARCHAR(1500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_transactions_user_date ON financial_transactions(user_id, transaction_date DESC);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
