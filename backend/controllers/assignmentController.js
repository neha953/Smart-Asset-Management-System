const {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require("../models/assignmentModel");


// GET all assignments
const getAssignments = (req, res) => {

    getAllAssignments((err, results) => {

        if (err) {
            console.error("Get Assignments Error:", err);

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


// GET assignment by ID
const getAssignment = (req, res) => {

    const { id } = req.params;

    getAssignmentById(id, (err, results) => {

        if (err) {
            console.error("Get Assignment Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });

        }

        res.status(200).json({
            success: true,
            data: results[0]
        });

    });

};


// CREATE assignment
const addAssignment = (req, res) => {

    const {
        asset_id,
        employee_id,
        assigned_date,
        return_date,
        status
    } = req.body;


    if (!asset_id || !employee_id || !assigned_date) {

        return res.status(400).json({
            success: false,
            message: "Asset ID, Employee ID and assigned date are required"
        });

    }


    const assignment = {
        asset_id,
        employee_id,
        assigned_date,
        return_date: return_date || null,
        status: status || "Assigned"
    };


    createAssignment(assignment, (err, result) => {

        if (err) {
            console.error("Create Assignment Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            assignmentId: result.insertId
        });

    });

};


// UPDATE assignment
const editAssignment = (req, res) => {

    const { id } = req.params;

    const {
        asset_id,
        employee_id,
        assigned_date,
        return_date,
        status
    } = req.body;


    if (!asset_id || !employee_id || !assigned_date) {

        return res.status(400).json({
            success: false,
            message: "Asset ID, Employee ID and assigned date are required"
        });

    }


    const assignment = {
        asset_id,
        employee_id,
        assigned_date,
        return_date: return_date || null,
        status: status || "Assigned"
    };


    updateAssignment(id, assignment, (err, result) => {

        if (err) {
            console.error("Update Assignment Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Assignment updated successfully"
        });

    });

};


// DELETE assignment
const removeAssignment = (req, res) => {

    const { id } = req.params;

    deleteAssignment(id, (err, result) => {

        if (err) {
            console.error("Delete Assignment Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Assignment deleted successfully"
        });

    });

};


module.exports = {
    getAssignments,
    getAssignment,
    addAssignment,
    editAssignment,
    removeAssignment
};