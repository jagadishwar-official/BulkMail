require("dotenv").config()
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const app = express()
app.use(cors())
app.use(express.json())



mongoose.connect(process.env.MONGODB_URI).then(function () {
    console.log("Connected to DB")
}).catch(function (error) {
    console.log("Failed to connect DB:", error.message)
})

const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList
    console.log(msg);

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {

            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "jagadishwar3110@gmail.com",
                            to: emailList[i],
                            subject: "A message from BulkMail App",
                            text: msg
                        },
                    )

                    console.log("Email sent to" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Fail")
            }

        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })

}).catch(function (error) {
            console.log(error)
        })

})

const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
    console.log("Server Started....")
})