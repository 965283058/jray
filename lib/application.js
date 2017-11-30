const Emitter = require('events');
const http = require('http')
const Context = require("./context")
module.exports = class Application extends Emitter {
    constructor() {
        super()
        this.middlewareList = [];
    }

    listen() {
        return http.createServer(this.httpCallback.bind(this)).listen(...arguments)
    }

    use(fn) {
        this.middlewareList.push(this.checkMiddlewar(fn))
        return this
    }

    httpCallback(request, response) {
        this.context = new Context(request, response)
        this.next()()
        process.nextTick(()=> {
            this.last()
        })
    }

    next(i = 0) {
        if (i < this.middlewareList.length) {
            let nextMiddleware = this.next(i + 1)
            return this.middlewareList[i].bind(this, this.context, nextMiddleware)
        } else {
            return Promise.resolve()
        }
    }

    last() {
        console.info("last run")
        let body = this.context.body || null
        this.context.res.setHeader("Content-Length", Buffer.byteLength(body))
        this.context.res.setHeader("Content-Type", "application/json")
        return this.context.res.end(body)
    }

    checkMiddlewar(fn) {
        if (typeof fn != "function") {
            throw new Error("middleware not a function")
        }
        if (fn.constructor.name == "GeneratorFunction") {
            throw new Error("middleware nonsupport generator function")
        }
        return fn
    }
}