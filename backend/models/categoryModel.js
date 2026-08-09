const db = require("../config/db");


// Get all categories
const getAllCategories = (callback) => {

    const sql = `
        SELECT
            id,
            category_name,
            description,
            created_at
        FROM categories
        ORDER BY id DESC
    `;

    db.query(sql, callback);
};


// Get category by ID
const getCategoryById = (id, callback) => {

    const sql = `
        SELECT
            id,
            category_name,
            description,
            created_at
        FROM categories
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


// Create category
const createCategory = (category, callback) => {

    const sql = `
        INSERT INTO categories
        (
            category_name,
            description
        )
        VALUES (?, ?)
    `;

    const values = [
        category.category_name,
        category.description || null
    ];

    db.query(sql, values, callback);
};


// Update category
const updateCategory = (id, category, callback) => {

    const sql = `
        UPDATE categories
        SET
            category_name = ?,
            description = ?
        WHERE id = ?
    `;

    const values = [
        category.category_name,
        category.description || null,
        id
    ];

    db.query(sql, values, callback);
};


// Delete category
const deleteCategory = (id, callback) => {

    const sql = `
        DELETE FROM categories
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};