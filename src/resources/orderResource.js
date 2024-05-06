import Order from "../models/order";
import bcrypt from "bcrypt";

const canEdit = ({ currentAdmin, record }) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
    || currentAdmin._id === record.param('_id')
  )
}

const processData = async (data) => {
  const arr = [];
  data.forEach(order => {

    order.line_items.forEach(item => {
      arr.push[{
        orderId: order._id,
        itemId: item._id,
        number: order.number,
        status: order.status,
        note: order.customer_note,
        date: order.createdAt,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        countryName: order.countryName,
        sku: item.sku,
        color: item.color,
        scale: item.scale,
        paint: item.paint,
        image: item.image.src
      }];
    });
  });
  return arr;
}

const orderResource = {
  resource: Order,
  options: {
    parent: {
      icon: "Order",
    },
    actions: {
      list: {
        before: async (request, response) => {
          console.log(response);
          return request;
        },
      },
    },
  },
};

export default orderResource;