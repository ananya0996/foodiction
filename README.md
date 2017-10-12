# Foodiction

A Canteen Automation System

##  Installing

- Install Node.js > v7.8. Preferably v8.x
- Install MongoDB. I'm using  v3.4.9
- Download/Clone the Repository
  ```
    git clone https://github.com/ananya0996/foodiction
  ```
- Install all the dependencies
  ```
    cd foodiction
    npm install
  ```

## Running

- Start MongoDB
```
  sudo service mongod start
```
- Start the NodeJS Application
```
  npm start
```

## Code Structure

- **index.js** : Entry point
- **routes/**
  - **api/**
    - **ingredient.js** : REST API endpoints for Ingredients
    - **item.js** : REST API endpoints for Items
    - **order.js** : REST API endpoints for Orders
  - **canteen.js** : GET and POST endpoints for Canteen Side
  - **customer.js** : GET and POST endpoints for Customer Side
- **static/**
  - **html/**
    - **temp_home.html** : Temporary home page. Links to other pages
    - **canteen_menu.html** : Canteen Side menu view, modify
    - **canteen_orders.html** : Cateen Side orders view, service
    - **canteen_staff.html** : Cateen Side home page
    - **customer_menu.html** : Customer Side menu view, order placing
  - **css/** : CSS files for each page
  - **js/** : JS scripts for each page
  - **images/** : Self Explanatory
