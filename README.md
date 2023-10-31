# solvd-server

# API Documentation for Automative Service Assistant

## Description <a name="go-up"></a>

The project "Automotive Service Assistant" is being developed 
for automotive repair workshops. This system provides assistance 
to car owners when replacing specific parts, automatically checking 
the availability of spare parts, calculating the total cost 
(including labor costs), and providing an estimate of the completion 
time for the work.

Content:

1. [Technical requirements](#Technical-requirements)
2. [Implementation details](#Implementation-details)
3. [Endpoints:](#Endpoints)
   - [Endpoints: users](#users)
   - [Endpoints: parts](#parts)
   - [Endpoints: marks](#marks)
   - [Endpoints: vehicles](#vehicles)
   - [Endpoints: orders](#orders)
   - [Endpoints: order-parts](#order-parts)
   - [Endpoints: auth](#auth)
4. [Database Schema](#database)

5. [Download and install App](#Install)
6. [Run App with Docker](#docker)

## Technical requirements <a name="Technical-requirements"></a>

- Task should be implemented on Javascript
- Framework - express
- Web framework - ?React?
- Database - Postgres
- Use 19.7 LTS version of Node.js
- Docker container

## Implementation details <a name="Implementation-details"></a>

Base URL

```
 http://localhost:3000/v1/api/
```

# Endpoints: <a name="Endpoints"></a>

## Endpoint `api/v1/users`: <a name="users"></a>
<details>

### GET all users
##### `GET api/v1/users` 
<details>

This endpoint allows you to get a list of users.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json 
  [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "$2a$05$bWPQ0AXCJPdm8H4f1S6XeOCUJs8zfjNcsGU7/QjYqqKhUpbijk22y",
      "phonenumber": "123123",
      "role": "user"
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "$2a$05$bWPQ0AXCJPdm8H4f1S6XeOCUJs8zfjNcsGU7/QjYqqKhUpbijk22y",
      "phonenumber": "232323",
      "role": "admin"
    },
    ...
    ]
```
</details>

### GET one user
##### `GET api/v1/users/:id`
<details>
This endpoint allows you to retrieve a single user by ID.

- Query Parameters

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| `id=[integer]`      | number | Yes      | The user ID. |

* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "$2a$05$bWPQ0AXCJPdm8H4f1S6XeOCUJs8zfjNcsGU7/QjYqqKhUpbijk22y",
      "phonenumber": "123123",
      "role": "user"
    }
```

* **Error Response:**
```
    HTTP/1.1 400 Bad Request
    Content-Type: application/json
    {
      error: "Invalid User ID. User ID must be a number."
    }

    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
      error: "User not found." 
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while fetching the user."
    }
```
</details>

### POST Create a new  user
##### `POST api/v1/users`
<details>
This endpoint allows you to register a new user in the system.

Example request body:
```
    {
        "name": "johndoe",
        "email": "john.doe@example.com",
        "password": "securepassword",
        "phonenumber": "123123",
        "role": "user"
    }
```
* **Success Response:**
```
  HTTP/1.1 201 Created
  Content-Type: application/json
   {
        "name": "johndoe",
        "email": "john.doe@example.com",
        "password": "securepassword",
        "phonenumber": "123123",
        "role": "user"
    }
```

* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json

    {
        error: "Invalid user data. Please check the request data and try again."
    }

  HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
    {
        error: "An error occurred while fetching the user."
    }

```
</details>

### PUT Update user
##### `PUT api/v1/users`
<details>
This endpoint allows you to update a user info in the system.

Example request body:
```
  {
    "id": 1,
    "name": "andrea",
    "email": "andrea@gmail.com",
    "password": "$2a$05$bWPQ0AXCJPdm8H4f1S6XeOCUJs8zfjNcsGU7/QjYqqKhUpbijk22y",
    "phonenumber": "1234567",
    "role": "User"
  }
```
* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "message": "User successfully updated",
    "updatedUser": {
        "id": 1,
        "name": "andrea",
        "email": "andrea@gmail.com",
        "password": "$2a$05$bWPQ0AXCJPdm8H4f1S6XeOCUJs8zfjNcsGU7/QjYqqKhUpbijk22y",
        "phonenumber": "1234567",
        "role": "User"
    }
  }
```
* **Error Response:**
```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: "User not found." 
  }

  HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the user"
  }
```
</details>

### DELETE Delete user
##### `DELETE api/v1/users/:userId`
<details>
This endpoint allows you to delete a single user by ID.

- Query Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| `id=[integer]`| number| Yes   | The user id for delete account. |


* **Success Response:**
```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
       "message": "User successfully deleted",
       "deletedUser": {
        "id": 3,
        "name": "andrea",
        "email": "andrea@gmail.com",
        "password": "andrea",
        "phonenumber": "1234567",
        "role": "User"
    }
}
```
* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
        error: "User not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the user"
    }
```
</details>

</details>

## Endpoint `api/v1/parts`: <a name="parts"></a>

<details>

### GET Get all spare parts
##### `GET api/v1/parts`
<details>
This request allows you to get all spare parts.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
    [
        {
            "id": 1,
            "part_name": "Brake Pads",
            "description": "Front brake pads for safe braking",
            "price": "$30.50",
            "availability": true,
            "repair_cost": "$50.00",
            "repair_time": {
            "hours": 3
            },
            "vehicle_id": 1
        },
        {
            "id": 67,
            "part_name": "Air Filter",
            "description": "Engine air filter for clean air intake",
            "price": "$8.99",
            "availability": true,
            "repair_cost": "$0.00",
            "repair_time": {
            "hours": 1
            },
            "vehicle_id": 5
        },
        {
            "id": 97,
            "part_name": "Spark Plugs",
            "description": "Set of spark plugs for ignition",
            "price": "$15.99",
            "availability": true,
            "repair_cost": "$20.00",
            "repair_time": {
            "hours": 1
            },
            "vehicle_id": 4
        }
    ]
```

`api/parts?mark_id=3&vehicle_year=2000`
- Query Parameters

| Parameter | Type   | Required | Description  |
|-----------|--------|----------|--------------|
| `mark_id=[integer]`| number | Yes      | For filtering by brand  |
|-----------|--------|----------|--------------|
| `vehicle_year=[integer]`| number | Yes      | For filtering by year  |

```
  HTTP/1.1 200 OK
  Content-Type: application/json
    [
      {
        "id": 83,
        "part_name": "Air Filter",
        "description": "Engine air filter for clean air intake",
        "price": "$8.99",
        "availability": true,
        "repair_cost": "$0.00",
        "repair_time": {
            "hours": 1
        },
        "vehicle_id": 21
     },
      {
        "id": 114,
        "part_name": "Spark Plugs",
        "description": "Set of spark plugs for ignition",
        "price": "$15.99",
        "availability": true,
        "repair_cost": "$20.00",
        "repair_time": {
            "hours": 1
        },
        "vehicle_id": 21
      }
    ]
```

</details>

### GET Get part
##### `GET api/v1/parts/:id`
<details>
This endpoint allows you to retrieve one spare part by ID.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "id": 1,
    "part_name": "Brake Pads",
    "description": "Front brake pads for safe braking",
    "price": "$30.50",
    "availability": true,
    "repair_cost": "$50.00",
    "repair_time": {
        "hours": 3
    },
    "vehicle_id": 1
  }
```

* **Error Response:**

```
  HTTP/1.1 404 Not Found
  Content-Type: application/json
    {
    error: "Part not found." 
    }

  HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
    {
      error: "An error occurred while fetching the part."
    }
```
</details>

### POST Create new part
##### `POST api/v1/parts`
<details>
This request allows to reate a new part, only admin can do this. The request
  body should contain the required information for creating a new spare part, such as
  part name, description, price, availability, repair cost, repair time, vehicle_id.

```
Header:
  {
      Authorization: Bearer your-jwt-token-here
  }

  {
    "part_name": "Brake Pads",
    "description": "Front brake pads for safe braking",
    "price": "$30.50",
    "availability": true,
    "repair_cost": "$50.00",
    "repair_time": {
        "hours": 3
    },
    "vehicle_id": 1
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
      part: {
          {
            "id": 2,
            "description": "Front brake pads for safe braking",
            "price": "$30.50",
            "availability": true,
            "repair_cost": "$50.00",
            "repair_time": {
                "hours": 3
            },
            "vehicle_id": 1
          },
        message: 'Part created successfully',
      }
  }
```

* **Error Response:**
```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    error: 'Invalid input. Please provide valid data and a positive price.'
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "An error occurred while creating the part."
  }
```
</details>

### PUT Update part
##### `PUT api/v1/parts`

<details>
This request allows to update a part. The request
  body should contain the required information for updating a new spare part, such as
  part name, price, availability, repair cost, repair time, vehicle_id, id.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    part: {
          {
            "id": 2,
            "part_name": "Engine oil filter",
            "description": "Front brake pads for safe braking",
            "price": "15.00",
            "availability": 12,
            "repair_cost": 10,
            "repair_time": 1,
            "vehicle_id": 1
          },
      message: 'Part updated successfully',
      }
  }
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    message: 'ID not specified'
  }

  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: 'Part not found'
  }

  HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the part."
  }
```
</details>

### DELETE Delete part
##### `DELETE api/parts/:id`

<details>
This endpoint allows you to delete a par in the system.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The part id for delete spare part. |

* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
      part: {
          {
            "id": 2,
            "part_name": "Engine oil filter",
            "description": "Front brake pads for safe braking",
            "price": "15.00",
            "availability": 12,
            "repair_cost": 10,
            "repair_time": 1,
            "vehicle_id": 1
          },
      message: 'Part deleted successfully',
      }
  }
```

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
      error: "Part not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the part."
    }
```
</details>
</details>

## Endpoint `api/v1/marks`: <a name="marks"></a>
<details>

### GET all marks
##### `GET api/v1/marks`
<details>

This endpoint allows you to get a list of marks of vehicle.


* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  [
    {
        "id": 1,
        "mark": "Mercedes-Benz"
    },
    {
        "id": 2,
        "mark": "BMW"
    },
    {
        "id": 3,
        "mark": "Toyota"
    }
]
```
</details>

### GET one mark
##### `GET api/v1/marks/:id`

<details>
This endpoint allows you to retrieve a single mark by ID.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "id": 1,
    "mark": "Mercedes-Benz"
  }
```
* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
      error: "Mark not found." 
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while fetching the mark."
    }
```
</details>

### POST Create new mark
##### `POST api/v1/marks`

<details>
This endpoint allows you to register a new mark in the system.
The request body should contain the required information 
  for creating a new mark, such as mark name.

* **Request:**
```
  {
    "mark": "KIA"
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "mark": {
        "id": 6,
        "mark": "KIA"
    },
    "message": "Mark created successfully"
}
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    error: 'Invalid input: mark is required.'
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "An error occurred while creating a mark."
  }
```
</details>


### PUT Update mark
##### `PUT api/v1/marks`

<details>
This endpoint allows you to update a mark info in the system.

Example request body:
```
  {
    "id": 5,
    "mark": "Porsche",
  }
```

* **Success Response:**
```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "message": "Mark updated successfully",
    "updatedMark": {
        "id": 5,
        "mark": "Porsche"
    }
}
```

* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    message: 'ID not specified'
  }

  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: 'Mark not found'
  }

   HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the mark."
  }
```
</details>

### DELETE Delete mark
##### `DELETE api/marks/:id`

<details>
This endpoint allows you to delete a single mark by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The mark id for delete mark. |


* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
        "message": "Mark deleted successfully",
        "deletedMark": {
            "id": 5,
            "mark": "Porsche"
        }
    }
```

* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
      error: "Mark not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the mark."
    }
```
</details>
</details>



## Endpoint `api/v1/vehicles`: <a name="vehicles"></a>
<details>

### GET all vehicles
##### `GET api/v1/vehicles`
<details>

This endpoint allows you to get a list of vehicles.


* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  [
    {
        "id": 1,
        "mark_id": 2,
        "vehicle_year": 2016
    },
    {
        "id": 2,
        "mark_id": 3,
        "vehicle_year": 2016
    },
    ...
  ]
```
</details>

### GET one vehicle
##### `GET api/v1/vehicles/:id`

<details>
This endpoint allows you to retrieve a single vehicle by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The vehicle id to get the vehicle. |

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "id": 1,
    "mark_id": 2,
    "vehicle_year": 2016
  }
```
* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
      error: "Vehicle not found." 
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while fetching the vehicle."
    }
```
</details>

### POST Create new vehicle
##### `POST api/v1/vehicles`

<details>
This endpoint allows you to register a new vehicle in the system.
The request body should contain the required information 
for creating a new vehicle, such as mark_id, vehicle year.

* **Request:**
```
  {
    "mark_id": 2,
    "vehicle_year": 2016
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "message": "Vehicle created successfully",
    "vehicle": {
        "id": 4,
        "mark_id": 2,
        "vehicle_year": 2016
    }
  }
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    error: 'Invalid or missing data in the request.'
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "An error occurred while creating a vehicle."
  }
```
</details>


### PUT Update vehicle
##### `PUT api/v1/vehicles`

<details>
This endpoint allows you to update a vehicle info in the system.

Example request body:
```
  { 
    "id": 4,
    "mark_id": 2,
    "vehicle_year": 2011
  }
```

* **Success Response:**
```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "message": "Vehicle updated successfully",
    "vehicle": {
        "id": 4,
        "mark_id": 2,
        "vehicle_year": 2011
    }
  }
```

* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    message: 'ID not specified'
  }

  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: 'Vehicle not found'
  }

   HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the vehicle."
  }
```
</details>

### DELETE Delete vehicle
##### `DELETE api/vehicles/:id`

<details>
This endpoint allows you to delete a single vehicle by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The vehicle id for delete vehicle. |


* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
    "message": "Vehicle deleted successfully",
    "vehicle": {
        "id": 6,
        "mark_id": 3,
        "vehicle_year": 2011
      }
    }
