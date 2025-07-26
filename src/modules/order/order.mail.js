
const { AppConfig } = require('../../config/config');
const { USER_ROLES, Status } = require('../../config/constant');
const userSvc = require('../../modules/user/user.service');
const emailSvc = require('../../services/email.service');
const { showPrice } = require('../../utilities/helper');


class OrderNotification {
    emailToBeSent = [];

    async sendOrderDetailNotification(order, OrderDetail) {
        try {
            await this.notifyAdminAboutNewOrder(order, OrderDetail);

            await this.notifyCustomerAboutOrderPlaced(order, OrderDetail);

            await this.notifySellerAboutNewOrder(OrderDetail);

            const status = await Promise.allSettled(this.emailToBeSent);

            
        } catch (exception) {
            throw exception;
        }
    }


     async notifySellerAboutNewOrder( orderDetail ){
        try {
            // console.log("notifySellerAboutNewOrder", orderDetail);

            orderDetail.map(orderDetailItem => {
                // console.log("orderDetailItem", orderDetailItem.seller?.email);

                const sellerEmail = orderDetailItem.seller?.email;

                const sellerBillHtml = `
                    <h2>New Order for Your Product</h2>
                    <p><strong>Order Code:</strong> ${orderDetailItem.order?.code || orderDetailItem.orderCode || ''}</p>
                    <p><strong>Status:</strong> ${orderDetailItem.order?.status || orderDetailItem.status || ''}</p>
                    <hr/>
                    <h3>Order Details</h3>
                    <table border="1" cellpadding="5">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>SubTotal</th>
                                <th>Delivery Charge</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${orderDetailItem.product?.name || 'Product'}</td>
                                <td>${orderDetailItem.quantity}</td>
                                <td>${showPrice(orderDetailItem.price / 100)}</td>
                                <td>${showPrice(orderDetailItem.subTotal / 100)}</td>
                                <td>${showPrice(orderDetailItem.deliveryCharge / 100)}</td>
                                <td>${showPrice(orderDetailItem.total / 100)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr/>
                    <p><strong>Total:</strong> <b>${showPrice(orderDetailItem.total / 100)}</b></p>
                    <p>You have received a new order for your product. Please process it promptly.</p>
                `;

                this.emailToBeSent.push(emailSvc.sendEmail({
                    to: sellerEmail,
                    sub: '[Seller Mail] You have a new order',
                    msg: sellerBillHtml
                }))
            })
        } catch (exception) {
            console.log("seller :" , exception);
            throw exception;
        }
    }

    async notifyAdminAboutNewOrder(order, orderDetail){
        try {
            const { data: allAdminUsers } = await userSvc.getAllUsersByFilter({
            role: USER_ROLES.ADMIN,
            status: Status.ACTIVE
            }, {});

            // Compose bill layout for the order
            const billHtml = `
            <h2>New Order Placed</h2>
            <p><strong>Order Code:</strong> ${order.code}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <hr/>
            <h3>Order Details</h3>
            <table border="1" cellpadding="5">
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>SubTotal</th>
                    <th>Delivery Charge</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                ${Array.isArray(orderDetail) ? orderDetail.map(detail => `
                    <tr>
                    <td>${detail.product?.name || 'Product'}</td>
                    <td>${detail.quantity}</td>
                    <td>${showPrice(detail.price / 100)}</td>
                    <td>${showPrice(detail.subTotal / 100)}</td>
                    <td>${showPrice(detail.deliveryCharge / 100)}</td>
                    <td>${showPrice(detail.total / 100)}</td>
                    </tr>
                `).join('') : ''}
                </tbody>
            </table>
            <hr/>
            <p><strong>Gross Total:</strong> ${showPrice(order.grossTotal / 100)}</p>
            <p><strong>Discounts:</strong> ${showPrice(order.discount / 100)}</p>
            <p><strong>Delivery Charge:</strong> ${showPrice(order.deliveryCharge / 100)}</p>
            <p><strong>Service Charge:</strong> ${showPrice(order.serviceCharge / 100)}</p>
            <p><strong>SubTotal:</strong> ${showPrice(order.subTotal / 100)}</p>
            <p><strong>Tax:</strong> ${showPrice(order.tax / 100)}</p>
            <p><strong>Total:</strong> <b>${showPrice(order.total / 100)}</b></p>
            <p><strong>Paid:</strong> ${order.isPaid ? 'Yes' : 'No'}</p>
            `;

            (Array.isArray(allAdminUsers) ? allAdminUsers : []).map(user => {
            this.emailToBeSent.push(
                emailSvc.sendEmail({
                to: user.email,
                sub: '[Admin mail] You have an order',
                msg: billHtml
                })
            )
            })
        } catch (exception) {
            console.log("admin :" , exception);
            throw exception
        }
    }

    async notifyCustomerAboutOrderPlaced(order, orderDetail){
        try {
            const customer = await userSvc.getSingleUserByFilter({
                _id: order.buyer
            });

            // Compose bill layout for the customer
            const cancelLink = `${AppConfig.frontendUrl}/orders/${order._id}/cancel`;
            const verifyLink = `${AppConfig.frontendUrl}/orders/${order.code}/verify`;

            const customerBillHtml = `
                <h2>Your Order Confirmation</h2>
                <p>Thank you for your order!</p>
                <p><strong>Order Code:</strong> ${order.code}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <hr/>
                <h3>Order Details</h3>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>SubTotal</th>
                            <th>Delivery Charge</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.isArray(orderDetail) ? orderDetail.map(detail => `
                            <tr>
                                <td>${detail.product?.name || 'Product'}</td>
                                <td>${detail.quantity}</td>
                                <td>${showPrice(detail.price / 100)}</td>
                                <td>${(detail.subTotal / 100)}</td>
                                <td>${showPrice(detail.deliveryCharge / 100)}</td>
                                <td>${showPrice(detail.total / 100)}</td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
                <hr/>
                <p><strong>Gross Total:</strong> ${showPrice(order.grossTotal / 100)}</p>
                <p><strong>Discount:</strong> ${showPrice(order.discount / 100)}</p>
                <p><strong>Delivery Charge:</strong> ${showPrice(order.deliveryCharge / 100)}</p>
                <p><strong>Service Charge:</strong> ${showPrice(order.serviceCharge / 100)}</p>
                <p><strong>SubTotal:</strong> ${showPrice(order.subTotal / 100)}</p>
                <p><strong>Tax:</strong> ${showPrice(order.tax / 100)}</p>
                <p><strong>Total:</strong> <b>${showPrice(order.total / 100)}</b></p>
                <p><strong>Paid:</strong> ${order.isPaid ? 'Yes' : 'No'}</p>
                <p>
                    <a href="${cancelLink}">Cancel Order</a> | 
                    <a href="${verifyLink}">Verify Order</a>
                </p>
                <p>If you have any questions, please contact our support team.</p>
            `;

            this.emailToBeSent.push(
                emailSvc.sendEmail({
                    to: customer.email,
                    sub: '[Customer Mail] Your Order Confirmation',
                    msg: customerBillHtml
                })
            )

        } catch (exception) {
            console.log("customer :" , exception);
            throw exception;
        }
    }
}

const orderNotificationSvc = new OrderNotification();
module.exports = orderNotificationSvc;