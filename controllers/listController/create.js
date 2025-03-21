const knex = require('../../knex/knex');
const create = async(req,res)=>{

    //get id from middleware
    const user_id = req.user;

    const {categories, note, created_at,cost, icon_name} = req.body;

    //VERY IMPORTANT need to work on this
    const [{amount}] = await knex.select('amount').where({id:user_id}).from('users');
    
     //check whether the amount is greater than or not
    if(amount < cost){
        res.status(400).json({error: "insufficient amount"});
        return;
    }

    knex.transaction(async trx => {
        try {

            await trx('users').where({id:user_id}).update({
                amount: amount-cost,
            })

            const [data] = await trx('datas').insert({
                categories: categories,
                note: note,
                created_at: created_at,
                cost: cost,
                user_id:user_id,
                icon_name: icon_name
            }).returning(['id','categories','note','created_at','cost','icon_name']);
    
            await trx.commit();
            res.json(data);

        } catch (error) {
            await trx.rollback();
            console.error(error);
            res.status(400).json({error: "could not create a new list"})
        }
    })

}

module.exports = create;
