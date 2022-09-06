import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';

const app = express();

//make req.body work
app.use(express.json());

const  db = await  sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
}); 

console.log('db initialized');

await db.migrate();

app.post(`/api/phonebill/`, async function (req, res){
     const price_plan = await db.get(`SELECT id, plan_name, sms_price, call_price
    FROM price_plan where plan_name = ?`, req.body.price_plan);

     const activity = req.body.actions;

    //totalPhoneBill logic 
    const activities = activity.split(",");
    let total = 0;

    activities.forEach(action => {
        if (action.trim() === 'sms') {
            total += price_plan.sms_price;
        } else if (action.trim() == 'call') {
            total += price_plan.call_price;
        }
    });

    res.json({
        total
    })
  });

app.get(`/api/price_plans`, async function(req , res){
    const price_plans = await db.all(`select * from price_plan`)
    res.json ({
        price_plans 
    })
});

console.log("done!");

const PORT = 6001;
app.listen(PORT , function(){
    console.log('Price plan API started on port ${PORT}')
});