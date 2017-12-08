const fs = require("fs")
module.exports = async(ctx, next)=> {
    let request = ctx.req
    let method = request.method
    let body = {}
    if (method == "GET") {
        if (request.url.indexOf('?') != -1) {
            let query = request.url.split('?')[1]
            if(query){
                body = parseParams(query)
            }
        }
    } else if (method == "POST") {
        let contentType = request.headers["content-type"]
        let length = Number.parseInt(request.headers["content-length"])
        let query = await readBuff(request)
        switch (contentType) {
            case "application/x-www-form-urlencoded":
                if (query && typeof query == "string") {
                    body = parseParams(query)
                } else {
                    throw new Error("parse body error")
                }
                break;
            case "application/json":
                try {
                    body = JSON.parse(decodeURI(query))
                } catch (e) {
                    throw new Error("parse body error:" + e.message)
                }
        }
    }
    ctx.req.body = body
    await next()
}

let readBuff = async function (request) {
    return new Promise((rev, rej)=> {
        let buffs = []
        request.on("data", function (data) {
            buffs.push(data)
        })
        request.on("end", function () {
            let buff = Buffer.concat(buffs)
            rev(buff.toString())
            buffs = null
            buff = null
        })
        request.on("error", function (data) {
            let buff = Buffer.concat(buffs)
            rej()
        })
    })
}


let parseParams = (contentString)=> {
    let params = contentString.split("&")
    let temp = null, body = {}
    params.forEach((item)=> {
        temp = item.split('=')
        temp[0] = decodeURI(temp[0])
        temp[1] = decodeURI(temp[1])
        if (temp[0].indexOf('[]') > 0) {
            let key = temp[0].replace('[]', '')
            if (body[key]) {
                body[key].push(temp[1])
            } else {
                let key = temp[0].replace('[]', '')
                body[key] = [(temp[1] || '')]
            }
        } else {
            body[temp[0]] = temp[1] || ''
        }
    })
    return body
}
