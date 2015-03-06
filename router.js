Router.route('/', function () {
    this.render('main');
});

// Router.route('/:_id', function () {
//     var id = this.params._id;
//     this.render('review', {data: {id: id}});
// });

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
        var review = orion.entities.reviews.collection.findOne({slug: this.params.slug});
        console.log('review', review);
        return {
            review: review
        };
    }
})

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