module.exports = {
    database: {
        host: `localhost`,
        user: `${process.env.USER}`,
        password: `${process.env.PASSWORD}`,
        database: `${process.env.DATABASE}`
    }
}