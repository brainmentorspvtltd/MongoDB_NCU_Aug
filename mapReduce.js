var mapFunc = function() {
    emit(this.details.c_id, this.details.qty);
};

var reduceFunc = function(key, value) {
    return Array.sum(value);
};

db.orders.mapReduce(
    mapFunc,
    reduceFunc,
    {out : "output_mr"}
)

// Recommended
db.orders.aggregate([
    {$group : {_id : "$details.c_id", value : {$sum : "$details.qty"}}},
    {$out : "output_mr"}
])


db.orders.aggregate([
    {
        $project : {
            emit : {
                key : "$details.c_id",
                value : "$details.qty"
            }
        }
    },
    {
        $group : {
            _id : "$emit.key",
            value : {
                $accumulator : {
                    init : function() {return 0;},
                    initArgs : [],
                    accumulate : function(state, value) {
                        return state + value;
                    },
                    accumulateArgs : ["$emit.value"],
                    merge : function(state1, state2) {
                        return state1 + state2;
                    },
                    lang : "js"
                }
            }
        }
    },
    {
        $out : "output_mr"
    }
])


var mapFunc = function() {
    for(var i = 0; i < this.arr.length; i++) {
        var key = this.arr[i].key;
        var value = {
            count : 1, qty : this.arr[i].value
        };
        emit(key, value);
    }
}

var reduceFunc = function(key, value) {
    reducedVal = {
        count : 0,
        qty : 0
    };
    for(var i = 0; i < value.length; i++) {
        reduceVal.count += value[i].count;
        reducedVal.qty += value[i].qty;
    }
    return reducedVal;
}

var finalizeFunc = function(key, reducedVal) {
    reducedVal.avg = reducedVal.qty / reducedVal.count;
    return reducedVal; 
}

db.orders.mapReduce(
    mapFunc,
    reduceFunc,
    {
        out : "output_mr_2",
        finalize : finalizeFunc
    }
)
