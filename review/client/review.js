Template.review.helpers({
    attributes: function() {
        console.log(this);
        return orion.entities.categories.collection.findOne({
            _id: this.review.category
        }).attributes;
    },
    overall: function() {
        var ratings = this.review.reviews;
        var overall = 0;
        for (var key in ratings) {
                overall += ratings[key];
                console.log(ratings[key]);
        }
        overall /= Object.keys(ratings).length;
        return overall.toFixed(1);
    },
    width: function(attribute, review) {
        return 100*(review.reviews[attribute]/10);
    }
});