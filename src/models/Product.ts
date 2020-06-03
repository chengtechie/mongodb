
const getMongoDB = require('../db').getDb

class Product {

    title: string
    price: number
    description: string
    imageUrl: string

    constructor(title: string, price: number,
                description: string, imageUrl: string) {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }

    save() {
        const db = getMongoDB()
        return db.collection('products')
            .insertOne(this)
            .then((result: any) => {
                console.log(result)
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    static fetchAll() {
        const db = getMongoDB()
        return db.collection('products').find().toArray()
            .then((products: any) => {
                // console.log(products)
                return products
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

}

module.exports = Product