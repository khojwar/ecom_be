const { options } = require("joi");
const orderSvc = require("./order.service");
const { message } = require("laravel-mix/src/Log");
const { Status } = require("../../config/constant");

class OrderController {
    checkout = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);  
        }
    }

    initiatePayment  = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }

    updatePaymentDetails = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }

    listAllOrders = async (req, res, next) => {
        try {
            
        } catch (exception) {
            next(exception);
        }
    }

    viewOrderDetails = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }   

}


const orderCtr = new OrderController();
module.exports = orderCtr;