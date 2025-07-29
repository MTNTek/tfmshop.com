import { NextRequest, NextResponse } from 'next/server';

// Simple email notification service
// In production, you would integrate with services like SendGrid, AWS SES, etc.

interface EmailNotification {
  to: string;
  subject: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { type, orderData, customerEmail } = await request.json();
    
    let notification: EmailNotification;
    
    switch (type) {
      case 'order_confirmation':
        notification = {
          to: customerEmail,
          subject: `Order Confirmation - TFMShop Order #${orderData.id.slice(0, 8)}`,
          content: generateOrderConfirmationEmail(orderData)
        };
        break;
        
      case 'order_shipped':
        notification = {
          to: customerEmail,
          subject: `Your Order Has Shipped - TFMShop Order #${orderData.id.slice(0, 8)}`,
          content: generateShippedEmail(orderData)
        };
        break;
        
      case 'order_delivered':
        notification = {
          to: customerEmail,
          subject: `Your Order Has Been Delivered - TFMShop Order #${orderData.id.slice(0, 8)}`,
          content: generateDeliveredEmail(orderData)
        };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }
    
    // In production, you would send the actual email here
    // For now, we'll just log it and return success
    console.log('Email notification would be sent:', notification);
    
    return NextResponse.json({ 
      message: 'Notification sent successfully',
      notification 
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

function generateOrderConfirmationEmail(orderData: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Order Confirmation</h1>
          <h2>Thank you for your purchase!</h2>
        </div>
        
        <div style="padding: 20px;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> #${orderData.id.slice(0, 8)}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
          <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
          
          <h3>Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map((item: any) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.product_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h3>Shipping Address</h3>
          <p>
            ${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}<br>
            ${orderData.shipping_address.address}<br>
            ${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zipCode}<br>
            ${orderData.shipping_address.country}
          </p>
          
          <div style="background-color: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4>What's Next?</h4>
            <ul>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive a shipping confirmation when your order ships</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>
          
          <p>
            You can track your order status at any time by visiting our website and going to "My Orders" section.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Thank you for shopping with TFMShop!</p>
            <p style="color: #666; font-size: 12px;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateShippedEmail(orderData: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center;">
          <h1>Your Order Has Shipped!</h1>
          <h2>🚚 On its way to you</h2>
        </div>
        
        <div style="padding: 20px;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> #${orderData.id.slice(0, 8)}</p>
          <p><strong>Tracking Number:</strong> TFM${Date.now()}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          
          <div style="background-color: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4>Track Your Package</h4>
            <p>You can track your package using the tracking number above on our website or contact our support team for updates.</p>
          </div>
          
          <h3>Shipping To</h3>
          <p>
            ${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}<br>
            ${orderData.shipping_address.address}<br>
            ${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zipCode}
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Thank you for shopping with TFMShop!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateDeliveredEmail(orderData: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Order Delivered!</h1>
          <h2>📦 Your package has arrived</h2>
        </div>
        
        <div style="padding: 20px;">
          <h3>Delivery Confirmation</h3>
          <p><strong>Order Number:</strong> #${orderData.id.slice(0, 8)}</p>
          <p><strong>Delivered On:</strong> ${new Date().toLocaleDateString()}</p>
          
          <div style="background-color: #f0fdf4; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4>Enjoy Your Purchase!</h4>
            <p>We hope you love your new items. If you have any issues or concerns, please don't hesitate to contact our support team.</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4>Leave a Review</h4>
            <p>We'd love to hear about your experience! Consider leaving a review for the products you purchased.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Thank you for shopping with TFMShop!</p>
            <p style="color: #666; font-size: 12px;">
              We appreciate your business and look forward to serving you again.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
