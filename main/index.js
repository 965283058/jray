
const JRay = require("../lib/application")
let app = new JRay()
app.use(async function (ctx, next) {
    ctx.body = "hello"
    try {
        await next()
    } catch (e) {
        ctx.body = e.message
        console.info("cathc run")
    }
})

app.use(async function (ctx, next) {
    ctx.body += " 呵呵"
    await next()
})

app.use(async(ctx, next)=> {
    ctx.body += " mmd"
    // throw new Error("not bug")
    await next()
})

app.listen(3000)

