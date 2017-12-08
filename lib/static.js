const fs = require("fs")
const path = require("path")
const mime = require("node-mime")
const zlib = require("zlib")

module.exports = function (options) {
    options = Object.assign({}, {
        root: process.cwd(),
        index: "index.html"
    }, options)
    return async function (ctx, next) {
        let url = ctx.req.url
        if (!url || url == "/") {
            url = options.index
        }
        url = path.join(options.root, url)
        try {
            let stats = await readable(url)
            if (stats.isFile()) {
                let encoding = ctx.req.headers["accept-encoding"]
                let fileRS = fs.createReadStream(url)
                let outRS = null
                if (encoding.indexOf("gzip") > -1) {
                    ctx.res.setHeader('Content-Encoding', "gzip")
                    const gzip = zlib.createGzip()
                    outRS = fileRS.pipe(gzip)
                } else {
                    outRS = fileRS
                }
                ctx.res.writeHead(200, {
                    'Content-Type': mime.lookUpType(url.split(".").pop()),
                    'Content-Length': stats.size
                });
                outRS.pipe(ctx.res)
                return
            }
            await next()
        } catch (e) {
            await next()
        }
        await next()
    }
}

let readable = async(path)=> {
    return new Promise((rev, rej)=> {
        fs.stat(path, function (err, stats) {
            if (err) {
                rej(err)
            } else {
                rev(stats)
            }
        })
    })
}