import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export async function sendFulfilmentEmail({
  orderId,
  token,
  customerEmail,
  customerName,
  customerPhone,
  shippingAddress,
  items,
  totalAmount,
}: {
  orderId: string;
  token: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const confirmUrl = `${appUrl}/fulfil/${token}`;

  const addressLines = [
    shippingAddress.line1,
    shippingAddress.line2,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postal_code,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(', ');

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">£${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  await resend.emails.send({
    from: 'RecoverEaseFit Orders <onboarding@resend.dev>',
    to: process.env.OWNER_EMAIL || 'support@recovereasefit.com',
    subject: `🛒 New Order — Confirm to send to CJ (#${orderId.slice(0, 8)})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <div style="background:#f97316;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:22px;">New Order Received</h1>
          <p style="color:#fed7aa;margin:4px 0 0;">Review and confirm to fulfil with CJ Dropshipping</p>
        </div>

        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;">
          <h2 style="font-size:16px;color:#6b7280;margin-top:0;">Customer</h2>
          <p style="margin:0;"><strong>${customerName}</strong></p>
          <p style="margin:4px 0;">${customerEmail}</p>
          ${customerPhone ? `<p style="margin:4px 0;">${customerPhone}</p>` : ''}

          <h2 style="font-size:16px;color:#6b7280;margin-top:24px;">Ship To</h2>
          <p style="margin:0;">${addressLines || 'No address provided'}</p>

          <h2 style="font-size:16px;color:#6b7280;margin-top:24px;">Items Ordered</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Product</th>
                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Qty</th>
                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:bold;">Total</td>
                <td style="padding:12px;font-weight:bold;">£${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align:center;margin:40px 0 24px;">
            <a href="${confirmUrl}"
               style="background:#f97316;color:white;padding:16px 40px;text-decoration:none;border-radius:8px;font-size:18px;font-weight:bold;display:inline-block;">
              ✅ Confirm &amp; Send to CJ
            </a>
          </div>

          <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">
            Or visit: <a href="${confirmUrl}" style="color:#f97316;">${confirmUrl}</a>
          </p>
        </div>
      </div>
    `,
  });
}
