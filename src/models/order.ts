import mongoose, { Schema, Document } from 'mongoose';

// Define the enum for currency values
enum Currency {
  USD = 'USD',
  EUR = 'EUR'
}

// Define the enum for site values
enum Site {
  MB_MODEL = 'mb-model',
  ALICE = 'alice',
  ETSY = 'etsy',
  EBAY = 'ebay'
}

// Define the interface for the Order object
interface Order extends Document {
  number: string;
  status: string;
  step: string;
  currency: Currency;
  customer_note?: string;
  date_paid: string;
  line_items: {
    name: string;
    sku: string;
    color?: string;
    price: number;
    scale: string;
    paint: string;
    image: {
      src: string;
    };
    ebayLineItemId?: string;
  }[];
  customer: {
    firstName: string;
    lastName: string;
    countryCode: string;
    countryName: string;
    state?: string;
    city: string;
    addressL1: string;
    addressL2?: string;
    postcode: string;
    email?: string;
    phone?: string;
  };
  site: Site;
  createdAt: Date;
}

// Define the schema for the Order object
const OrderSchema: Schema<Order> = new Schema({
  number: { type: String, required: [true, 'order number is required'], trim: true },
  status: { type: String, required: [true, 'order status is required'], trim: true },
  currency: { type: String, enum: Object.values(Currency), required: [true, 'currency is required'] },
  customer_note: { type: String, trim: true },
  date_paid: { type: String, required: [true, 'date paid is required'], trim: true },
  line_items: [{
    name: { type: String, required: [true, 'name is required'], trim: true },
    sku: { type: String, required: [true, 'sku is required'], trim: true },
    color: { type: String, trim: true },
    price: { type: Number, required: [true, 'item price is required'], trim: true },
    scale: { type: String, required: [true, 'scale is required'], trim: true },
    paint: { type: String, required: [true, 'paint is required'], trim: true },
    image: {
      src: { type: String, required: [true, 'src is required'], trim: true }
    },
    ebayLineItemId: { type: String, trim: true }
  }],
  customer: {
    firstName: { type: String, required: [true, 'customer name is required'], trim: true },
    lastName: { type: String, required: [true, 'customer name is required'], trim: true },
    countryCode: { type: String, required: [true, 'country code is required'], trim: true },
    countryName: { type: String, required: [true, 'country name is required'], trim: true },
    state: { type: String, trim: true },
    city: { type: String, required: [true, 'city is required'], trim: true },
    addressL1: { type: String, required: [true, 'address is required'], trim: true },
    addressL2: { type: String, trim: true },
    postcode: { type: String, required: [true, 'postcode is required'], trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  site: { type: String, enum: Object.values(Site), required: [true, 'site is required'] },
  createdAt: { type: Date, default: Date.now }
});

OrderSchema.virtual('orderSummary').get(function(this: Order) {
  // Define the logic to derive order summary
  const { number, status, currency, site, line_items } = this;

  // Construct order summary for each line item
  const lineItemSummaries = line_items.map((item) => {
    const { name, sku, price } = item;
    return `${name} - ${sku} - $${price}`;
  });

  // Concatenate all line item summaries into a single string
  const lineItemsSummary = lineItemSummaries.join(', ');

  return `${number} - ${status} - ${currency} - ${site} - Line Items: ${lineItemsSummary}`;
});

// OrderSchema.pre('find', function(next) {
//     this.select('site number status line_items');
//     next();
// });

// Create and export the Order model based on the schema
const OrderModel = mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;