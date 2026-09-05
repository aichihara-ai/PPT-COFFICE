-- Drop baked-in demo restaurants (Japadog, Mezze, and the rest of the
-- url-less seed list). User-added Uber Eats rows keep their store URL
-- and stay in the pool. Related nomination/vote rows cascade.
DELETE FROM restaurants
WHERE uber_eats_url IS NULL;
