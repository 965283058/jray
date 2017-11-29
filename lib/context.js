module.exports = class Context {
    constructor(request, response) {
        this.body = null
        this.req = request
        this.res = response
    }
}