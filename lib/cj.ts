const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0';

async function getCJAccessToken(): Promise<string> {
  const res = await fetch(`${CJ_API_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.CJ_API_EMAIL,
      password: process.env.CJ_API_PASSWORD,
    }),
  });

  const data = await res.json();

  if (!data.data?.accessToken) {
    throw new Error(`CJ auth failed: ${JSON.stringify(data)}`);
  }

  return data.data.accessToken;
}

export async function createCJOrder({
  orderNumber,
  customerName,
  phone,
  address,
  city,
  province,
  country,
  countryCode,
  zip,
  products,
}: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  countryCode: string;
  zip: string;
  products: { vid: string; quantity: number }[];
}) {
  const token = await getCJAccessToken();

  const res = await fetch(`${CJ_API_BASE}/v1/shopping/order/createOrderV2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
    },
    body: JSON.stringify({
      orderNumber,
      shippingCustomerName: customerName,
      shippingPhone: phone || '',
      shippingAddress: address,
      shippingCity: city,
      shippingProvince: province || city,
      shippingCountry: country,
      shippingCountryCode: countryCode,
      shippingZip: zip,
      products,
    }),
  });

  const data = await res.json();

  if (!data.data?.orderId) {
    throw new Error(`CJ order creation failed: ${JSON.stringify(data)}`);
  }

  return data.data as { orderId: string };
}