```

* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
      error: "Vehicle not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the vehicle."
    }
```
</details>
</details>

## Endpoint `api/v1/orders`: <a name="orders"></a>
<details>

### GET all orders
##### `GET api/v1/orders`
<details>

This endpoint allows you to get a list of orders.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  [
    {
        "id": 1,
        "order_date": "2023-11-09",
        "status": "confirmed",
        "user_id": 2
    },
    {
        "id": 3,
        "order_date": "2222-03-09",
        "status": "in progress",
        "user_id": 1
    }
]
```
</details>

### GET one order
##### `GET api/v1/orders/:id`

<details>
This endpoint allows you to retrieve a single order by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The order id to get the order. |

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "id": 6,
    "order_date": "2023-10-29T21:00:00.000Z",
    "status": "in progress",
    "user_id": 2,
    "partsSummary": {
        "total_price": "$38.98",
        "total_repair_cost": "$40.00",
        "total_repair_time": "14400.000000"
    }
  }
```
* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
      error: "Order not found." 
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while fetching the order."
    }
```
</details>

### POST Create new order
##### `POST api/v1/orders`

<details>
This endpoint allows you to register a new order in the system.
The request body should contain the required information 
for creating a new order, such as order date, status, user id.

* **Request:**
```
  {
      "order_date": "2023-11-09",
      "status": "in progress",
      "user_id": 2
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "message": "Order created successfully",
    "order": {
        "id": 7,
        "order_date": "2023-11-08T21:00:00.000Z",
        "status": "in progress",
        "user_id": 2
    }
}
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    error: 'Invalid or missing data in the request.'
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "An error occurred while creating order."
  }
