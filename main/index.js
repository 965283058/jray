const JRay = require("../lib/application")
let app = new JRay()
app.use(function (ctx, next) {
    ctx.body = "hello"
    next()
})

app.use(function (ctx, next) {
    ctx.body += " 呵呵"
    next()
})

app.listen(3000)