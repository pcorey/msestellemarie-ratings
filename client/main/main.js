Template.main.helpers({

});

$(window).scroll(function() {
    if($(window).scrollTop() >= $(document).height() - $(window).height()) {
        if (orion.entities.reviews.collection.find({}).count() >= Session.get('limit')) {
            Session.set('limit', Session.get('limit') + Session.get('limitChunk'));
        }
    }
});