```
</details>


### PUT Update order
##### `PUT api/v1/orders`

<details>
This endpoint allows you to update an order info in the system.

Example request body:
```
  {
    "id": 4,
    "order_date": "2023-12-08T21:00:00.000Z",
    "status": "confirmed",
    "user_id": 2
}
```

* **Success Response:**
```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "message": "Order updated successfully",
    "order": {
        "id": 4,
        "order_date": "2023-12-07T21:00:00.000Z",
        "status": "confirmed",
        "user_id": 2
    }
  }
```

* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    message: 'ID not specified'
  }

  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: 'Order not found'
  }

  HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the order."
  }
```
</details>

### DELETE Delete order
##### `DELETE api/v1/orders/:id`

<details>
This endpoint allows you to delete a single order by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The order id for delete order. |


* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
    "message": "Order deleted successfully",
    "order": {
        "id": 4,
        "order_date": "2023-12-07T21:00:00.000Z",
        "status": "confirmed",
        "user_id": 2
      }
    }
```

* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
      error: "Order not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the order."
    }
```
</details>
</details>


## Endpoint `api/v1/order-parts`: <a name="order-parts"></a>
<details>

### GET all order-parts
##### `GET api/v1/order-parts`
<details>

This endpoint allows you to get a list of order-parts.

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  [
    {
        "id": 5,
        "order_id": 1,
        "part_id": 1
    },
    {
        "id": 7,
        "order_id": 1,
        "part_id": 1
    }
  ]
