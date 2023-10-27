    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('Admin', 'User');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('confirmed', 'in progress', 'finished');
        END IF;
    END $$;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password varchar NOT NULL,
    phonenumber text NOT NULL UNIQUE,
    role user_role
    );

    CREATE TABLE IF NOT EXISTS marks (
      id SERIAL PRIMARY KEY,
      mark text
    );

    CREATE TABLE IF NOT EXISTS vehicle (
      id SERIAL PRIMARY KEY, 
      mark_id INTEGER,
      model text,
      vehicle_year INTEGER,
      FOREIGN KEY (mark_id) REFERENCES marks (id)
    );

    CREATE TABLE IF NOT EXISTS parts (
      id SERIAL PRIMARY KEY, 
      part_name text, 
      description text,
      price MONEY,
      availability BOOLEAN,
      repair_cost MONEY,
      repair_time interval,
      vehicle_id int,
      FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, 
      order_date DATE, 
      status order_status,
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_parts (
      id SERIAL PRIMARY KEY, 
      order_id INTEGER, 
      part_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (part_id) REFERENCES parts (id)
    );