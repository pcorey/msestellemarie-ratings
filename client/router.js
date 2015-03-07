Session.set('averageSort', -1);
Session.set('limit', 10);
Session.set('category', null);
Session.set('brand', null);

Router.route('/', {
    name: 'main',
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    waitOn: function() {
        var find = {};
        var options = {
            sort: {
                average: Session.get('averageSort')
            },
            limit: Session.get('limit')
        };
        var category = Session.get('category');
        var brand = Session.get('brand');
        if (category) {
            find.category = category;
        }
        if (brand) {
            find.brand = brand;
        }
        return [
            Meteor.subscribe('reviews', find, options),
            Meteor.subscribe('entity', 'categories'),
            Meteor.subscribe('entity', 'brands'),
        ];
    },
    data: function() {
        var options = {
            sort: {
                average: Session.get('averageSort')
            },
            limit: Session.get('limit')
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

Router.route('/:slug', {
    name: 'review',
    layoutTemplate: 'review',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
            orion.subs.subscribe('entity', 'reviews'),
            orion.subs.subscribe('entity', 'categories'),
            orion.subs.subscribe('entity', 'brands'),
        ];
    },
    data: function() {
        var review = orion.entities.reviews.collection.findOne({
            slug: this.params.slug
        });
        return {
            review: review
        };
    }
});