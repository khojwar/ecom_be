const Status = {
    ACTIVE: "active",
    INACTIVE: "inactive",
}

const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
}

const USER_ROLES = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    SELLER: "seller",
}

const GENDER = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
}

const PAYMENT_METHODS = {
    COD: "cod",
    ESEWA: "esewa",
    KHALTI: "khalti",
    BANK: "bank",
    IPS: "ips",
    PAYPAL: "paypal",
}

const PAYMENT_STATUS = {
    PAID: "paid",
    REFUND: "refund",
    PENDING: "pending",
}

module.exports = {
    Status,
    USER_ROLES,
    GENDER,
    ORDER_STATUS,
    PAYMENT_METHODS,
    PAYMENT_STATUS
}