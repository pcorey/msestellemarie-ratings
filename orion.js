orion.admin.addAdminSubscription(orion.subs.subscribe('entity', 'categories'));

var attributes = {
    values: []
};

var categoryId = new ReactiveVar(null);

if (Meteor.isClient) {
    Template.adminEntitiesCreate.events({
        'change select[data-schema-key="category"]': function(e) {
            var category_id = $(e.currentTarget).val();
            categoryId.set(category_id);
            var category = orion.entities.categories.collection.findOne(category_id);
            attributes.values = category.attributes;
        }
    });
}

orion.addEntity('ratings', {
    product: {
        type: String,
        label: 'Product',
        optional: false
    },
    brand: {
        type: String,
        label: 'Brand',
        optional: true
    },
    category: {
        type: String,
        autoform: {
            options: function() {
                return orion.entities.categories.collection.find().fetch().map(function(value) {
                    return {
                        value: value._id,
                        label: value.category
                    };
                });
            }
        },
        optional: false,
        label: 'Category'
    },
    // "ratings.test": {
    //     type: Number,
    //     min: 1,
    //     max: 10,
    //     label: "Test"
    // },
    "ratings.$.attribute": {
        type: String,
        label: 'Attribute',
        optional: false,
        autoform: {
            options: function() {
                var category = orion.entities.categories.collection.findOne(categoryId.get());
                return category.attributes.map(function(value) {
                    return {
                        value: value,
                        label: value
                    }
                })
            }
        }
    },
    "ratings.$.rating": {
        type: Number,
        label: 'Rating',
        min: 1,
        max: 10,
        optional: false,
    },
    "ratings.$": {
        type: Object,
    },
    ratings: {
        type: Array,
        label: "Ratings",
        optional: false,
        // autoValue: function() {
        //     console.log('autovalue');
        //     return {
        //         foo: 123,
        //         bar: undefined
        //     };
        // }
        
        // testField: {
        //     type: String,
        //     optional: false
        // }
    },
    attributes: {
        type: String,
        autoform: {
            options: function() {
                // console.log('a');
                // var category_id = $('select[data-schema-key="category"]').val();
                // console.log('category_id', category_id);
                // if (category_id) {
                //     var category = orion.entities.categories.collection.find({
                //         _id: category_id
                //     }).fetch()[0];
                //     console.log('category', category)
                //     return category.attributes.map(function(value) {
                //         console.log(value);
                //         return {
                //             value: value,
                //             label: value
                //         };
                //     });
                // }
                // else {
                //     return [];
                // }
                // return attributes.values.map(function(value) {
                //     return {
                //         value: value,
                //         label: value
                //     };
                // });
                var category = orion.entities.categories.collection.findOne(categoryId.get());
                return category.attributes.map(function(value) {
                    return {
                        value: value,
                        label: value
                    }
                })
            }
        },
        optional: false,
        label: 'Attributes'
    },
    // image: orion.attribute('file', {
    //     label: 'Image',
    //     optional: true
    // }),
    links: {
        type: [String],
        label: 'Links',
        optional: true
    },
    review: orion.attribute('froala', {
        label: 'Review',
        optional: true
    }),

}, {
    icon: 'bookmark',
    sidebarName: 'Ratings',
    pluralName: 'Ratings',
    singularName: 'Rating',
    tableColumns: [
        {
            data: 'product',
            title: 'Product'
        }
    ]
});

orion.addEntity('categories', {
    category: {
        type: String,
        label: 'Category',
        optional: false
    },
    attributes: {
        type: [String],
        label: 'Attributes',
        optional: true
    }
}, {
    icon: 'bookmark',
    sidebarName: 'Categories',
    pluralName: 'Categories',
    singularName: 'Category',
    tableColumns: [
        {
            data: 'category',
            title: 'Category'
        }
    ]
});