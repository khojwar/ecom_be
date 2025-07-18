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

module.exports = {
    Status,
    USER_ROLES,
    GENDER,
    ORDER_STATUS
}