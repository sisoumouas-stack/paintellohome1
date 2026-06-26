
module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    // ✅ Add main product (regular price)
    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {
                item: item, 
                qty: 0, 
                price: 0,
                unitPrice: item.price,  // Store unit price
                isDiscounted: false
            };
        }
        storedItem.qty++;
        storedItem.price = storedItem.unitPrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.unitPrice;
    };

    // ✅ Add discounted product (30% off)
   // In your Cart class, update the addDiscounted method:
this.addDiscounted = function(item, id, discountPercent = 0.3, discountedWith = null){
    var storedItem = this.items[id];
    
    // Calculate discounted price
    const discountedPrice = item.price * (1 - discountPercent);
    
    if(!storedItem){
        storedItem = this.items[id] = {
            item: item, 
            qty: 0, 
            price: 0,
            unitPrice: discountedPrice,
            originalPrice: item.price,
            discountPercent: discountPercent * 100,
            isDiscounted: true,
            discountedWith: discountedWith  // Store which main product this discount depends on
        };
    }
    
    storedItem.qty++;
    storedItem.price = storedItem.unitPrice * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.unitPrice;
};

    // ✅ Alternative: Add with specific discounted price
    this.addWithDiscount = function(item, id, discountedPrice){
        var storedItem = this.items[id];
        
        if(!storedItem){
            storedItem = this.items[id] = {
                item: item, 
                qty: 0, 
                price: 0,
                unitPrice: discountedPrice,
                originalPrice: item.price,
                discountPercent: Math.round((1 - (discountedPrice / item.price)) * 100),
                isDiscounted: true
            };
        } else {
            // Update existing item to discounted
            storedItem.unitPrice = discountedPrice;
            storedItem.originalPrice = item.price;
            storedItem.discountPercent = Math.round((1 - (discountedPrice / item.price)) * 100);
            storedItem.isDiscounted = true;
            storedItem.price = discountedPrice * storedItem.qty;
        }
        
        storedItem.qty++;
        storedItem.price = storedItem.unitPrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.unitPrice;
    };

    // ✅ Add second product (for your 30% off promotion)
    this.addSecondProduct = function(item, id){
        // Always apply 30% discount for second product
        return this.addWithDiscount(item, id, item.price * 0.7);
    };

    this.reduceByOne = function (id) {
        if (!this.items[id]) return;
        
        this.items[id].qty--;
        this.items[id].price = this.items[id].unitPrice * this.items[id].qty;
        this.totalQty--;
        this.totalPrice -= this.items[id].unitPrice;

        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        if (!this.items[id]) return;
        
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.update = function(id, qty) {
        let storedItem = this.items[id];
        if (!storedItem) return;
        
        // Remove old quantity from totals
        this.totalQty -= storedItem.qty;
        this.totalPrice -= storedItem.price;

        // Update quantity and recalculate price
        storedItem.qty = qty;
        storedItem.price = storedItem.unitPrice * qty;

        // Add new values to totals
        this.totalQty += qty;
        this.totalPrice += storedItem.price;
        this.items[id] = storedItem;
    };

    this.increaseQty = function(id) {
        var storedItem = this.items[id];
        if (storedItem) {
            storedItem.qty++;
            storedItem.price = storedItem.unitPrice * storedItem.qty;
            this.totalQty++;
            this.totalPrice += storedItem.unitPrice;
        }
    };

    this.decreaseQty = function(id) {
        var storedItem = this.items[id];
        if (storedItem) {
            storedItem.qty--;
            storedItem.price = storedItem.unitPrice * storedItem.qty;
            this.totalQty--;
            this.totalPrice -= storedItem.unitPrice;

            if (storedItem.qty <= 0) {
                delete this.items[id];
            }
        }
    };

    // ✅ Get cart summary for display
    this.getSummary = function() {
        const items = this.generateArray();
        const regularItems = items.filter(item => !item.isDiscounted);
        const discountedItems = items.filter(item => item.isDiscounted);
        
        let regularTotal = 0;
        let discountTotal = 0;
        let savings = 0;
        
        items.forEach(item => {
            if (item.isDiscounted) {
                discountTotal += item.price;
                savings += (item.originalPrice - item.unitPrice) * item.qty;
            } else {
                regularTotal += item.price;
            }
        });
        
        return {
            items: items,
            regularTotal: regularTotal,
            discountTotal: discountTotal,
            totalPrice: this.totalPrice,
            totalQty: this.totalQty,
            savings: savings,
            hasDiscount: discountedItems.length > 0
        };
    };
};
