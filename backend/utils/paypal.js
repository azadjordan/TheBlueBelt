import dotenv from 'dotenv';
dotenv.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

console.log(`Loaded PayPal API URL: ${PAYPAL_API_URL}`);
console.log(`Loaded PayPal Client ID (first 5 chars): ${PAYPAL_CLIENT_ID?.substring(0, 5)}`);

async function getPayPalAccessToken() {
  console.log('Attempting to get PayPal access token...');

  // Authorization header requires base64 encoding
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString('base64');
  const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

  const headers = {
    Accept: 'application/json',
    'Accept-Language': 'en_US',
    Authorization: `Basic ${auth}`,
  };

  const body = 'grant_type=client_credentials';
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    console.error('Error fetching access token:', response.statusText);
    throw new Error('Failed to get access token');
  }

  const paypalData = await response.json();

  console.log('Successfully obtained access token.');
  return paypalData.access_token;
}

export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  console.log(`Checking if PayPal transaction ${paypalTransactionId} is new...`);

  try {
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });

    console.log(`Found ${orders.length} orders for transaction ${paypalTransactionId}.`);
    return orders.length === 0;
  } catch (err) {
    console.error('Error querying the database:', err);
  }
}

export async function verifyPayPalPayment(paypalTransactionId) {
  console.log(`Verifying payment for PayPal transaction ${paypalTransactionId}...`);

  const accessToken = await getPayPalAccessToken();
  console.log(accessToken);
  const paypalResponse = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('Verification response status:', paypalResponse.status);

  if (!paypalResponse.ok) {
    console.error('Error verifying payment:', paypalResponse);
    throw new Error('Failed to verify payment');
  }

  const paypalData = await paypalResponse.json();

  console.log('Payment verification result:', {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value
  });

  return {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value,
  };
}
