var express       = require("express");
var app           = express();
var request       = require("request");

var productData   = [];
var singleProduct = [];


//used promises for async calls
function getRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}


//Callback function to get the list of products
app.get("/products", function(req, res){
getRequest('http://autumn-resonance-1298.getsandbox.com/inventory').then(function (body) {
          var inventoryData = JSON.parse(body);
          productData.push(inventoryData.inventory);
          return getRequest('http://autumn-resonance-1298.getsandbox.com/products');
          
}).then(function (body) {
          var priceData = JSON.parse(body);
          productData.push(priceData);
          
          var finalData=[];
          for (var i=0; i<productData[0].length; i++) {
          var aItem = productData[0][i], bItem=productData[1][i];
          finalData.push({ name:aItem.name,  price: bItem.price, inventory:aItem.inventory});
    }
          res.send(finalData);
    });
    
});


//callback for searching for a specific product
app.get("/products/:query", function(req,res){
    var query = req.params.query;
    if( query == "hat" || query == "sun glasses" || query == "pen" || query == "shirt" || query == "basketball" || query == "headphones") {
    var url1 = 'http://autumn-resonance-1298.getsandbox.com/inventory/' + query;
    var url2 = 'http://autumn-resonance-1298.getsandbox.com/products/' + query;
     getRequest(url1).then(function(body){
          
         var inventoryData = JSON.parse(body);
         singleProduct.push(inventoryData.inventory);
         return getRequest(url2);
 
    }).then(function(body) {
        
        var priceData = JSON.parse(body);
        singleProduct.push(priceData.product);
        
         var finalData =[];
         var aItem = singleProduct[0][0], bItem=singleProduct[1][0];
         finalData.push({ name:aItem.name,  price: bItem.price, inventory:aItem.inventory});
         res.send(finalData);
         singleProduct = []; 
    })
    }
    else {
        res.send("Product you requested does not exist. Please enter a valid product.");
        return Promise.reject("Product you requested does not exist.");
    }
});


//All other URLs are handled here
app.all('*', function(req, res) {
    res.send("URL does not exist. Please enter a valid URL.");
})


app.listen(3000, function(){
    console.log("Server is listening !");
});