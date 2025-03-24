const knex = require('../../knex/knex');
const deleteList = async(req,res) => {

    //get id from middleware
    const user_id = req.user;
    const {id} = req.body;

    //need to work on this VERY IMPORTANT

    try {
        const data = await knex('datas').where({
            id: id ,
            user_id: user_id
        }).del();
        res.status(200).json("successfully deleted");
    } catch (error) {
        console.error(error);
        json.status(400).json({error: "Could not delete a list"});
    }
}

module.exports = deleteList;