const { USER_ROLES, Status } = require('../../config/constant');
const userSvc = require('../../modules/user/user.service');
const emailSvc = require('../../services/email.service')


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

    async notifySellerAboutNewOrder(orderDetail) {
        try {
            orderDetail.map(async (orderDetailItem) => {
                const productName = orderDetailItem.product?.name || 'N/A';
                const buyerName = orderDetailItem.order?.buyer?.name || orderDetailItem.order?.createdBy?.name || 'N/A';
                const orderCode = orderDetailItem.order?.code || 'N/A';
                const orderDate = orderDetailItem.order?.createdAt ? new Date(orderDetailItem.order.createdAt).toLocaleString() : 'N/A';
                const sellerHtml = `
                    <h2>Your Product Has a New Order!</h2>
                    <p><strong>Order Code:</strong> ${orderCode}</p>
                    <p><strong>Product:</strong> ${productName}</p>
                    <p><strong>Quantity:</strong> ${orderDetailItem.quantity}</p>
                    <p><strong>Unit Price:</strong> ${orderDetailItem.price}</p>
                    <p><strong>SubTotal:</strong> ${orderDetailItem.subTotal}</p>
                    <p><strong>Total Price:</strong> ${orderDetailItem.total}</p>
                    <p><strong>Ordered By:</strong> ${buyerName}</p>
                    <p><strong>Order Date:</strong> ${orderDate}</p>
                `;
                this.emailToBeSent.push(
                    emailSvc.sendEmail({
                        to: orderDetailItem.seller.email,
                        sub: "You Have a New Order",
                        msg: sellerHtml
                    })
                )
            })
        } catch (exception) {
            throw exception;
            
        }
    }

    async notifyAdminAboutNewOrder(order, orderDetail) {
        try {
            const {data: allAdminUser} = userSvc.getAllUsersByFilter({
                role: USER_ROLES.ADMIN,
                status: Status.ACTIVE
            }, {});

            allAdminUser.map((user) => {
                const billHtml = `
                    <h2>New Order Placed</h2>
                    <p><strong>Order Code:</strong> ${order.code}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>SubTotal</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderDetail.map(item => `
                                <tr>
                                    <td>${item.product?.name || 'N/A'}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>${item.subTotal}</td>
                                    <td>${item.total}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <br/>
                    <table>
                        <tr><td><strong>Gross Total:</strong></td><td>${order.grossTotal}</td></tr>
                        <tr><td><strong>Discount:</strong></td><td>${order.discount || 0}%</td></tr>
                        <tr><td><strong>Delivery Charge:</strong></td><td>${order.deliveryCharge}</td></tr>
                        <tr><td><strong>Service Charge:</strong></td><td>${order.serviceCharge}</td></tr>
                        <tr><td><strong>Tax:</strong></td><td>${order.tax}</td></tr>
                        <tr><td><strong>SubTotal:</strong></td><td>${order.subTotal}</td></tr>
                        <tr><td><strong>Total:</strong></td><td><strong>${order.total}</strong></td></tr>
                        <tr><td><strong>Paid:</strong></td><td>${order.isPaid ? 'Yes' : 'No'}</td></tr>
                    </table>
                    <p>Placed by user: ${order.buyer?.name || order.createdBy?.name || 'N/A'}</p>
                    <p>Order Date: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                `;

                this.emailToBeSent.push(
                    emailSvc.sendEmail({
                        to: user.email,
                        sub: "New Order Placed",
                        msg: billHtml
                    })
                )
            })

        } catch (exception) {
            throw exception;
        }
    }

    async notifyCustomerAboutOrderPlaced(order, orderDetail) {
        try {
            const buyer = order.buyer;



                const verificationLink = `${process.env.FRONTEND_URL}/order/verify/${order.code}`;
                const cancelLink = `${process.env.FRONTEND_URL}/order/cancel/${order.code}`;
                const customerHtml = `
                    <h2>Your Order Has Been Placed!</h2>
                    <p><strong>Order Code:</strong> ${order.code}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>SubTotal</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderDetail.map(item => `
                                <tr>
                                    <td>${item.product?.name || 'N/A'}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>${item.subTotal}</td>
                                    <td>${item.total}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <br/>
                    <table>
                        <tr><td><strong>Gross Total:</strong></td><td>${order.grossTotal}</td></tr>
                        <tr><td><strong>Discount:</strong></td><td>${order.discount || 0}%</td></tr>
                        <tr><td><strong>Delivery Charge:</strong></td><td>${order.deliveryCharge}</td></tr>
                        <tr><td><strong>Service Charge:</strong></td><td>${order.serviceCharge}</td></tr>
                        <tr><td><strong>Tax:</strong></td><td>${order.tax}</td></tr>
                        <tr><td><strong>SubTotal:</strong></td><td>${order.subTotal}</td></tr>
                        <tr><td><strong>Total:</strong></td><td><strong>${order.total}</strong></td></tr>
                        <tr><td><strong>Paid:</strong></td><td>${order.isPaid ? 'Yes' : 'No'}</td></tr>
                    </table>
                    <p>Order Date: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                    <p>
                        <a href="${verificationLink}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">Verify Order</a>
                        &nbsp;
                        <a href="${cancelLink}" style="padding:10px 20px;background:#f44336;color:#fff;text-decoration:none;border-radius:4px;">Cancel Order</a>
                    </p>
                `;
                this.emailToBeSent.push(
                    emailSvc.sendEmail({
                        to: buyer.email,
                        sub: "Order Placed",
                        msg: customerHtml
                    })
                )

        } catch (exception) {
            throw exception;
        }
    }

}

const orderNotificationSvc = new OrderNotification();
module.exports = orderNotificationSvc;