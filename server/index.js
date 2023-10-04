require('dotenv').config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { User, Plate, Comments, Claims } = require("./schemas/Schema")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const https = require("https")
const fs = require("fs").promises;
const http = require("http")
const path = require('path');

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const { PORT, TOKEN_KEY } = process.env

// Create Application Object
const app = express()

// GLOBAL MIDDLEWARE
app.use(cors(
    {
        origin: true,
        credentials: true
    }
));
app.use(express.json({ limit: '2mb' })) // parse json bodies + file limit
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { DATABASE_URL, USERNAME, PASSWORD, DBNAME } = process.env
mongoose.connect(DATABASE_URL, { user: USERNAME, pass: PASSWORD, dbName: DBNAME })

mongoose.connection
    .on("open", () => console.log("DATABASE STATE", "Connection Open"))
    .on("close", () => console.log("DATABASE STATE", "Connection Open"))
    .on("error", (error) => console.log("DATABASE STATE", error))


// ROUTES
app.get("/", async (req, res) => {
    res.send("this is the test route to make sure server is working")
})

app.get("/generatePassword", async (req, res) => {
    function generatePassword(
        length = 8,
        characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) {
        return Array.from(crypto.randomFillSync(new Uint32Array(length)))
            .map((x) => characters[x % characters.length])
            .join('')
    }
    const pass = generatePassword()
    return res.status(201).send({ message: pass });
})

