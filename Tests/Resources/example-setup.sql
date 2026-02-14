-- Sample SQL script for testing resources directory
-- This file demonstrates how SQL files can be stored in resources/
-- and executed from installer or startup scripts

-- Create a test table
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some test data
INSERT INTO test_table (name) VALUES ('Test Resource 1');
INSERT INTO test_table (name) VALUES ('Test Resource 2');
INSERT INTO test_table (name) VALUES ('Test Resource 3');

-- Display success message
SELECT 'Test SQL script executed successfully from resources directory!' as message;
