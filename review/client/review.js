Template.review.helpers({
    brand: function() {
        return orion.entities.brands.collection.findOne({_id: this.review.brand});
    },
    category: function() {
        return orion.entities.categories.collection.findOne({_id: this.review.category});
    },
});

Template.review.events({
    'click .brand': function(e) {
        console.log(this);
        Session.set('brand', null);
        return false;
    },
    'click .category': function(e) {
        return false;
    }
});