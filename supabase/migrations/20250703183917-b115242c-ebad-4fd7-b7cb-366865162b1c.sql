-- Create the user_role enum type if it doesn't exist
CREATE TYPE user_role AS ENUM ('admin', 'client', 'vendor');