module.exports = class Router {
    constructor(options = {}) {
        this.middlewareList = {};
        options.methods = options.methods || ["get", "post", "delete", "put"]
        options.methods.unshift("all")

        options.methods.forEach((method)=> {
            this[method] = this.getMethod(method)
        })
    }

    routes() {
        return async(ctx, next)=> {
            let fn
            // console.info(this.middlewareList)
            Object.keys(this.middlewareList).forEach((route)=> {
                let reg = new RegExp("^" + route + "$")
                let match = ctx.req.url.match(reg)
                if (match) {
                    if (this.middlewareList[route]['method'] == "all" || this.middlewareList[route]['method'] == ctx.req.method.toLowerCase()) {
                        fn = this.middlewareList[route]["handle"]
                        return
                    }
                }
            })
            if (fn) {
                console.info(ctx.req.url)
                await fn(ctx, next)
            } else {
                await next()
            }

        }
    }


    getMethod(method) {
        return (url, fn)=> {
            this.middlewareList[url] = {
                "method": method,
                "handle": fn
            }
        }
    }
}