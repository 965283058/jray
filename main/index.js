const JRay = require("../lib/application")
let app = new JRay()
app.use(async function (ctx, next) {
    ctx.body = "hello"
    try {
        await sellp(3000)
        await next()
    } catch (e) {
        ctx.body = e.message
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


let sellp = async(i)=> {
    return new Promise((rev, rej)=> {
        setTimeout(rev, i)
    })
}

