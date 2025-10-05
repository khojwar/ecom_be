const transactionSvc = require("./transaction.service");

class TransactionController {

    listAllTransaction = async (req, res, next) => {
       try {
            let filter = {};


            if (req.query.search) {
                filter = {
                    ...filter,
                    transactionCode: new RegExp(req.query.search, 'i')
                }
            }

            if (req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }

            if (req.query.paymentMethod) {
                filter = {
                    ...filter,
                    paymentMethod: req.query.paymentMethod
                }
            }

            const {data, pagination} = await transactionSvc.listAllTransaction(req.query, filter);
            
            
            res.json({
                data: data,
                message: "All transaction data",
                status: "TRANSACTION_LIST_SUCCESS",
                options: {pagination}
            })

       } catch (exception) {
        console.log("error");
        
        next(exception)
       }
    }
}

module.exports = new TransactionController();
