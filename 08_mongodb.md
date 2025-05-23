
# Compass

compass is a GUI software





## insert operation in mongo

- `db.<collection>.insertOne(object)`
- `db.<collection>.insertMany(Array<objects>`


- `db.<collection>.show()`

## data read

- `db.<collection>.find()`
- `db.<collection>.findone()`


- `db.<collection>.find({filter})`
- `db.<collection>.findone({filter})`


- `db.<collection>.find({filter}, projection)`                      // eg. db.users.find({}, {name: 1, email: 1, _id: 0})
- `db.<collection>.findone({filter}, projection)`

- `db.<collection>.find({filter}, projection, options)`                      
- `db.<collection>.findone({filter}, projection, options)`          // eg. db.users.find({}, {name: 1, email: 1, _id: 0}, {sort: {name: "asc"}})    or     db.users.find({}, {name: 1, email: 1, _id: 0}, {sort: {name: "asc"}, skip:2, limit: 2})


```json
// filter
{
    "key": "value",         // ~ WHERE key = 'value'
    "key1": "value"         // ~ WHERE key = 'value' and key1 = "value"
}

{
    "$<op>": {"exp": "value"}
}

{
    "key": {"$op": "value"}
}

{
    "$op": [{"expressions"}]
}

// eg. of $op
// $lt, $lte, $gt, $gte, $in, $nin, $eq, $ne, $regex, $and, $or

```

- `db.<collection>.find("age": {$lt: 10})`
- `db.<collection>.find('$or': [{'address.billing': new regEx('kathmandu')}, {'address.sipping': new regEx('kathmandu')}])`




## Update data

- `db.<collection>.updateOne(filter, {$set: {}}, {upsert: true})`              // upsert do 2 things (update or insert)
- `db.<collection>.updateMany(filter, {$set: {}}, {upsert: true})`


## Delete

- `db.<collection>.deleteOne(filter)`
- `db.<collection>.deleteMany(filter)`




## operations
### ORM or ODM (object relational mapping/modelling or Object Document Mapping/modelling)
- SQL ORM
- NoSQL ODM

    - for `mongodb` we use `mongoose` package

#### Core
- eg. mongodb


## Install

    npm i mongoose


### Data Identity

- Ecommerce Feature
    * core Feature
        - banners (web)  (SQL CRUD)

        - brands
        - categories
        - users --> admin, customer, seller
        - Product --> title, description, price, discount, category, tag, stock, seller, brand
        - orders
        - orderDetails
        - transactions
        - chat

    * addon Features
        - rate and review
        - offers
        - vouchar and coupons
        - Blogs
        - Inventory
        - Logistics
        - Return and Refunds
        - Stocks      (stocks may come inside inventory)
        - settings



## dbdiagram.io

Draw Entity-Relationship Diagrams, Painlessly 


