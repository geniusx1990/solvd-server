 INSERT INTO marks (mark) VALUES('Mercedes-Benz'),
    ('BMW'),
    ('Honda'),
    ('Kia'),
    ('Toyota'),
    ('Aston Martin'),
    ('Alfa Romeo'),
    ('Citroen'),
    ('Bentley'),
    ('Ferrari'),
    ('Ford'),
    ('Peugeot'),
    ('Volkswagen'),
    ('Volvo'),
    ('Seat');

    -- For Mercedes-Benz (mark_id = 1)
INSERT INTO vehicle (mark_id, vehicle_year)
VALUES
  (1, 2000),
  (1, 2001),
  (1, 2002),
  (1, 2003),
  (1, 2004),
  (1, 2005),
  (1, 2006),
  (1, 2007),
  (1, 2008),
  (1, 2009),
  (1, 2010);

-- For BMW (mark_id = 2)
INSERT INTO vehicle (mark_id, vehicle_year)
VALUES
  (2, 2001),
  (2, 2002),
  (2, 2003),
  (2, 2004),
  (2, 2005),
  (2, 2006),
  (2, 2007),
  (2, 2008),
  (2, 2010);

-- For Honda (mark_id = 3)
INSERT INTO vehicle (mark_id, vehicle_year)
VALUES
  (3, 2000),
  (3, 2001),
  (3, 2002),
  (3, 2003),
  (3, 2004),
  (3, 2005),
  (3, 2006),
  (3, 2007),
  (3, 2008),
  (3, 2009),
  (3, 2010);



INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Brake Pads', 'Front brake pads for safe braking', '$30.50', true, '$50.00', '3 hours', id
FROM vehicle;

INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Engine Oil Filter', 'High-quality engine oil filter', '$10.99', true, '$0.00', '2 hours', id
FROM vehicle;


INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Air Filter', 'Engine air filter for clean air intake', '$8.99', true, '$0.00', '1 hour', id
FROM vehicle;

INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Spark Plugs', 'Set of spark plugs for ignition', '$15.99', true, '$20.00', '1 hour', id
FROM vehicle;

INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Transmission Fluid', 'Transmission fluid for smooth shifts', '$12.99', true, '$0.00', '2 hours', id
FROM vehicle;

INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Radiator Fan', 'Cooling fan for engine temperature control', '$25.99', true, '$40.00', '2 hours', id
FROM vehicle;

INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id)
SELECT
  'Oxygen sensor', 'Oxygen sensor for fuel efficiency', '$19.99', true, '$30.00', '2 hour', id
FROM vehicle;