const express = require('express');
const uuid4 = require('uuid4');
const sdk = require('node-appwrite');

const router = express.Router();

// Initialize the Appwrite client
const client = new sdk.Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite API endpoint
  .setProject('6780df780034e872f813') // Your project ID
  .setKey(
    'standard_20dd09339b2792eff56c070e6beb94a8716859f2110bfe602dd2f157c646b58f6d60fb2f65bc26935f53fbef03cee440bfe367697f0367d1a40b43948815a848fa9963bed88d0a856c616298043cdde6da6d384979b96188959422383a054304f9fb2445512b3c943723e81b99b259c6cb7e278fd35bfa81d6f9ae16cffdc29b' // Your secret key
  ); // Your secret key

const messaging = new sdk.Messaging(client);
const users = new sdk.Users(client);

// Route to register a user
router.post('/register', async (req, res) => {
  try {
    const user = req.body;

    // Validate phone number
    if (!user.tel.startsWith('+')) {
      return res
        .status(400)
        .send({ error: 'Phone number must start with a "+" and include the country code.' });
    }

    const id = uuid4();
    const result = await users.create(
      id, // User ID
      user.email, // Email
      user.tel // Phone number
    );
    console.log(result);

    if (result) {
      await sendEmail(result);
      await sendSMS(result);
    }
    res.status(200).send({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

// Route to login a user (Check if user exists)
router.post('/login', async (req, res) => {
  try {
    const { email, tel } = req.body;

    // Check if both email and phone number are provided
    if (!email || !tel) {
      return res.status(400).send({ error: 'Email and phone number are required.' });
    }

    // Find the user based on email and phone number
    const userList = await users.list(); // Fetch all users (this could be optimized for performance)
    const user = userList.users.find(
      (u) => u.email === email && u.phone === tel
    );

    if (!user) {
      return res.status(401).send({ error: 'Invalid credentials. User not found.' });
    }

    // If user exists, send success message
    res.status(200).send({ success: true, message: 'Login successful.' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ error: 'Internal Server Error.' });
  }
});

// Function to send an email
const sendEmail = async (result) => {
  const email = result.email;
  const userId = result['$id'];
  const message = await messaging.createEmail(
    uuid4(), // Message ID
    `Welcome! ${email}`, // Subject
    'Thank you for signing up!', // Content
    [], // Topics (optional)
    [userId] // Users (optional)
  );
  console.log(message);
};

// Function to send an SMS
const sendSMS = async (result) => {
  const userId = result['$id'];
  const message = await messaging.createSms(
    uuid4(), // Message ID
    'Thank you for signing up!', // Content
    [], // Topics (optional)
    [userId] // Users (optional)
  );
  console.log(message);
};

module.exports = router;
