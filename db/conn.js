const mongoose = require('mongoose')

const db = process.env.DATABASE    // cannot use DATABASE directly

mongoose.connect(db, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log('connection successful');
}).catch((err) => console.log(err));