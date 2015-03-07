Template.preview.helpers({
    brand: function() {
        return orion.entities.brands.collection.findOne({_id: this.review.brand});
    },
    category: function() {
        return orion.entities.categories.collection.findOne({_id: this.review.category});
    },
    overall: function() {
        return this.review.average.toFixed(1);
    }
});