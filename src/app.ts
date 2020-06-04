import {Request, Response} from "express";

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

import {body, check, validationResult} from 'express-validator/check'

require('custom-env').env('test')

const Product = require('./models/product')
const User = require('./models/user')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }))

app.get('/all', (req: Request, res: Response) => {
    Product.find()
        .select('-__v -_id')
        .populate('userId', 'name email -_id')
        .then((products: any) => {
            // console.log(products)
            res.send({
                message: `Get products success!`,
                products: products
            })
        })
        .catch((err: any) => {
            res.send(`Get products failed!`)
        })
})

app.get('/object/:id', (req: Request, res: Response) => {
    Product.findById(req.params.id as string)
        .then((product: any) => {
            res.status(200).send(product)
        })
        .catch((err: any) => {
            res.status(400).send(`Get product with id ${req.query.id} failed!`)
        })
})

app.post('/object', [
        check('title').isString(),
        check('price').isNumeric()
    ], body('title').custom((value: string) => {
        return value.length <= 3;
    }) ,
    (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        userId: req.body.userId
    })
    product.save()
        .then((result: any) => {
            // console.log(result)
            res.send(`Save Product success!`)
        })
        .catch((err: any) => {
            res.send(`Oops save product failed`)
        })
})

app.put('/object/:id', (req: Request, res: Response) => {
    const updatedPrice = req.body.price
    Product.findById(req.params.id as string)
        .then((product: any) => {
            product.price = updatedPrice
            return product.save()
        })
        .then((result: any) => {
            res.status(200).send(`Update price success`)
        })
        .catch((err: any) => {
            res.status(400).send(err)
        })
})

app.delete('/object/:id', (req: Request, res: Response) => {
    const updatedPrice = req.body.price
    Product.findByIdAndRemove(req.params.id as string)
        .then((result: any) => {
            res.status(200).send(`Delete product success`)
        })
        .catch((err: any) => {
            res.status(400).send(err)
        })
})

mongoose.connect(`mongodb+srv://chengchinlim:${process.env.MONGO_DB_PASSWORD}@cluster-learning-x8tmo.gcp.mongodb.net/test?retryWrites=true&w=majority`)
    .then((result: any) => {
        User.findOne()
            .then((user: any) => {
                if (!user) {
                    const user = new User({
                        name: 'Cheng',
                        email: 'chengchin5227@gmail.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            })
        // Start the server
        const PORT = process.env.PORT || 8888;
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`)
            console.log('Press Ctrl+C to quit.')
        })
    })
    .catch((err: any) => {
        console.log(err)
    })