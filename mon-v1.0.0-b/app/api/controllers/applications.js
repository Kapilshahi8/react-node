const axios = require('axios');

module.exports = {
    newMerchant : (req, res, next) => {
        const qs = require('querystring');
        axios.post('https://process.formstack.com/forms/index.php', qs.stringify(req.body), {headers: {'Content-Type':'application/x-www-form-urlencoded'}})
            .then((data) => {
                console.log(data);
                res.json({status: "success", message: "New merchant application submitted successfully!"});
            }).catch((err) => {
            console.log(err);
            next(err);
            })
    }
}
