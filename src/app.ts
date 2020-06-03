import {Request, Response} from "express";

const express = require('express')
const cors = require('cors')
const mongoConnect = require('./db').mongoConnect
const Product = require('./models/Product')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }))

app.get('/', (req: Request, res: Response) => {
    // const product = new Product('Test', 10,
    //     'Cheap and steady', 'www.test.com')
    // product.save()
    //     .then((result: any) => {
    //         // console.log(result)
    //         res.send(`Save Product success!`)
    //     })
    //     .catch((err: any) => {
    //         res.send(`Oops save product failed`)
    //     })
    Product.fetchAll()
        .then((products: any) => {
            console.log(products)
            res.send(`Get products success!`)
        })
        .catch((err: any) => {
            res.send(`Get products failed!`)
        })
})

mongoConnect(() => {
    // Start the server
    const PORT = process.env.PORT || 8888;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`)
        console.log('Press Ctrl+C to quit.')
    })
})