```
</details>

### GET one order-part
##### `GET api/v1/order-parts/:id`

<details>
This endpoint allows you to retrieve a single order part by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The order id to get the order part. |

* **Success Response:**

```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "id": 5,
    "order_id": 1,
    "part_id": 1
  }
```
* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json
    {
      error: "Order part not found." 
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while fetching order parts."
    }
```
</details>

### POST Create new order-part
##### `POST api/v1/order-parts`

<details>
This endpoint allows you to register a new order part in the system.
The request body should contain the required information 
for creating a new order part, such as order id, part id.

* **Request:**
```
  {
    "order_id": 1,
    "part_id": 1
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "message": "Order part created successfully",
    "orderPart": {
        "id": 8,
        "order_id": 1,
        "part_id": 1
    }
  }
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    error: 'Invalid or missing data in the request.'
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "An error occurred while creating a part for order."
  }
```
</details>


### PUT Update order-part
##### `PUT api/v1/order-parts`

<details>
This endpoint allows you to update an order part info in the system.

Example request body:
```
  {
    "id": 8,
    "order_id": 1,
    "part_id": 3
  }
```

* **Success Response:**
```
  HTTP/1.1 200 OK
  Content-Type: application/json
  {
    "message": "Order part updated successfully",
    "orderPart": {
        "id": 8,
        "order_id": 1,
        "part_id": 3
    }
  }
```

* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    message: 'ID not specified'
  }

  HTTP/1.1 404 Not Found
  Content-Type: application/json
  {
    error: 'Order part not found'
  }

   HTTP/1.1 500 Internal Server Error
  Content-Type: application/json
  {
    error: "An error occurred while updating the order part."
  }
```
</details>

### DELETE Delete order-part
##### `DELETE api/order-parts/:id`

<details>
This endpoint allows you to delete a single order part by ID.

- Query Parameters

| Parameter    | Type   | Required | Description               |
|--------------|--------|----------|---------------------------|
| `id=[integer]`| number| Yes      | The order part id for delete order part. |


* **Success Response:**

```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
    "message": "Order part deleted successfully",
    "part": {
        "id": 8,
        "order_id": 1,
        "part_id": 3
      }
    }
```

* **Error Response:**

```
    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
      error: "Order part not found"
    }

    HTTP/1.1 500 Internal Server Error
    Content-Type: application/json
    {
      error: "An error occurred while deleting the order part."
    }
```
</details>
</details>

## Endpoint `api/v1/auth`: <a name="order-parts"></a>
<details>

### POST User registration
##### `POST api/v1/auth/registration`

<details>
This endpoint allows you to register a new user in the system. 
To register a new user, you need to send a POST request with 
a JSON body containing the following required information:
name: The user's name.
email: The user's email address.
password: The user's password, which will be securely hashed before storage.
phonenumber: The user's phone number.
role: The role or access level of the user.

* **Request:**
```
  {
    "name": "test",
    "email": "test@gmail.com",
    "password": "test",
    "phonenumber": "8888",
    "role": "User"
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "message": "user registered"
  }
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    "message": "Email is already taken, please use another email"
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "Registration error."
  }
