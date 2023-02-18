'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const freeDocNotifications = require('./dbFreeDocNoti')
const patientsToday = require('./dbPatientsToday')
const doctors = require('./dbDoctors')
const users = require('./dbUsers')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const JWT_SECRET = "3B8MSS$6(N2%%1NDhhdf6D091%7@@7da0jdkjj%*jds*QQJUS9([Ra}"
const connectionUrl = "mongodb+srv://admin:5OqQw0B1zLNvDhYt@cluster0.npypzlq.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json())
app.use(cors())

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

router.get("/", (req, res) => res.status(200).send("wassup doc"))

router.get('/rmp', (req, res) => {
  freeDocNotifications.find((err, data) => {
      if (err) {
          res.status(500).send(err)
      }
      else {
          res.status(200).send(data)
      }
  })
})

router.post('/rmp', (req, res) => {
    const freeDocNotification = req.body
    freeDocNotifications.create(freeDocNotification, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
})

router.delete('/doc/:id', function (req, res) {
    let deleteID = req.params.id
    patientsToday.findOneAndDelete({ _id: deleteID }, function (err, doc) {
        if (err) {
            res.send(err)
        } else {
            if (doc == null) {
                res.send("Wrong id")
            } else {
                res.send(doc)
            }
        }

    });
})

router.get('/doc', (req, res) => {
    try {
    patientsToday.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })} catch(e) {
        res.status(500).send(e)
    }
})

router.get('/encrypt',async (req, res) => {
    const encryptedPassword = await bcrypt.hash("1234040891", 10)
    res.send({ status: "ok" ,data:encryptedPassword})

})

router.post('/register', async (req, res) => {
    const { fullName,
        age,
        bloodGroup,
        password,
        phone,
        address,
        dob,
    } = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)
    try {
        const oldUser = await users.findOne({ phone })
        if (oldUser)
            return res.send({ error: "User exist" })

        await users.create({
            fullName,
            age,
            bloodGroup,
            type:'patient',
            password: encryptedPassword,
            phone,
            address,
            dob,
        })
        res.send({ status: "ok" })
    } catch (error) {
        res.send({ status: "error" })

    }
})

router.post('/login', async (req, res) => {
    const {
        password,
        phone,
    } = req.body

    const oldUser = await users.findOne({ phone })

    if (!oldUser)
        return res.json({ error: "User not found" })

    if (await bcrypt.compare(password, oldUser.password)) {
        const token = jwt.sign({ phone: oldUser.phone }, JWT_SECRET)
        if (res.status(201))
            return res.json({ status: "ok", data: token })
        else
            return res.json({ error: "error" })
    }
    res.json({ status: 'error', error: 'invalid password' })
})

router.post("/patient", async (req, res) => {
    const { token } = req.body
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const userPhone = user.phone
        users.findOne({ phone: userPhone })
            .then((data) => {
                res.send({ status: "ok", data: data })
            }).catch((error) => {
                res.send({ status: "error", data: error })
            })
    } catch (error) {

    }
})

router.get('/booking', (req, res) => {
    doctors.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
})

router.post("/booking", async (req, res) => {
    const { token, doc, time, date, mlink ,specialization} = req.body
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const userPhone = user.phone

        users.findOne({ phone: userPhone })
            .then((data) => {
                users.updateOne(
                    { "phone": userPhone },
                    {
                        $set: {
                            "appointments": {
                                date,
                                doc,
                                meet: mlink,
                                time,
                                specialization
                            }
                        }
                    }
                ).then((d) => {
                    patientsToday.create(
                        {
                            name: data.fullName,
                            age: data.age,
                            doc,
                            date,
                            meet: mlink,
                            time,
                        }
                    )
                })
                .then(()=>{
                    res.send({ status: "ok", data: data })
                }).catch((e) => {
                    res.send({ status: "error", data: e })
                })

            }).catch((error) => {
                res.send({ status: "error", data: error })
            })

    } catch (error) {

    }
})

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
