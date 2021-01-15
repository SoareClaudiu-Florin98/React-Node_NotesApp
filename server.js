const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('notes_app', 'root', '', {

    dialect: 'mysql'

})

const Note = sequelize.define('note', {

    title: {
        type: Sequelize.STRING,
        validate: {
            len: [2, 40]
        }
    },
    text: {
        type: Sequelize.STRING


    },
    image: {
        type: Sequelize.BLOB
    },
    date: {
        type: Sequelize.STRING,
        validate: {
            //           isDate:true,
            //         isAfter : true
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            len: [2, 40],
            isEmail: true,
            //   isUnique: sequelize.validateIsUnique('email', 'That email is being used. Please choose a different email address'),
        }

    }
})
const Subject = sequelize.define('subject', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 40],
            isAlpha: true
        }
    },
    subjectType: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['CURS', 'SEMINAR', 'ACTIVITATE_INDIVIDUALA']
    },
    teacher: {
        type: Sequelize.STRING,
        defaultValue: "Toma"
    }
})
const User = sequelize.define("user", {
    username: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    hashedPassword: {
        type: Sequelize.DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i
    }
});
Subject.hasMany(Note)
User.hasMany(Subject)
const app = express()
app.use(bodyParser.json())

app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })

    }
    catch (err) {
        next(err)
    }


})
app.get('/users', async (req, res, next) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    }
    catch (err) {
        next(err)
    }

})

app.post('/users', async (req, res, next) => {
    try {
        await User.create(req.body)
        res.status(201).json({ message: 'created' })

    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:uid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }


    }
    catch (err) {
        next(err)
    }
})

app.put('/users/:uid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            await user.update(req.body)
            res.status(202).json({ message: 'accepted' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }
})

app.delete('/users/:uid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            await user.destroy()
            res.status(202).json({ message: 'accepted' })

        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }
})


app.get('/users/:uid/subjects', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid, {
            include: [Subject]
        })
        if (user) {
            res.status(200).json(user.subjects)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }
})

app.post('/users/:uid/subjects', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            const subject = new Subject(req.body)
            subject.userId = user.id
            await subject.save()
            res.status(202).json({ message: 'created' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:uid/subjects/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            const subjects = await user.getSubjects({ where: { id: req.params.sid } })
            const subject = subjects.shift()
            if (subject) {
                res.status(200).json(subject)

            } else {
                res.status(404).json({ message: ' subject not found' })

            }
        }
        else {
            res.status(404).json({ message: ' user not found' })
        }
    }
    catch (err) {
        next(err)
    }
})
app.put('/users/:uid/subjects/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            const subjects = await user.getSubjects({ where: { id: req.params.sid } })

            const subject = subjects.shift()
            if (subject) {
                await subject.update(req.body)
                res.status(200).json(subject)

            } else {
                res.status(404).json({ message: ' subject not found' })

            }
        }
        else {
            res.status(404).json({ message: ' user not found' })
        }


    }
    catch (err) {
        next(err)
    }
})
app.delete('/users/:uid/subjects/:sid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        if (user) {
            const subjects = await user.getSubjects({ where: { id: req.params.sid } })

            const subject = subjects.shift()
            if (subject) {
                await subject.destroy()
                res.status(200).json(subject)

            } else {
                res.status(404).json({ message: ' subject not found' })

            }
        }
        else {
            res.status(404).json({ message: ' user not found' })
        }


    }
    catch (err) {
        next(err)
    }

})

app.get('/users/:uid/subjects/:sid/notes', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid, {
            include: [Subject]

        })
        const subject = await Subject.findByPk(req.params.sid, {
            include: [Note]
        })
        if (user && subject) {
            res.status(200).json(subject.notes)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }

})

app.post('/users/:uid/subjects/:sid/notes', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        const subject = await Subject.findByPk(req.params.sid)
        if (user && subject) {
            const note = new Note(req.body)
            note.subjectId = subject.id
            await note.save()
            res.status(202).json({ message: 'created' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }

    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:uid/subjects/:sid/notes/:nid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        const subject = await Subject.findByPk(req.params.sid)
        if (user && subject) {
            const notes = await subject.getNotes({ where: { id: req.params.nid } })
            const note = notes.shift()
            if (note) {
                res.status(200).json(note)

            } else {
                res.status(404).json({ message: ' note not found' })

            }
        }
        else {
            res.status(404).json({ message: ' user or subject not found' })
        }
    }
    catch (err) {
        next(err)
    }
})

app.put('/users/:uid/subjects/:sid/notes/:nid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        const subject = await Subject.findByPk(req.params.sid)
        if (user && subject) {
            const notes = await subject.getNotes({ where: { id: req.params.nid } })
            const note = notes.shift()
            if (note) {
                await note.update(req.body)
                res.status(200).json(note)

            } else {
                res.status(404).json({ message: ' note not found' })
            }
        }
        else {
            res.status(404).json({ message: ' user or subject  not found' })
        }
    }
    catch (err) {
        next(err)
    }
})

app.delete('/users/:uid/subjects/:sid/notes/:nid', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.uid)
        const subject = await Subject.findByPk(req.params.sid)
        if (user && subject) {

            const notes = await subject.getNotes({ where: { id: req.params.nid } })
            const note = notes.shift()

            if (note) {
                await note.destroy()
                res.status(200).json(note)

            } else {
                res.status(404).json({ message: ' note not found' })

            }
        }
        else {
            res.status(404).json({ message: ' user or subject  not found' })
        }


    }
    catch (err) {
        next(err)
    }


})
app.listen(8080)