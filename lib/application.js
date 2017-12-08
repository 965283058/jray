const Emitter = require('events');
const http = require('http')
const Context = require("./context")
const Stream = require("stream")
module.exports = class Application {
    constructor(options) {
        this.middlewareList = [];
    }

    listen() {
        return http.createServer(this.httpCallback.bind(this)).listen(...arguments)
    }

    use(fn) {
        this.middlewareList.push(this.checkMiddlewar(fn))
        return this
    }

    async httpCallback(request, response) {
        this.context = new Context(request, response)
        await this.next()()
        this.last()
    }


    next(i = 0) {
        if (i < this.middlewareList.length) {
            let nextMiddleware = this.next(i + 1)
            return this.middlewareList[i].bind(this, this.context, nextMiddleware)
        } else {
            return ()=> {
            }
        }
    }

    last() {
        if (!this.context.res.headersSent) {
            let body = this.context.body
            if (body == null) {
                this.context.res.statasCode = 404
                return this.context.res.end()
            }
            if (body instanceof Stream) {
                return body.pipe(this.context.res)
            }
            if (typeof body === "string") {
                this.context.res.setHeader("Content-Length", Buffer.byteLength(body))
                return this.context.res.end(body)
            }
            if (Buffer.isBuffer(body)) {
                this.context.res.setHeader("Content-Length", Buffer.byteLength(body))
                return this.context.res.end(body)
            }
            body=JSON.stringify(body)
            this.context.res.setHeader("Content-Length", Buffer.byteLength(body))
            this.context.res.end(body)
        }
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