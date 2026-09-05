-- Optional display titles for kitchen wishlist links.
-- Existing rows stay valid with title NULL (UI falls back to hostname/path).
ALTER TABLE suggestions
  ADD COLUMN IF NOT EXISTS title TEXT;

-- Allow up to 3 votes per user per lunch round.
-- Existing single-vote rows remain valid under the new unique key.
ALTER TABLE lunch_votes
  DROP CONSTRAINT IF EXISTS lunch_votes_round_id_user_id_key;

ALTER TABLE lunch_votes
  ADD CONSTRAINT lunch_votes_round_id_user_id_restaurant_id_key
  UNIQUE (round_id, user_id, restaurant_id);

CREATE INDEX IF NOT EXISTS lunch_votes_round_id_user_id_idx
  ON lunch_votes (round_id, user_id);

-- New rounds start in voting (one-step). Existing nominating rows stay readable.
ALTER TABLE lunch_rounds
  ALTER COLUMN status SET DEFAULT 'voting';
