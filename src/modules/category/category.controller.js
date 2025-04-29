class CategoryController {

    /**
     * CRUD
     * * read by url (string-slug => /:id, /:slug)
     */

    createCategory = async (req, res, next) => {
        res.status(201).json({
            data: null,
            message: "category created",
            status: "success",
            option: null
        })
    }

    listAllCategory = async (req, res, next) => {
        res.status(200).json({
        })
    }

    viewCategoryDetails = async (req, res, next) => {
        res.status(200).json({

        })
    }

    updateCategory = async (req, res, next) => {
        res.status(200).json({

        })
    }

    deleteCategory = async (req, res, next) => {
        res.status(200).json({

        })
    }

    readByUrl = async (req, res, next) => {
        res.status(200).json({
            
        })
    }

}

module.exports = CategoryController;