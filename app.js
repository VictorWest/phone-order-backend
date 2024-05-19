import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { Order } from './model/order.js';
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//connect to mongoose
mongoose.connect('mongodb+srv://victor_west:belemauniben123@cluster0.vr6umex.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('connected'))
.catch((err) => console.log(err))

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

app.post('/orders', async (req, res) => {
  const orderData = req.body.orders; 

  if (orderData === null || orderData.items === null || orderData.items == []) {
    return res
      .status(400)
      .json({ message: 'Missing data.' });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes('@') ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === '' ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === '' ||
    orderData.customer['postal-code'] === null ||
    orderData.customer['postal-code'].trim() === '' ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message:
        'Missing data: Email, name, street, postal code or city is missing.',
    });
  }
  const order = {
    ...orderData,
    id: (Math.random() * 100).toString()
  }
  // const existingOrders = await fs.readFile('./data/orders.json', 'utf-8')
  // const updatedOrders = JSON.parse(existingOrders)
  // updatedOrders.push(order)
  // await fs.writeFile('./data/orders.json', JSON.stringify(updatedOrders))
  const newOrder = new Order({
    name: order.customer.name,
    email: order.customer.email,
    street: order.customer.street,
    postalCode: order.customer['postal-code'],
    city: order.customer.city,
    id: order.id
  })
  newOrder.save()
    .then(() => {
      res.status(201).json({message: 'Order created!'})
    })
    .catch((err) => {
      res.status(401).json({message: err})
    })
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
