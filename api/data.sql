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
INSERT INTO vehicle (mark_id, model, vehicle_year)
VALUES
  (1, 'A-class', 2000),
  (1, 'A-class', 2001),
  (1, 'A-class', 2002),
  (1, 'A-class', 2003),
  (1, 'A-class', 2004),
  (1, 'A-class', 2005),
  (1, 'A-class', 2006),
  (1, 'A-class', 2007),
  (1, 'A-class', 2008),
  (1, 'A-class', 2009),
  (1, 'A-class', 2010),
  (1, 'C-class', 2000),
  (1, 'C-class', 2001),
  (1, 'C-class', 2002),
  (1, 'C-class', 2003),
  (1, 'C-class', 2004),
  (1, 'C-class', 2005),
  (1, 'C-class', 2006),
  (1, 'C-class', 2007),
  (1, 'C-class', 2008),
  (1, 'C-class', 2009),
  (1, 'C-class', 2010),
  (1, 'E-class', 2000),
  (1, 'E-class', 2001),
  (1, 'E-class', 2002),
  (1, 'E-class', 2003),
  (1, 'E-class', 2004),
  (1, 'E-class', 2005),
  (1, 'E-class', 2006),
  (1, 'E-class', 2007),
  (1, 'E-class', 2008),
  (1, 'E-class', 2009),
  (1, 'E-class', 2010);

-- For BMW (mark_id = 2)
INSERT INTO vehicle (mark_id, model, vehicle_year)
VALUES
  (2, 'X1', 2001),
  (2, 'X1', 2002),
  (2, 'X1', 2003),
  (2, 'X1', 2004),
  (2, 'X1', 2005),
  (2, 'X1', 2006),
  (2, 'X1', 2007),
  (2, 'X1', 2008),
  (2, 'X1', 2010),
  (2, 'X1', 2011),
  (2, 'X3', 2000),
  (2, 'X3', 2001),
  (2, 'X3', 2002),
  (2, 'X3', 2003),
  (2, 'X3', 2004),
  (2, 'X3', 2005),
  (2, 'X3', 2006),
  (2, 'X3', 2007),
  (2, 'X3', 2008),
  (2, 'X3', 2009),
  (2, 'X3', 2010),
  (2, 'X5', 2000),
  (2, 'X5', 2001),
  (2, 'X5', 2002),
  (2, 'X5', 2003),
  (2, 'X5', 2004),
  (2, 'X5', 2005),
  (2, 'X5', 2006),
  (2, 'X5', 2007),
  (2, 'X5', 2008),
  (2, 'X5', 2009),
  (2, 'X5', 2010);

-- For Honda (mark_id = 3)
INSERT INTO vehicle (mark_id, model, vehicle_year)
VALUES
  (3, 'Civic', 2000),
  (3, 'Civic', 2001),
  (3, 'Civic', 2002),
  (3, 'Civic', 2003),
  (3, 'Civic', 2004),
  (3, 'Civic', 2005),
  (3, 'Civic', 2006),
  (3, 'Civic', 2007),
  (3, 'Civic', 2008),
  (3, 'Civic', 2009),
  (3, 'Civic', 2010),
  (3, 'Accord', 2000),
  (3, 'Accord', 2001),
  (3, 'Accord', 2002),
  (3, 'Accord', 2003),
  (3, 'Accord', 2004),
  (3, 'Accord', 2005),
  (3, 'Accord', 2006),
  (3, 'Accord', 2007),
  (3, 'Accord', 2008),
  (3, 'Accord', 2009),
  (3, 'Accord', 2010);



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