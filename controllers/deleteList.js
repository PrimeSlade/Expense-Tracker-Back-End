const { json } = require('express');
const knex = require('../knex/knex');
const deleteList = async(req,res) => {
    const {id} = req.body;
    try {
        const data = await knex('datas').where({id: id}).del();
        res.status(200).json("successfully deleted");
    } catch (error) {
        console.error(error);
        json.status(400).json({error: "Could not delete a list"});
    }
}

module.exports = deleteList;