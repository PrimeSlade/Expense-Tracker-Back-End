const knex = require('../knex/knex');
const create = async(req,res)=>{

    //get id from middleware
    const userId = req.user;
    const {categories, note, created_at,cost, icon_name} = req.body;

    try {
        const data = await knex('datas').insert({
            categories: categories,
            note: note,
            created_at: created_at,
            cost: cost,
            user_id:userId,
            icon_name: icon_name
        }).returning(['id','categories','note','created_at','cost','icon_name']);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(400).json({error: "could not create a new list"})
    }
}

module.exports = create;