-- Baseline migration: matches existing db/schema.sql for databases that already have these tables.
-- Safe to run on empty DB; existing deployments should use `prisma migrate resolve --applied 0_init`.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    room TEXT NOT NULL CHECK (room IN ('room_a', 'room_b')),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title TEXT NOT NULL DEFAULT 'Meeting',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_date ON bookings (room, booking_date);

CREATE TABLE IF NOT EXISTS suggestions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'bought', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    item TEXT PRIMARY KEY CHECK (item IN ('coffee', 'milk')),
    status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'low')),
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO inventory (item, status) VALUES ('coffee', 'ok'), ('milk', 'ok')
ON CONFLICT (item) DO NOTHING;

CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    notes TEXT,
    uber_eats_url TEXT UNIQUE,
    menu_preview JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lunch_rounds (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'nominating' CHECK (status IN ('nominating', 'voting', 'closed')),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    winner_restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL,
    voting_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lunch_nominations (
    id SERIAL PRIMARY KEY,
    round_id INTEGER NOT NULL REFERENCES lunch_rounds(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (round_id, user_id)
);

CREATE TABLE IF NOT EXISTS lunch_candidates (
    id SERIAL PRIMARY KEY,
    round_id INTEGER NOT NULL REFERENCES lunch_rounds(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    nomination_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (round_id, restaurant_id)
);

CREATE TABLE IF NOT EXISTS lunch_votes (
    id SERIAL PRIMARY KEY,
    round_id INTEGER NOT NULL REFERENCES lunch_rounds(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (round_id, user_id)
);
