Router.route('/', {
    name: 'main',
    layoutTemplate: 'main',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [
            orion.subs.subscribe('entity', 'reviews'),
            orion.subs.subscribe('entity', 'categories'),
            orion.subs.subscribe('entity', 'brands'),
        ];
    },
    data: function() {
        var reviews = orion.entities.reviews.collection.find({});
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

// Router.route('/items/:_id', function () {
//     var item = Items.findOne({_id: this.params._id});
//     this.render('ShowItem', {data: item});
// });

// Router.route('/files/:filename', function () {
//     this.response.end('hi from the server\n');
// }, {where: 'server'});

// Router.route('/restful', {where: 'server'})
// .get(function () {
//     this.response.end('get request\n');
// })
// .post(function () {
//     this.response.end('post request\n');
// });