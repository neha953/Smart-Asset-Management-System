const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../models/categoryModel");


// GET all categories
const getCategories = (req, res) => {

    getAllCategories((err, results) => {

        if (err) {
            console.error("Get Categories Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    });

};


// GET category by ID
const getCategory = (req, res) => {

    const { id } = req.params;

    getCategoryById(id, (err, results) => {

        if (err) {
            console.error("Get Category Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};


// CREATE category
const addCategory = (req, res) => {

    const {
        category_name,
        description
    } = req.body;


    if (!category_name) {

        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });

    }


    const category = {
        category_name,
        description: description || null
    };


    createCategory(category, (err, result) => {

        if (err) {
            console.error("Create Category Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            categoryId: result.insertId
        });

    });

};


// UPDATE category
const editCategory = (req, res) => {

    const { id } = req.params;

    const {
        category_name,
        description
    } = req.body;


    if (!category_name) {

        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });

    }


    const category = {
        category_name,
        description: description || null
    };


    updateCategory(id, category, (err, result) => {

        if (err) {
            console.error("Update Category Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });

    });

};


// DELETE category
const removeCategory = (req, res) => {

    const { id } = req.params;

    deleteCategory(id, (err, result) => {

        if (err) {
            console.error("Delete Category Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    });

};


module.exports = {
    getCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory
};