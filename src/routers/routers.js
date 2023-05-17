const Users = require('../model/users')
const Contacts = require('../model/contact')
const fs = require('fs');

const express = require('express')
const router = new express.Router()
const XLSX = require('xlsx')

router.get('/', async (req, res) => {
    try {
        const data = await Users.find({})
        res.render('index', {
            title: 'Home Page',
            users: data,
        })
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

router.get('/add', async (req, res) => {
    res.render('add_users', {
        title: 'Add Users',
    })
})

router.post('/add', async (req, res) => {
    try {
        const obj = new Users({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            pan: req.body.pan,
            dob: req.body.dob,
            unit: req.body.unit,
        })
        const data = await obj.save()
        req.session.message = {
            type: 'success',
            message: 'User Added Successfully'
        }
        res.redirect('/')
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

router.get('/edit/:_id', async (req, res) => {
    try {
        const data = await Users.findById(req.params);
        if (data == null) res.redirect('/')

        res.render('edit_users', {
            title: 'Edit User',
            user: data,
            public_date: data.dob.toISOString().substring(0, 10)
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/update/:_id', async (req, res) => {
    try {
        const obj = await Users.findByIdAndUpdate(req.params, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            pan: req.body.pan,
            dob: req.body.dob,
            unit: req.body.unit,
        });

        const data = await obj.save()
        req.session.message = {
            type: 'success',
            message: 'User Updated Successfully'
        }
        res.redirect('/')
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

router.get('/delete/:_id', async (req, res) => {
    try {
        const data = await Users.findByIdAndDelete(req.params)
        req.session.message = {
            type: 'success',
            message: 'User Deleted Successfully'
        }
        res.redirect('/')
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

router.get('/contact', async (req, res) => {
    res.render('contact', {
        title: 'Contact Page'
    })
})

router.post('/contact', async (req, res) => {
    try {
        const obj = await Contacts(req.body)
        const data = await obj.save()

        req.session.message = {
            type: 'success',
            message: 'Contact Form Send Successfully'
        }
        res.redirect('/')
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

router.get('/about', async (req, res) => {
    res.render('about', {
        title: 'About Page'
    })
})

router.get('/convertToExcel', async (req, res) => {
    try {
        const usersJson = await Users.find({})
        let data = []
        for (let i = 0; i < Object.keys(usersJson).length; i++) {
            const { name, email, phone, pan, unit, dob, paid } = usersJson[i]
            data.push({ pan, name, phone, dob, unit, email, paid })
        }

        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "students")
        // Generate buffer
        XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

        // Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

        XLSX.writeFile(workBook, "studentsData.xlsx")

        //* xlsx to donwload
        const fileStream = fs.createReadStream("studentsData.xlsx");
        res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        fileStream.pipe(res);

        req.session.message = {
            type: 'success',
            message: 'Excel File Converted Successfully'
        }
    } catch (error) {
        res.json({
            type: 'danger',
            message: error.message
        })
    }
})

module.exports = router