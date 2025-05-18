const bodyValidator = (schema) => {
    return async (req, res, next) => {
        // validate the request body against the schema
        try {
            const data = req.body;
            
            let response = await schema.validateAsync(data, {abortEarly: false});

            console.log("Validation response: ", response);

            next(); 
            
        } catch (exception) {
            console.log(exception);

            // 400 --> bad request      --> it is with messageBag
            // 422 --> unprocessable entity   --> it is not with messageBag

            let messageBag = {}

            exception.details.map((error)=> {
                // console.log(error);  

                let key = error.path.pop()
                messageBag[key] = error.message
            })

            next({
                code: 400,
                detail: messageBag,
                message: "validation failed",
                status: "VALIDATION_FAILED"
            })
            
        }
    }
}

module.exports = bodyValidator;