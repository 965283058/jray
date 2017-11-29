const Emitter = require('events');
const http = require('http')
const Context = require("./context")
module.exports = class Application extends Emitter {
    constructor() {
        super()
        this.middleware = [];
    }

    listen() {
        return http.createServer(this.httpCallback.bind(this)).listen(...arguments)
    }

    use(fn) {
        if (typeof fn == "function") {
            this.middleware.push(fn)
        }
        return this
    }

    httpCallback(req, res) {
        this.context = new Context(req, res)
        let fn=this.next()()
    }

    next(i = 0) {
        if (i < this.middleware.length) {
            let nextMiddleware=this.next(i + 1)
            return this.middleware[i].bind(this, this.context, nextMiddleware)
        }else{
            return this.last.bind(this, this.context)
        }
    }
    last(ctx) {
        let body = ctx.body || null
        ctx.res.setHeader("Content-Length", Buffer.byteLength(body))
        ctx.res.setHeader("Content-Type", "application/json")
        return ctx.res.end(body)
    }
}