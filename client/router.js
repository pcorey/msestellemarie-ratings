Session.set('averageSort', -1);
Session.set('category', null);
Session.set('brand', null);

Router.route('/', {
    name: 'main',
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
            orion.subs.subscribe('reviews', {}, {sort: {average: -1}}),
            orion.subs.subscribe('entity', 'categories'),
            orion.subs.subscribe('entity', 'brands'),
        ];
    },
    data: function() {
        var find = {};
        var options = {sort: {average: Session.get('averageSort')}};
        var category = Session.get('category');
        var brand = Session.get('brand');
        console.log('category brand', category, brand);
        if (category) {
            find.category = category;
        }
        if (brand) {
            find.brand = brand;
        }

        var reviews = orion.entities.reviews.collection.find(find, options);
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