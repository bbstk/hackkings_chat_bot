const request = require('request');

const categories = ["groceries", "coffee", "clothing", "gadgets", "miscellanious"];
var users = { 'ivaylo': 'lafchiev', 'ivan': 'valkov', 'danail': 'penev', 'kristina': 'lazarova' };

function createUsers() {
    for (var key in users) {
        if (users.hasOwnProperty(key)) {
            console.log(key + " -> " + users[key]);
            var string = JSON.stringify({
                first_name: key,
                last_name: users[key],
                address: {
                    street_number: "test",
                    street_name: "test",
                    city: "test",
                    state: "WA",
                    zip: "44444"
                }
            });
            var options = {
                method: 'POST',
                url: 'http://api.reimaginebanking.com/customers?key=5e9a7df9497ab60eee4db8db8d16742d',
                body: string,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.body);
                }
            });

        }
    }
}

users.ivaylo = "583a2af10fa692b34a9b87fa";
users.ivan = "583a2afd0fa692b34a9b87fe";
users.danail = "583a2afd0fa692b34a9b87fc";
users.kristina = "583a2af10fa692b34a9b87f7"

accounts = {
    ivaylo: "583a324d0fa692b34a9b8807",
    danail: "583a324d0fa692b34a9b8806",
    kristina: "583a324d0fa692b34a9b8808",
    ivan: "583a327a0fa692b34a9b8809"

};

function createAccounts() {
    for (var key in users) {
        if (users.hasOwnProperty(key)) {
            console.log(key + " -> " + users[key]);
            var string = JSON.stringify({
                "type": "Credit Card",
                "nickname": key,
                "rewards": 0,
                "balance": 1000,
                "account_number": "0000000000000000"
            });
            var options = {
                method: 'POST',
                url: 'http://api.reimaginebanking.com/customers/' + users[key] + "/accounts?key=5e9a7df9497ab60eee4db8db8d16742d",
                body: string,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.body);
                    //let id = JSON.parse(response.body).objectCreated['_id'];
                    // accounts.key = id;
                }
            });
        }
    }
}


//  createAccounts();
//  console.log(accounts);


function purchaseThings() {
    for (var key in accounts) {
        if (accounts.hasOwnProperty(key)) {
            console.log(key + " -> " + accounts[key]);
            for (var i = 0; i < 10; i++) {
                var rand = (Math.random() * (50 - 0.1) + 0.1).toFixed(2);
                var string = JSON.stringify({
                    "merchant_id": "57cf75cea73e494d8675ec49",
                    "medium": "balance",
                    "purchase_date": randomDate(1, 30, 11, 2016),
                    "amount": parseFloat(rand),
                    "description": categories[Math.floor(Math.random() * categories.length)]
                });
                var options = {
                    method: 'POST',
                    url: "http://api.reimaginebanking.com/accounts/" + accounts[key] + "/purchases?key=5e9a7df9497ab60eee4db8db8d16742d",
                    body: string,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };
                request(options, function (error, response, body) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response.body);
                        //let id = JSON.parse(response.body).objectCreated['_id'];
                        // accounts.key = id;
                    }
                });
            }

        }
    }
}


function randomDate(start, end, month, year){
      var day = Math.ceil(start + Math.random() * (end - start));
      var date = year + "-" + month + "-" + day;
      return date;
}


purchaseThings();