app.post("/register", async (req, res) => {
    const userExist = await User.findOne({ username: req.body.username });
    try {
        if (userExist) {
            return res.status(400).send({ message: "User already exists" });
        } else {
            //generate token
            const token = jwt.sign(
                { username: req.body.username },
                TOKEN_KEY,
            )
            //create user
            const user = await User.create({
                username: req.body.username,
                password: req.body.password,
                token: { value: token, device: req.body.device, ip: req.socket.remoteAddress }
            });
            //res.cookie("jwt", token, { maxAge: 3600, httpOnly: true, secure: false, sameSite: 'none' });
            return res.status(201).send({ message: "User Created Successfully", id: user._id, username: user.username, token: user.token.value, role: user.role });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/login", async (req, res) => {
    // check if username exists
    const userExist = await User.findOne({ username: req.body.username })

    if (userExist) {
        if (userExist.role === "Guest") {
            return res.status(400).send({
                message: "Can't use guest account"
            });
        }
        const passwordCheck = await bcrypt.compare(req.body.password, userExist.password)

        // check if password matches
        if (!passwordCheck) {
            return res.status(400).send({
                message: "Wrong password"
            });
        } else {
            //retrieve token
            if (userExist.token.value) {
                userExist.token.modified = Date.now(),
                    userExist.token.ip = req.socket.remoteAddress,
                    userExist.token.device = req.body.device
            }
            else {
                const token = jwt.sign(
                    { username: req.body.username },
                    TOKEN_KEY
                )
                userExist.token = { value: token, device: req.body.device, ip: req.socket.remoteAddress }
            }

            await userExist.save()
            // res.cookie("jwt", token, { maxAge: 3600, httpOnly: true, secure: true, sameSite: 'none' });
            return res.status(200).send({
                message: "Login Successful",
                id: userExist._id,
                username: userExist.username,
                token: userExist.token.value,
                role: userExist.role
            });
        }
    } else {
        return res.status(400).send({
            message: "User does not exists"
        });
    }
})

async function userAuthToken(req, res, next) {
    //console.log("checking token ")
    const token = req.headers.authorization
    if (token) {
        const tokenExists = await User.findOne({ "token.value": token })
        if (tokenExists) {
            req.user = tokenExists
            next()
        } else {
            return res.status(401).send({ message: "Not authorized" })
        }
    } else {
        return res
            .status(401)
            .send({ message: "Not authorized, token not available" })
    }
}

app.post("/claim/:id/:action", userAuthToken, async (req, res) => {
    //console.log("approve/reject claim")
    try {
        const user = req.user

        //check if plate exists
        const claim = await Claims.findById(req.params.id)
        const plate = await Plate.findOne({ value: claim.plateValue })
        const claimUser = await User.findById(claim.user._id)

        if (user.role === "Admin" || user.role === "Moderator") {
            if (req.params.action === "approve") {
                await plate.updateOne({ "owner.user": claimUser })
                await plate.updateOne({ "owner.requestedBy": [] })
                await claimUser.updateOne({ $push: { owner: plate } })
            } else {
                await plate.updateOne({ $pull: { "owner.requestedBy": claimUser._id } })
            }
            await claim.deleteOne({})
            return res.status(200).send({
                message: "done"
            });
        } else {
            return res.status(400).send({ message: "user role not sufficient for this action" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/plate/:number/addComment", async (req, res) => {
    try {
        //check if user is logged in
        let user
        if (req.body.token) {
            user = await User.findOne({ "token.value": { $eq: req.body.token } })
        } else {
            if (!req.body.guestId) {
                return res.status(400).send({ message: "no ID found, please restart app or refresh page" });
            }
            user = await User.create({ username: req.body.guestName + crypto.randomUUID(), role: 'Guest', password: crypto.randomUUID(), "token.ip": req.socket.remoteAddress })
        }
        // addComment
        //find if plate exists
        const plate = await Plate.findOne({ value: { $eq: req.params.number } })
        if (plate) {
            const comment = await Comments.create({ author: user, value: req.body.comment, plate: plate._id })
            plate.comments.push(comment)
            if (user._id) {
                user.comments.push(comment)
                await user.save()
            }
            await plate.save()

            //add img
            if (req.body.image) {
                let filename = new Date().getTime() + '.jpeg'
                await fs.writeFile("./uploads/" + filename, req.body.image, 'base64', function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: "there was problem uploading image, try again", err
                        });
                    }
                })
                let fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
                await comment.updateOne({ 'media.image': fileUrl })
                //console.log(fileUrl)
            }

            return res.status(200).send({
                message: "add comment to existing plate success"
            });
        } else {
            return res.status(400).send({
                message: "plate doesnt exists, cant add comment"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/plate/:number/claim", userAuthToken, async (req, res) => {
    // console.log("claim plate")
    try {
        //get user
        const user = req.user

        //check if claim exists
        const claim = await Plate.findOne({ value: req.params.number, 'owner.requestedBy': { $elemMatch: { $eq: user._id } } })

        //check if plate already claimed
        const plate = await Plate.findOne({ value: req.params.number, 'owner.user': { $ne: null } })

        if (plate) {
            return res.status(400).send({
                message: "plate already owned"
            });
        }

        if (claim) {
            return res.status(400).send({
                message: "plate already claimed"
            });
        } else {
            const newClaim = await Claims.create({
                plateValue: req.params.number,
                user: user,
                vin: req.body.vin,
                registerDate: req.body.registerDate
            })

            const addUserToRequested = await Plate.findOneAndUpdate({ value: req.params.number }, { $push: { 'owner.requestedBy': user._id } })

            return res.status(200).send({
                message: "request sent for approval"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/plate/:number/setDesc", userAuthToken, async (req, res) => {
    //console.log("setting description")
    try {
        //get user
        const user = req.user

        if (user.role === "Admin" || user.role === "Moderator") {
            const plateA = await Plate.findOne({ value: req.params.number })
            await plateA.updateOne({ description: req.body.description })
            return res.status(200).send({
                message: "description changed with elevated access"
            })
        }

        //check if plate exists
        const plate = await Plate.findOne({ value: req.params.number, 'owner.user': { $eq: user } })

        if (!plate) {
            return res.status(400).send({
                message: "no plate or not plate owner"
            });
        } else {
            await plate.updateOne({ description: req.body.description })

            return res.status(200).send({
                message: "description changed"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/plate/:number/:voteType", userAuthToken, async (req, res) => {
    try {
        //get user
        const user = req.user

        //check if plate exists
        const plate = await Plate.findOne({ value: { $eq: req.params.number } })

        if (plate) {
            const userVotedPlus = plate.points.votedPlus.includes(user._id) //has user already voted +?
            const userVotedMinus = plate.points.votedMinus.includes(user._id) //has user already voted -?

            if (req.params.voteType === "plus" && userVotedPlus && !userVotedMinus) {
                //return res.status(400).send({ message: "you already voted +" });
                await plate.updateOne({ $inc: { "points.value": -1 }, $pull: { "points.votedPlus": user._id } })
            } else if (req.params.voteType === "minus" && userVotedMinus && !userVotedPlus) {
                //return res.status(400).send({ message: "you already voted -" });
                await plate.updateOne({ $inc: { "points.value": 1 }, $pull: { "points.votedMinus": user._id } })
            } else if (req.params.voteType === "minus" && !userVotedMinus && userVotedPlus) {
                await plate.updateOne({ $inc: { "points.value": -2 }, $push: { "points.votedMinus": user }, $pull: { "points.votedPlus": user._id } })
            } else if (req.params.voteType === "plus" && !userVotedPlus && userVotedMinus) {
                await plate.updateOne({ $inc: { "points.value": 2 }, $push: { "points.votedPlus": user }, $pull: { "points.votedMinus": user._id } })
            } else if (req.params.voteType === "minus" && !userVotedMinus && !userVotedPlus) {
                await plate.updateOne({ $inc: { "points.value": -1 }, $push: { "points.votedMinus": user } })
            } else if (req.params.voteType === "plus" && !userVotedMinus && !userVotedPlus) {
                await plate.updateOne({ $inc: { "points.value": 1 }, $push: { "points.votedPlus": user } })
            }

            return res.status(200).send({
                message: "voted"
            })
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

async function addViewCount(plate, req) {
    if (req.query.qr !== "undefined" && req.query.qr !== "null" && req.query.qr !== "") {
        if (atob(req.query.qr) == plate.value) {
            // console.log("qr scanned for", atob(req.query.qr))
        }
        return
    }
    if (plate.views.viewedBy.includes(req.headers.authorization)) {
        return
    } else {
        //plate.updateOne({ $inc: { "views.value": 1 }, $push: { "views.viewedBy": req.headers.authorization } })
        plate.views.value += 1;
        plate.views.viewedBy.push(req.headers.authorization);
        await plate.save();
        return
    }
}

app.get("/plate/:number", async (req, res) => {
    // console.log("get plate")
    // check if plate exists
    const plate = await Plate.findOne({ value: { $eq: req.params.number } }).populate({
        path: 'comments', options: { sort: { _id: -1 } }, match: { visible: true },
        populate: {
            path: 'author', select: 'username role owner',
        }
    })
        .populate({ path: 'owner.user', select: 'username _id' })

    if (plate) {
        addViewCount(plate, req)
        return res.status(200).send({
            message: "plate get Successful",
            plate: plate
        });
    } else {
        try {
            const newPlate = await Plate.create({ value: req.params.number })
            addViewCount(newPlate, req)
            return res.status(200).send({
                message: "new plate added",
                plate: newPlate
            });
        } catch (err) {
            return res.status(400).send({
                message: "plate cannot be created"
            });
        }
    }
})

app.post("/comment/:id/hide", userAuthToken, async (req, res) => {
    // console.log("hide comment")
    try {
        //get user
        const user = req.user

        //check if plate exists
        const comment = await Comments.findById(req.params.id)

        if (user.role === "Admin" || user.role === "Moderator") {
            await comment.updateOne({ visible: false })
            return res.status(200).send({
                message: "hidden"
            });
        } else {
            return res.status(400).send({ message: "not needed role" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/comment/:id/unhide", userAuthToken, async (req, res) => {
    //console.log("unhide comment")
    try {
        //get user
        const user = req.user

        //check if plate exists
        const comment = await Comments.findById(req.params.id)

        if (user.role === "Admin" || user.role === "Moderator") {
            await comment.updateOne({ visible: true, 'flagged.value': 0 })
            return res.status(200).send({
                message: "visible+flagged=0"
            });
        } else {
            return res.status(400).send({ message: "not needed role" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/comment/:id/report", async (req, res) => {
    //console.log("reporting 60")
    try {
        //check if comment exists
        const comment = await Comments.findById(req.params.id)

        if (comment.flagged.flaggedBy.includes(req.body.id)) { return }

        if (comment) {
            await comment.updateOne({ $inc: { "flagged.value": 1 }, $push: { "flagged.flaggedBy": req.body.id } })
            return res.status(200).send({
                message: "delete"
            });
        } else {
            return res.status(400).send({ message: "no comment" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/comment/:id/:voteType", userAuthToken, async (req, res) => {
    //console.log("voting on comment")
    try {
        //get user
        const user = req.user

        //check if plate exists
        const comment = await Comments.findById(req.params.id)

        const userVotedPlus = comment.points.votedPlus.includes(user._id) //has user already voted +?
        const userVotedMinus = comment.points.votedMinus.includes(user._id) //has user already voted -?

        if (req.params.voteType === "plus" && userVotedPlus && !userVotedMinus) {
            // return res.status(400).send({ message: "you already voted +" });
            await comment.updateOne({ $inc: { "points.value": -1 }, $pull: { "points.votedPlus": user._id } })
        } else if (req.params.voteType === "minus" && userVotedMinus && !userVotedPlus) {
            // return res.status(400).send({ message: "you already voted -" });
            await comment.updateOne({ $inc: { "points.value": 1 }, $pull: { "points.votedMinus": user._id } })
        } else if (req.params.voteType === "minus" && !userVotedMinus && userVotedPlus) {
            await comment.updateOne({ $inc: { "points.value": -2 }, $push: { "points.votedMinus": user }, $pull: { "points.votedPlus": user._id } })
        } else if (req.params.voteType === "plus" && !userVotedPlus && userVotedMinus) {
            await comment.updateOne({ $inc: { "points.value": 2 }, $push: { "points.votedPlus": user }, $pull: { "points.votedMinus": user._id } })
        } else if (req.params.voteType === "minus" && !userVotedMinus && !userVotedPlus) {
            await comment.updateOne({ $inc: { "points.value": -1 }, $push: { "points.votedMinus": user } })
        } else if (req.params.voteType === "plus" && !userVotedMinus && !userVotedPlus) {
            await comment.updateOne({ $inc: { "points.value": 1 }, $push: { "points.votedPlus": user } })
        }

        return res.status(200).send({
            message: "voted"
        });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.delete("/comment/:id", userAuthToken, async (req, res) => {
    // console.log("deleting comment")
    try {
        //get user
        const user = req.user

        //check if plate exists
        const comment = await Comments.findById(req.params.id)

        if (user._id.equals(comment.author._id) || user.role === "Admin" || user.role === "Moderator") {
            await comment.deleteOne({})
            await user.updateOne({ $pull: { comments: comment._id } })
            //delete any associated media
            comment.media.image && fs.unlink('./uploads/' + comment.media.image.split('/').pop()).catch((err) => null)
            return res.status(200).send({
                message: "delete"
            });
        } else {
            return res.status(400).send({ message: "not comment owner" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.post("/gettoken", userAuthToken, async (req, res) => {
    // console.log("gettoken")
    // check if user exists
    const userExist = req.user
    if (userExist) {
        return res.status(200).send({
            message: "token get Successful",
            username: userExist.username,
            token: userExist.token,
        });
    } else {
        return res.status(400).send({
            message: "User does not exists"
        });
    }
})

app.delete("/token/:value", userAuthToken, async (req, res) => {
    // console.log("delete token")

    // check if user exists
    const tokenExists = await User.findOne({ "token.value": req.params.value })
    // console.log(tokenExists)
    if (tokenExists) {
        await User.updateOne({ 'token.value': req.params.value },
            { $unset: { token: 1 } })
        return res.status(200).send({
            message: "token deleted",
        });
    } else {
        return res.status(400).send({
            message: "no token"
        });
    }
})

app.get("/user/:username", async (req, res) => {
    // console.log("get user")

    // check if user exists
    const user = await User.findOne({ username: { $eq: req.params.username } })
        .populate({ path: 'comments', populate: { path: 'plate', select: 'value geodata' } })
        .populate({ path: 'comments', options: { sort: { _id: -1 } }, populate: { path: 'author', select: 'username ' }, match: { visible: true }, })
        .select('username role owner registerDate')
        .populate({ path: 'owner', select: 'value geodata' })

    //console.log(user)
    if (user) {
        return res.status(200).send({
            message: "user get Successful",
            user
        });
    } else {
        return res.status(400).send({
            message: "user does not exists"
        });
    }
})

app.delete("/user/:username", userAuthToken, async (req, res) => {
    // console.log("delete user")
    try {
        //get user
        const user = req.user

        //check if user exists
        const foundUser = await User.findOne({ username: { $eq: req.params.username } })
        if (user.role === "Admin" || user.role === "Moderator" || user.token.value === foundUser.token.value) {
            // delete imgs added by user
            const imgToDelete = await foundUser.populate('comments')
            imgToDelete.comments.forEach(element => {
                element.media.image && fs.unlink('./uploads/' + element.media.image.split('/').pop()).catch((err) => null)
            });
            //delete user
            await foundUser.deleteOne()
            return res.status(200).send({
                message: "user deleted"
            });
        } else {
            return res.status(400).send({ message: "not needed role" });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.get("/reportedComments", userAuthToken, async (req, res) => {
    // console.log("get reported comments")

    // check if user exists
    try {
        const user = req.user

        if (user.role === "Admin" || user.role === "Moderator") {
            const comment = await Comments.find({ 'flagged.value': { $gt: 0 }, 'visible': { $ne: false } })
                .populate({ path: 'plate', select: 'value' })
                .populate({ path: 'author', select: 'username role' })

            //console.log(comment)
            if (comment) {
                return res.status(200).send({
                    message: "reportedComments get Successful",
                    comments: comment
                });
            } else {
                return res.status(400).send({
                    message: "reportedComments does not exists"
                });
            }
        } else {
            return res.status(400).send({
                message: "no access"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.get("/hiddenComments", userAuthToken, async (req, res) => {
    // console.log("get hidden comments")

    // check if user exists
    try {
        const user = req.user

        if (user.role === "Admin" || user.role === "Moderator") {
            const comment = await Comments.find({ 'visible': false })
                .populate({ path: 'plate', select: 'value' })
                .populate({ path: 'author', select: 'username role' })

            //console.log(comment)
            if (comment) {
                return res.status(200).send({
                    message: "hiddenComments get Successful",
                    comments: comment
                });
            } else {
                return res.status(400).send({
                    message: "hiddenComments does not exists"
                });
            }
        } else {
            return res.status(400).send({
                message: "no access"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.get("/plateClaims", userAuthToken, async (req, res) => {
    // console.log("get plate claims")

    // check if user exists
    try {
        const user = req.user

        if (user.role === "Admin" || user.role === "Moderator") {
            const claims = await Claims.find({}).populate({ path: 'user', select: 'username' })

            if (claims) {
                return res.status(200).send({
                    message: "claims get Successful",
                    claims: claims
                });
            } else {
                return res.status(400).send({
                    message: "claims does not exists"
                });
            }
        } else {
            return res.status(400).send({
                message: "no access"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.get("/users", userAuthToken, async (req, res) => {
    // console.log("get all users")

    // check if user exists
    try {
        const user = req.user

        if (user.role === "Admin" || user.role === "Moderator") {
            const foundUser = await User.find({ $or: [{ role: 'Moderator' }, { role: 'Admin' }, { role: 'Vip' }, { role: 'User' }] }).select({ username: 1, role: 1, comments: 1, owner: 1 })

            if (foundUser) {
                return res.status(200).send({
                    message: "users get Successful",
                    users: foundUser
                });
            } else {
                return res.status(400).send({
                    message: "users does not exists"
                });
            }
        } else {
            return res.status(400).send({
                message: "no access"
            });
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
})

app.get("/plates", async (req, res) => {
    // console.log("get plates")

    //sorting options: latest comments, best plates, worst plates
    const sorting = req.query.sorting
    let plate
    let sortingVar

    switch (sorting) {
        case 'latest comments':
            sortingVar = { "comments._id": -1 }
            break;
        case 'best plates':
            sortingVar = { "points.value": -1 }
            break;
        case 'worst plates':
            sortingVar = { "points.value": 1 }
            break;
        default:
            sortingVar = { "comments._id": -1 }
            break;
    }

    plate = await Plate.aggregate([
        {
            $lookup: {
                from: "comments",
                let: { plateId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$plate", "$$plateId"] }, visible: true } },
                    { $sort: { _id: -1 } },
                    { $limit: 4 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "author",
                            foreignField: "_id",
                            as: "author",
                            pipeline: [
                                { $match: { /* match conditions */ } },
                                { $project: { username: 1, role: 1, owner: 1 } }, // Include only fields listed
                            ],
                        },
                    },
                    {
                        $addFields: {
                            author: { $arrayElemAt: ["$author", 0] },
                        },
                    },
                ],
                as: "comments",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner.user",
                foreignField: "_id",
                as: "owner.user",
                pipeline: [
                    { $match: { /* match conditions */ } },
                    { $project: { username: 1, _id: 1 } }
                ],
            },
        },
        {
            $addFields: {
                "owner.user": { $arrayElemAt: ["$owner.user", 0] },
            },
        },
        // stage to get the total count of comments for each plate
        {
            $lookup: {
                from: "comments",
                let: { plateId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$plate", "$$plateId"] }, visible: true } },
                    { $count: "count" },
                ],
                as: "commentCount",
            },
        },
        // stage to extract the comment count from the commentCount array
        {
            $addFields: {
                commentCount: { $arrayElemAt: ["$commentCount.count", 0] },
            },
        },
        {
            $sort: sortingVar,
        },
        { $limit: 50 },
    ])

    //console.log(plate)
    if (plate) {
        return res.status(200).send({
            message: "plate get successful",
            plate
        });
    } else {
        return res.status(400).send({
            message: "error fetching plates"
        });
    }
})


Start()
async function Start(){

const options = {
    key: await fs.readFile('./cert/key.pem'),
    cert: await fs.readFile('./cert/cert.pem')
};

// APP LISTENER
http.createServer(options, app).listen(PORT, () => console.log("SERVER STATUS", `Listening on port ${PORT}`))
}