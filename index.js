var stripe = require('stripe')('sk_test_vOLBgEQA5kPMGnaw4zTDbw9Y');
 
var customer = await stripe.customers.create(
  { email: 'mishra.pournima108@gmail.com.com' }
);