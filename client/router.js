Session.set('averageSort', -1);
Session.set('limitChunk', 10);
Session.set('limit', Session.get('limitChunk'));
Session.set('category', null);
Session.set('brand', null);
Session.set('search', null);

Router.route('/', {
    name: 'main',
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
            Meteor.subscribe('reviews', Session.get('averageSort'),
                                        Session.get('limit'),
                                        Session.get('category'),
                                        Session.get('brand'),
                                        Session.get('search')),
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
