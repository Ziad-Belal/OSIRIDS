import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
    const ADMIN_EMAIL    = 'yusufkamesh7@gmail.com';
    const FROM           = 'onboarding@resend.dev';

    const {
      orderId, customerName, customerEmail, customerPhone,
      customerAddress, customerCity, customerCountry,
      notes, items, subtotal, shipping, total,
    } = await req.json();

    const itemsList = items
      .map((i: any) => `${i.name} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join('<br/>');

    const adminHtml = `
      <div style="background:#0A0A0A;color:#fff;font-family:Arial,sans-serif;padding:40px;max-width:600px;">
        <h1 style="color:#D4AF37;letter-spacing:4px;font-size:24px;">🏺 NEW ORDER #${orderId}</h1>
        <hr style="border-color:#222;margin:20px 0"/>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#555;padding:6px 16px 6px 0;font-size:12px;text-transform:uppercase;white-space:nowrap;">Name</td><td style="color:#fff;padding:6px 0;">${customerName}</td></tr>
          <tr><td style="color:#555;padding:6px 16px 6px 0;font-size:12px;text-transform:uppercase;white-space:nowrap;">Email</td><td style="color:#fff;padding:6px 0;">${customerEmail}</td></tr>
          <tr><td style="color:#555;padding:6px 16px 6px 0;font-size:12px;text-transform:uppercase;white-space:nowrap;">Phone</td><td style="color:#fff;padding:6px 0;">${customerPhone}</td></tr>
          <tr><td style="color:#555;padding:6px 16px 6px 0;font-size:12px;text-transform:uppercase;white-space:nowrap;">Address</td><td style="color:#fff;padding:6px 0;">${customerAddress}, ${customerCity}, ${customerCountry}</td></tr>
          <tr><td style="color:#555;padding:6px 16px 6px 0;font-size:12px;text-transform:uppercase;white-space:nowrap;">Notes</td><td style="color:#fff;padding:6px 0;">${notes || '—'}</td></tr>
        </table>
        <hr style="border-color:#222;margin:20px 0"/>
        <p style="color:#D4AF37;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;">Items Ordered</p>
        <p style="color:#ccc;line-height:2.2;">${itemsList}</p>
        <hr style="border-color:#222;margin:20px 0"/>
        <p style="color:#555;font-size:13px;">Subtotal: $${subtotal.toFixed(2)}</p>
        <p style="color:#555;font-size:13px;">Shipping: $${shipping.toFixed(2)}</p>
        <p style="color:#D4AF37;font-size:22px;font-weight:bold;margin-top:8px;">Total: $${total.toFixed(2)}</p>
      </div>
    `;

    const customerHtml = `
      <div style="background:#0A0A0A;color:#fff;font-family:Arial,sans-serif;padding:40px;max-width:600px;">
        <h1 style="color:#D4AF37;letter-spacing:6px;font-size:32px;margin-bottom:4px;">OSIRIDS</h1>
        <p style="color:#555;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-top:0;">Order Confirmation</p>
        <hr style="border-color:#222;margin:24px 0"/>
        <p style="color:#aaa;font-size:15px;">Hello <strong style="color:#fff;">${customerName}</strong>,</p>
        <p style="color:#777;font-size:14px;line-height:1.7;">Thank you for your order. We have received it and will be in touch shortly with delivery details.</p>
        <div style="border:1px solid #D4AF37;display:inline-block;padding:10px 24px;margin:20px 0;">
          <span style="color:#D4AF37;font-size:11px;letter-spacing:4px;font-weight:bold;">ORDER #${orderId}</span>
        </div>
        <hr style="border-color:#222;margin:20px 0"/>
        <p style="color:#D4AF37;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;">Items</p>
        <p style="color:#ccc;line-height:2.2;">${itemsList}</p>
        <hr style="border-color:#222;margin:20px 0"/>
        <p style="color:#555;font-size:13px;">Subtotal: $${subtotal.toFixed(2)}</p>
        <p style="color:#555;font-size:13px;">Shipping: $${shipping.toFixed(2)}</p>
        <p style="color:#D4AF37;font-size:22px;font-weight:bold;margin-top:8px;">Total: $${total.toFixed(2)}</p>
        <hr style="border-color:#222;margin:20px 0"/>
        <p style="color:#D4AF37;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;">Delivery To</p>
        <p style="color:#ccc;font-size:13px;margin:4px 0;">${customerAddress}, ${customerCity}, ${customerCountry}</p>
        <p style="color:#ccc;font-size:13px;margin:4px 0;">Phone: ${customerPhone}</p>
        ${notes ? `<p style="color:#ccc;font-size:13px;margin:4px 0;">Notes: ${notes}</p>` : ''}
        <hr style="border-color:#1a1a1a;margin:32px 0"/>
        <p style="color:#333;font-size:11px;text-align:center;letter-spacing:2px;">© 2026 OSIRIDS. ALL RIGHTS RESERVED.</p>
      </div>
    `;

    const headers = {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    };

    // Send both emails in parallel
    const [adminRes, customerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from:    `Osirids Orders <${FROM}>`,
          to:      [ADMIN_EMAIL],
          subject: `🏺 New Order #${orderId} — ${customerName}`,
          html:    adminHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from:    `Osirids <${FROM}>`,
          to:      [customerEmail],
          subject: `Your Osirids Order #${orderId} is Confirmed 🏺`,
          html:    customerHtml,
        }),
      }),
    ]);

    const adminData    = await adminRes.json();
    const customerData = await customerRes.json();

    console.log('Admin email:', adminRes.status, JSON.stringify(adminData));
    console.log('Customer email:', customerRes.status, JSON.stringify(customerData));

    return new Response(
      JSON.stringify({ success: true, adminStatus: adminRes.status, customerStatus: customerRes.status }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});