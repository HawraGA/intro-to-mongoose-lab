const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

// Models
const Customer = require('./models/customer.js');

// Connect to MongoDB
const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await runQueries();

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');

  process.exit();
};

const runQueries = async () => {
  const prompt = require('prompt-sync')();
  let action = '';

  // Show the menu
  while (action !== '5') {
    // Show the menu
    console.log('\nWhat would you like to do?\n');
    console.log('  1. Create a customer');
    console.log('  2. View all customers');
    console.log('  3. Update a customer');
    console.log('  4. Delete a customer');
    console.log('  5. Quit\n');

    action = prompt('Choose an action: ');

    switch (action) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        console.log('Exiting...');
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
  }
};

// Create a new customer
const createCustomer = async () => {
  const prompt = require('prompt-sync')();
  const name = prompt('Enter customer name: ');
  const age = prompt('Enter customer age: ');

  const newCustomer = new Customer({
    name,
    age: parseInt(age),
  });

  try {
    const savedCustomer = await newCustomer.save();
    console.log('Customer created:', savedCustomer);
  } catch (err) {
    console.log('Error creating customer:', err);
  }

  // Return to menu after the operation
  await runQueries();
};

// View all customers
const viewCustomers = async () => {
  try {
    const customers = await Customer.find();
    if (customers.length === 0) {
      console.log('No customers found.');
    } else {
      customers.forEach(customer => {
        console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
      });
    }
  } catch (err) {
    console.log('Error fetching customers:', err);
  }

  // Return to menu after the operation
  await runQueries();
};

// Update a customer
const updateCustomer = async () => {
  const prompt = require('prompt-sync')();
  const customers = await Customer.find();
  
  if (customers.length === 0) {
    console.log('No customers available to update.');
    await runQueries();
    return;
  }

  console.log('Here is a list of customers:');
  customers.forEach(customer => {
    console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
  });

  const customerId = prompt('Enter the ID of the customer you want to update: ');
  const customer = await Customer.findById(customerId);

  if (!customer) {
    console.log('Customer not found.');
    await runQueries();
    return;
  }

  const newName = prompt('Enter new name for the customer: ');
  const newAge = prompt('Enter new age for the customer: ');

  customer.name = newName;
  customer.age = parseInt(newAge);

  try {
    const updatedCustomer = await customer.save();
    console.log('Customer updated:', updatedCustomer);
  } catch (err) {
    console.log('Error updating customer:', err);
  }

  // Return to menu after the operation
  await runQueries();
};

// Delete a customer
const deleteCustomer = async () => {
  const prompt = require('prompt-sync')();
  const customers = await Customer.find();
  
  if (customers.length === 0) {
    console.log('No customers available to delete.');
    return;
  }

  console.log('Here is a list of customers:');
  customers.forEach(customer => {
    console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
  });

  const customerId = prompt('Enter the ID of the customer you want to delete: ');
  const customer = await Customer.findById(customerId);

  if (!customer) {
    console.log('Customer not found.');
    return;
  }

  try {
    await Customer.findByIdAndDelete(customerId);
    console.log('Customer deleted.');
  } catch (err) {
    console.log('Error deleting customer:', err);
  }
};

// Call the connect function to start everything
connect();
