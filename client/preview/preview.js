Template.preview.created = function() {
    this.expanded = new ReactiveVar(false);
}

Template.preview.helpers({
    brand: function() {
        return orion.entities.brands.collection.findOne({_id: this.review.brand});
    },
    category: function() {
        return orion.entities.categories.collection.findOne({_id: this.review.category});
    },
    overall: function() {
        return this.review.average.toFixed(1);
    },
    attributes: function() {
        return Object.keys(this.review.ratings);
    },
    width: function(review) {
        return (review.review.ratings[this]/10.0) * 100 + '%';
    },
    widthText: function(review) {
        return review.review.ratings[this];
    },
    hasLinks: function() {
        return this.review.links && this.review.links.length;
    },
    expanded: function() {
        return Template.instance().expanded.get();
    },
    linked: function() {
        return Session.get('ids').indexOf(this.review._id) > -1;
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
    'click .title': function(e, t) {
        t.expanded.set(!t.expanded.get());
        return false;
    },
    'click .expand': function(e, t) {
        t.expanded.set(!t.expanded.get());
        return false;
    },
    'click .link': function() {
        var ids = Session.get('ids');
        if (ids.indexOf(this.review._id) == -1) {
            ids.push(this.review._id);
            Session.set('ids', ids);
        }
    },
    'click .unlink': function() {
        var ids = Session.get('ids');
        var idx = ids.indexOf(this.review._id)
        ids.splice(idx, 1);
        Session.set('ids', ids);
    }
});