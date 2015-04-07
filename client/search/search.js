Template.search.helpers({
    asc: function() {
        return Session.get('averageSort') == 1;
    },
    selected: function(field) {
        return Session.get(field) == this._id;
    }
});

Template.search.events({
    'click .sort': function() {
        if (!Session.get('averageSort')) {
            Session.set('averageSort', 1);
        }
        else {
            Session.set('averageSort', Session.get('averageSort') * -1);
        }
    },
    'change .category': function() {
        console.log('category change', $('.category').val());
        Session.set('category', $('.category').val());
    },
    'change .brand': function() {
        console.log('brand change', $('.brand').val());
        Session.set('brand', $('.brand').val());
    }
});