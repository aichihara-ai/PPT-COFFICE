-- Seed restaurants for Vancouver office lunch pool
INSERT INTO restaurants (name, notes) VALUES
    ('Japadog', 'Classic Vancouver street food'),
    ('Mezze', 'Mediterranean bowls and wraps'),
    ('Nuba', 'Lebanese'),
    ('Earls', 'Reliable sit-down option'),
    ('Cactus Club', 'Good for groups'),
    ('Honest Greens', 'Salads and bowls'),
    ('Tractor Foods', 'Healthy bowls'),
    ('Chipotle', 'Quick Mexican'),
    ('Poké Man', 'Poke bowls'),
    ('Banana Leaf', 'Malaysian'),
    ('Peaceful Restaurant', 'Chinese'),
    ('Jamjar', 'Middle Eastern'),
    ('Nando''s', 'Peri-peri chicken'),
    ('Freshii', 'Light meals'),
    ('Burgers + Fries', 'Comfort food')
ON CONFLICT (name) DO NOTHING;
