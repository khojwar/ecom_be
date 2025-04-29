class UserController {

    /**
     * create
     * update
     * list
     * - listAll
     * - view Details
     * delete
     */

    // create
    createUser = async (req, res) => {
        res.status(201).json({
            data: null,
            message: "User created",
            status: "Success",
            options: null,
        })
    }

    updateUser = async (req, res) => {
        res.status(200).json({
            data: null,
            message: "User updated",
            status: "Success",
            options: null,
        })
    }

    listAllUsers = async (req, res) => {
        res.status(200).json({
            data: null,
            message: "User list",
            status: "Success",
            options: null,
        })
    }

    viewUserDetails = async (req, res) => {
        res.status(200).json({
            data: null,
            message: "User details",
            status: "Success",
            options: null,
        })
    }

    deleteUser = async (req, res) => {
        res.status(200).json({
            data: null,
            message: "User deleted",
            status: "Success",
            options: null,
        })
    }

}

module.exports = UserController;