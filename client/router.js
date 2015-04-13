Session.set('averageSort', -1);
Session.set('limitChunk', 10);
Session.set('limit', Session.get('limitChunk'));
Session.set('category', null);
Session.set('brand', null);
Session.set('search', null);
Session.set('ids', []);
Session.set('initial_ids', []);

Router.map(function () {
    this.route('main', {
        path: '/',
        layoutTemplate: 'layout',
        waitOn: function() {
            return [
                Meteor.subscribe('reviews', Session.get('averageSort'),
                                            Session.get('limit'),
                                            Session.get('category'),
                                            Session.get('brand'),
                                            Session.get('search'),
                                            Session.get('initial_ids')),
                Meteor.subscribe('entity', 'categories'),
                Meteor.subscribe('entity', 'brands'),
            ];
        },
        data: function() {
            var options = {
                sort: {
                    average: Session.get('averageSort')
                }
            };

            var reviews = orion.entities.reviews.collection.find({}, options);
            var brands = orion.entities.brands.collection.find({});
            var categories = orion.entities.categories.collection.find({});
            return {
                reviews: reviews,
                brands: brands,
                categories: categories
            };
        }
    });
});

Router.configure({
    loadingTemplate: 'loading',
    progressSpinner: false
});

Meteor.startup(function() {
    var ids = window.location.hash.split(',').map(function(id) {
        return id.trim().replace('#','');
    }).filter(function(id) {
        return id.length;
    });
    Session.set('ids', ids);
    Session.set('initial_ids', ids);

    Tracker.autorun(function() {
        window.location.hash = '#' + Session.get('ids').join(',');
    });
});