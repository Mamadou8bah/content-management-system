const express=require('express')
const connectToDb=require('./config/dbConfig')
const Role=require('./model/Role')
const startRolesSeeding=require('./startRoles')

const authRouter=require('./route/authRoutes')
const roleRouter=require('./route/roleRoutes')
const permissionRouter=require('./route/permissionRoutes')
const articleRouter=require('./route/articleRoutes')
const userRouter=require('./route/userRoutes')
const cors=require('cors')


const app=express()
const port = process.env.PORT || 4000


app.use(cors())
 
app.use(express.json())
app.use('/auth',authRouter)
app.use('/roles',roleRouter)
app.use('/permissions',permissionRouter)
app.use('/articles',articleRouter)
app.use('/users',userRouter)

app.use('/test',(req,res)=>{
    res.send({message:'API is working'})
})


connectToDb().then(() => {
        return startRolesSeeding()
}).then(() => {
        app.listen(port, () => {
                console.log(`App running at ${port}`);
        });
}).catch((err) => {
        console.error('Failed to start server',err)
})
