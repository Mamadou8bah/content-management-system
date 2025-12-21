const express=require('express')
const connectToDb=require('./config/dbConfig')
const Role=require('./model/Role')
const startRolesSeeding=require('./startRoles')

const authRouter=require('./route/authRoutes')
const roleRouter=require('./route/roleRoutes')
const articleRouter=require('./route/articleRoutes')
const userRouter=require('./route/userRoutes')
const cors=require('cors')

app.use(cors())

const app=express()
 
app.use(express.json())
app.use('/auth',authRouter)
app.use('/roles',roleRouter)
app.use('/articles',articleRouter)
app.use('/users',userRouter)


connectToDb().then(() => {
        return startRolesSeeding()
}).then(() => {
        app.listen(4000, () => {
                console.log('App running at 4000');
        });
}).catch((err) => {
        console.error('Failed to start server',err)
})
