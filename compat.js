if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function(obj) {
            var newArr = this.filter(function(el) {
                return el == obj;
            });
            return newArr.length > 0;
        }
    });
}
if (!Object.prototype.values) {
    Object.defineProperty(Object.prototype, "values", {
        enumerable: false,
        value: function(obj) {
            return Object.keys(obj).map(function(e) {return obj[e];});
        }
    });
}
