let http = require('http');
let url = require('url');
let querystring = require('querystring');
let static = require('node-static');
let file = new static.Server('.', {
    cache: 0
});

function accept(req, res) {

    if (req.url == 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json') {
            file.serve(req, res);
    } else {
        file.serve(req, res);
    }
}

// ------ запустить сервер -------

if (!module.parent) {
    http.createServer(accept).listen(8080);
} else {
    exports.accept = accept;
}
console.log('Server running on port 8080');