```
</details>

### POST User authorization
##### `POST api/v1/auth/login`

<details>
This endpoint handles user login functionality within the system. 
To log in, a user must send a POST request with a JSON body containing the following information:
email: The user's email address.
password: The user's password.

* **Request:**
```
  {
    "email": "inga@gmail.com",
    "password": "inga",
  }
```
* **Success Response:**

```
  HTTP/1.1 201 Created
  Content-Type: application/json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY5ODEzODkwNCwiZXhwIjoxNjk4MjI1MzA0fQ.QUvSl9iyjTpQZe9qGMsDaomduZaYVrefTq4JteKOA0U"
  }
```
* **Error Response:**

```
  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    "message": "Incorrect password"
  }

  HTTP/1.1 400 Bad Request
  Content-Type: application/json
  {
    "message": "The user with ${email} was not found"
  }

   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
  {
    error: "Login error."
  }
```
</details>

</details>


## Database Schema <a name="database"></a>

![database scheme](./api/database.png)

#### Table: users
- `id` SERIAL PRIMARY KEY
- `name` text NOT NULL
- `email` text NOT NULL UNIQUE
- `password` varchar NOT NULL
- `phonenumber` text NOT NULL UNIQUE
- `role` user_role

#### Table: marks
- `id` SERIAL PRIMARY KEY
- `mark` text

#### Table: vehicle
- `id` SERIAL PRIMARY KEY
- `mark_id` INTEGER
- `vehicle_year` INTEGER
- FOREIGN KEY (mark_id) REFERENCES marks (id)

#### Table: parts
- `id` SERIAL PRIMARY KEY
- `part_name` text
- `description` text
- `price` MONEY
- `availability` BOOLEAN
- `repair_cost` MONEY
- `repair_time` interval
- `vehicle_id` int
- FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)

#### Table: orders
- `id` SERIAL PRIMARY KEY
- `order_date` DATE
- `status` order_status
- `user_id` INT
- FOREIGN KEY (user_id) REFERENCES users (id)

#### Table: order_parts
- `id` SERIAL PRIMARY KEY
- `order_id` INTEGER
- `part_id` INTEGER
- FOREIGN KEY (order_id) REFERENCES orders (id)
- FOREIGN KEY (part_id) REFERENCES parts (id)

### Enum Types
- `user_role` ENUM ('Admin', 'User')
- `order_status` ENUM ('confirmed', 'in progress', 'finished')

### Relationships

1. **users** to **orders**
   - **Relationship**: One-to-Many (1 to N)
   - **Description**: One user can place multiple orders. The foreign key `user_id` in the "orders" table references the primary key `id` in the "users" table.

2. **marks** to **vehicle**
   - **Relationship**: One-to-Many (1 to N)
   - **Description**: One vehicle mark can be associated with multiple vehicles. The foreign key `mark_id` in the "vehicle" table references the primary key `id` in the "marks" table.

3. **vehicle** to **parts**
   - **Relationship**: One-to-Many (1 to N)
   - **Description**: One vehicle can have multiple parts associated with it. The foreign key `vehicle_id` in the "parts" table references the primary key `id` in the "vehicle" table.

4. **orders** to **order_parts**
   - **Relationship**: One-to-Many (1 to N)
   - **Description**: One order can include multiple parts. The foreign key `order_id` in the "order_parts" table references the primary key `id` in the "orders" table.

5. **parts** to **order_parts**
   - **Relationship**: One-to-Many (1 to N)
   - **Description**: One part can be included in multiple orders. The foreign key `part_id` in the "order_parts" table references the primary key `id` in the "parts" table.

## Install <a name="Install"></a>

Clone this repo with command

```
git clone git@github.com:geniusx1990/solvd-server.git
```

Go to project folder

```
cd api
```

Install dependencies

```
npm install
```

## Run in docker container <a name="docker"></a>

For running application in Docker container you should have docker installed on your machine

Run app

```
docker compose up
```

Stop App

```
docker compose down
```

## For Run App

Run command

```
ts-node index.ts
```

[⬆ Go Up ⬆](#go-up)