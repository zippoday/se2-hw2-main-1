import {JsonDB, Config} from 'node-json-db';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

var db = new JsonDB(new Config("hw2db", true, false, '/'));

app.use(bodyParser.json());

// เมื่อมีรีเควสหน้าแรก
app.get('/', (req, res) => {
    let options = {
        root: __dirname,
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        }
    };
    res.sendFile('src/index.html', options);
});

// เมื่อต้องการโหลดไฟล์ css
app.get('/css/:cssPath', (req, res) => {
    // ตั้งค่า Header ให้ถูกประเภท ดูได้จาก https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    let options = {
        root: __dirname,
        headers: {
            'Content-Type': 'text/css; charset=UTF-8'
        }
    };

    res.sendFile('src/css/' + req.params.cssPath, options);
});

// เมื่อต้องการโหลดไฟล์ javascript
app.get('/js/:jsPath', (req, res) => {
    // ดูตัวอย่างจาก ฟังก์ชั่นด้านบน
    let options = {
        root: __dirname,
        headers: {
            'Content-Type': 'text/js; charset=UTF-8'
        }
    };

    res.sendFile('src/js/' + req.params.jsPath, options);
});

// เมื่อมีการเรียกดูฐานข้อมูล
app.get('/data', async (req, res) => {
    // เรียกข้อมูลจากฐานข้อมูล
    var data = await db.getData("/");

    // ส่งข้อมูลกลับ ต้องแก้ไข header ให้เป็น json รึเปล่า?
    res.send(data);
});

// เมื่อมีรีเควสขอเก็บข้อมูล
app.post('/data', async (req, res) => {
    // รับ JSON การนัดทั้งหมดมา
    let content = req.body;

    // เก็บลงฐานข้อมูล
    await db.push('/', content);

    // ส่งข้อมูลกลับถ้าสำเร็จ

});

app.listen(port, () => {
    // console.log("Server started in port  "+ port);
    console.log(`Server started in port ${port}`);
});