### How To Run
* npm install kemudian npm start. **Server berjalan pada port 8000**
* Ganti **password** yang ada di folder `config/config.json`
* Sebelum menggunakan terlebih dahulu create database,migrate dan seed. Ketik `sequelize db:create` setelah itu `sequelize db:migrate` terakhir `sequelize db:seed:all`
* Sudah disediakan tampilan(frontend) untuk menggunakan, Sehingga tidak diperlukan `postman` untuk menjalankan aplikasi.
* accessToken tidak perlu diinputkan lagi, karena sudah tertanam sebagai `cookie` ketika sudah login. Informasi dari cookie menjadi hal yang penting pada aplikasi web ini.
* registrasi terlebih dahulu untuk membuat akun baru
* Penjelasan lengkap ada dibagian `penjelasan`
* Aplikasi fotoAlbum ini juga sudah di deploy ke heroku, dapat dikunjungi link berikut <a href="https://photoalbumusers.herokuapp.com/">fotoAlbum<a>

#### Directory Structure
```bash
├───app/
│   ├───controller/
│   │   ├───api/
│   │   │   ├───v1/
│   │   │   │   ├───index.js
│   │   │   │   ├───photoController.js
│   │   │   │   └───userController.js
│   │   │   ├───index.js
│   │   │   └───main.js
│   │   └───index.js
│   ├───models/
│   │   ├───index.js
│   │   ├───photo.js
│   │   └───user.js
│   └───index.js
├───bin/
│   └───www
├───config/
│   ├───cloudinary.js
│   └───config.json
├───db/
│   ├───migrations/
│   │   ├───20220902133307-create-photo.js
│   │   └───user.js
│   └───seeders/
│       └───20220902133551-seed-photo.js
├───router/
│   ├───partials/
│   │   ├───index.js
│   │   ├───photoroute.js
│   │   ├───userroute.js
│   │   └───viewroute.js
│   └───index.js
├───views/
│   ├───pages/
│   │   ├───addPhoto.ejs
│   │   ├───addUser.ejs
│   │   ├───listPhotos.ejs
│   │   ├───login.ejs
│   │   ├───photoUser.ejs
│   │   └───updatePhoto.ejs
│   └───partials/
│       ├───cardphotos.ejs
│       ├───formaddPhoto.ejs
│       ├───formaddUser.ejs
│       ├───formLogin.ejs
│       ├───formUpdatePhoto.ejs
│       ├───head.ejs
│       └───listPhotoUser.ejs
├───.env
├───.sequelizerc
├───package-lock.json
├───package.json
├───procfile
├───readme.md
└───request.rest
```

#### Dependencies
```json
"dependencies": {
    "bcrypt": "^5.0.1",
    "body-parser": "^1.20.0",
    "cloudinary": "^1.31.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.0.2",
    "ejs": "^3.1.8",
    "express": "^4.18.1",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "pg": "^8.8.0",
    "sequelize": "^6.21.4",
    "sequelize-cli": "^6.4.1"
  }
```

#### Models
```javascript
//Terdapat 2 tabel, yaitu tabel Users dan tabel Photos

//model User
User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
}

//model Photo
Photo.init({
    title: DataTypes.STRING,
    caption: DataTypes.STRING,
    image_url: DataTypes.TEXT,
    userId: DataTypes.INTEGER
}

//hubungan kedua tabel adalah one to many dengan foreignKey nya userId
User.hasMany(models.Photo, {
    as: "Photo",
    foreignKey: "userId"
})

Photo.belongsTo(models.User, {
    foreignKey: "userId"
})
```
#### Endpoint
```javascript
//Sisi backend
GET /users   //daftar users (harus login terlebih)
GET /user   //data user yang sudah login (harus login terlebih)
GET /photos   //daftar list foto
GET /photo/:id  //get foto berdasarkan id
GET /delphoto/:id  //delete foto berdasarkan id
POST /register  //post data register user
POST /login   //post data proses login
POST /addphoto //post foto baru user
POST /update/:id //update foto user

 
//Sisi tampilan/Frontend
GET /register  //halaman register dengan username,email, dan password
GET /login    //halaman login dengan email dan password
GET /listphotos //halaman album foto users(semua foto user)
GET /photouser  //halaman album foto user
GET /addphoto   //halaman post foto baru user
GET /updatephoto/:id  //halaman update foto user
```

#### Penjelasan
* Template engine yang dipakai adalah `ejs(embedded javascript templating)`
* Untuk post foto, menggunakan `cloudinary` sebagai tempat penyimpanan gambar.
* Ketika user belum login, maka dia hanya bisa mengakses 
`GET /login` dan `GET /register` selain itu tidak bisa.
* user yang secara default sudah ada di aplikasi ini adalah `username:diory_pribadi`, `email:sinagadiory@gmail.com` dan `password:12345`

Pada enpoint `GET /register` berikut fungsi yang menghandle ketika post data register
```javascript
const handlePostUser = async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (user != null) return res.json({ msg: "Maaf email sudah terdaftar" }) //email harus unik untuk setiap user
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt) //hashpassword untuk enkripsi password
    User.create({
        username, email, password: hashpassword
    }).then((user) => {
        // res.status(201).json(user)
        res.redirect("/login")
    }).catch((error) => {
        res.status(500).json(error)
    })
}
```
Pada enpoint `GET /login` berikut fungsi yang menghandle ketika post informasi login user.
Pada fungsi ini juga accessToken di generate, kemudian di tanam pada cookie browser pengguna
```javascript
const handleLoginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.json({ msg: "email dan password tidak cocok" })
    const cekpassword = await bcrypt.compare(password, user.password)
    if (cekpassword == false) return res.json({ msg: "email dan password tidak cocok" })
    const userID = user.id
    const username = user.username
    const accessToken = jwt.sign({ userID, username, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true
    });
    res.redirect("/listphotos")
}
```

Ketika `GET /listphotos`, `GET /photouser`, `GET /addphoto`, maupun `GET /updatephoto/:id` hanya dapat diakses ketika sudah **login**, jika belum maka tidak dapat mengakses halaman tersebut.
Berikut fungsi yang menvalidasi user sudah login atau belum.
```javascript
const accessToken = req.cookies.accessToken
if (!accessToken) return res.redirect("/login")
//penjelasan singkat
//pertama akan di get cookie yang bernama accessToken di browser user
//Ketika accessToken tidak ada, ini artinya user belum melakukan proses login sehingga akan di redirect ke /login
```

Fungsi Logout, sederhananya fungsi tersebut menghapus cookie yang sudah ditanam di browser user.
Ketika cookie sudah tidak ada di browser user, maka user tidak dapat lagi mengakses `GET /listphotos`, `GET /photouser`, `GET /addphoto`, maupun `GET /updatephoto/:id`
```javascript
const handleLogOut = (req, res) => {
    res.clearCookie("accessToken")
    res.redirect("/login")
}
```



