const JRay = require("../lib/application")
const bodyParse = require("../lib/bodyParse")
const static = require("../lib/static")
const path = require("path")
let Router = require("../lib/router")
let app = new JRay()
let appRouter = new Router()


app.use(async function (ctx, next) {
    try {
        await next()
    } catch (e) {
        ctx.body = e.message
    }
})
app.use(static({
    root: path.resolve(path.join(process.cwd(), "../static"))
}))
app.use(bodyParse)
app.use(appRouter.routes())
appRouter.get("/test", async(ctx, next)=> {
    ctx.body = {"test": 123456}
    await next()
})
appRouter.get("/test/name", async(ctx, next)=> {
    ctx.body = {"test": 1234567890}
    await next()
})
appRouter.get("/demo/name", async(ctx, next)=> {
    ctx.body = {"test": "demo"}
    await next()
})

app.listen(3000)

let seelp = async(i)=> {
    return new Promise((rev, rej)=> {
        setTimeout(rev, i)
    })
}

