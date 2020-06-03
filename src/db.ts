
const mongodb = require('mongodb')
const {connect} = mongodb.MongoClient
require('custom-env').env('test')

let _db: any

const mongoConnect = (callback: Function) => {
    connect(
        `mongodb+srv://chengchinlim:${process.env.MONGO_DB_PASSWORD}@cluster-learning-x8tmo.gcp.mongodb.net/test?retryWrites=true&w=majority`
    ).then((client: any) => {
        console.log('Mongo DB connected!')
        _db = client.db()
        callback(client)
    }).catch((err: any) => {
        console.log(err)
        throw err
    })
}

// factory pattern
const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb

