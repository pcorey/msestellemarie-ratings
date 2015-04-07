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

Template.preview.events({
    'click .brand': function(e) {
        Session.set('brand', this.review.brand);
        return false;
    },
    'click .category': function(e) {
        Session.set('category', this.review.category);
        return false;
    },
    'click .title a': function() {
        console.log('click');
        return false;
    }
});