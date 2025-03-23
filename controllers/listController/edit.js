const knex = require('../../knex/knex.js');
const edit = async(req,res)=>{

    const user_id = req.user;
    const {id,categories,note,created_at,cost,icon_name} = req.body;

    //need to work on costs VERY IMPORTANT 
    
    
    try {
        const [data] = await knex('datas').where({user_id: user_id, id:id})
        .update({
            categories: categories,
            note : note,
            created_at : created_at,
            cost : cost,
            icon_name : icon_name
        })
        .returning(['id','categories','note','created_at','cost','icon_name']);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        json.status(400).json({error: "Could not edit a list"});
    }
    
}

module.exports = edit;