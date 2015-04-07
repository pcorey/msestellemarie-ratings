Template.ratings.helpers({
    attributes: function() {
        console.log(this);
        return orion.entities.categories.collection.findOne({
            _id: this.review.category
        }).attributes;
    },
    overall: function() {
        return this.review.average.toFixed(1);
    },
    width: function(attribute, review) {
        return 100*(review.ratings[attribute]/10);
    }
})