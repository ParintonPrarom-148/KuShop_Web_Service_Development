import database from "../service/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import multer from "multer"
// upload part
// กำหนดตำแหน่งที่จะเก็บ file ที่ upload --> img_mem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem')
    },
    // กำหนดชื่อ file
    filename: function (req, file, cb) {
        const filename = `${req.body.memEmail}.jpg`
        cb(null, filename)
    }
})
// จำกัดประเภทของไฟล์ที่อัปโหลด
const upload = multer({
    storage: storage,
}).single('file');
export async function postMember(req, res) {
    console.log(`POST /Member is requested`)
    try {
        if (req.body.memEmail == null || req.body.memName == null) {
            return res.status(422).json({
                error: 'Email and Name is required.'
            })
        }
        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
            values: [req.body.memEmail]
        })
        if (existsResult.rows[0].exists) {
            return res.status(409).json({
                error: `memEmail ${req.body.memEmail} is Exists!!`
            })
        }
        const pwd = req.body.password
        const saltround = 11
        const pwdhash = await bcrypt.hash(pwd, saltround)
        const result = await database.query({
            text: `INSERT INTO members ("memEmail", "memName", "memHash") 
        VALUES ($1, $2, $3)`,
            values: [
                req.body.memEmail,
                req.body.memName,
                pwdhash
            ]
        })
        const body = req.body
        const datetime = new Date()
        bodyData.createDate = datetime
        res.status(201).json(bodyData)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function loginMember(req, res) {
    console.log(`POST /loginMember is requested`)
    try {
        if (req.body.loginname == null || req.body.password == null) {
            return res.json({ login: false })
        }
        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
            values: [req.body.loginname]
        })
        if (!existsResult.rows[0].exists) {
            return res.json({ login: false })
        }
        const result = await database.query({
            text: `SELECT * FROM members m WHERE m."memEmail" = $1`,
            values: [req.body.loginname]
        })
        const loginok = await bcrypt.compare(req.body.password, result.rows[0].memHash)
        if (loginok) {
            const theuser = {
                memEmail: result.rows[0].memEmail,
                memName: result.rows[0].memName,
                dutyId: result.rows[0].dutyId
            }
            const secret_key = process.env.SECRET_KEY //อ่านค่าจากfile .env
            const token = jwt.sign(theuser, secret_key, { expiresIn: '1h' })
            // สร้าง Cookie
            res.cookie('token', token, {
                maxAge: 3600000, //กำหนดอายุของ Cookie เป็น ms 3600000->60minute
                secure: true, //กำหนด Security
                sameSite: "none" //บังคับให้ส่งใน Site เดียวกันหรือไม่
            })
            res.json({ login: true })
        }
        else {
            res.clearCookie('token', {
                secure: true,
                sameSite: "none"
            })
            res.json({ login: false })
        }

    }
    catch (err) {
        res.json({ login: false })
    }}
    export async function logoutMember(req, res) {
        console.log(`GET /logoutMembers is requested`)
        try {
            res.clearCookie('token', {
                secure: true,
                sameSite: "none"
            })
            return res.json({ login: false })
        } catch (err) {
            return res.json({ login: true })
        }

    }
    //ส่วน Upload File
export async function uploadMember(req, res) {
    console.log("Upload Member Image")
     upload(req, res, (err) => {
         if (err) {
             return res.status(400).json({ message: err.message });
         }
         res.status(200).json({ message: 'File uploaded successfully!' });
     });
 }
 
