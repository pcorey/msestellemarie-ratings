orion.admin.addAdminSubscription(orion.subs.subscribe('entity', 'categories'));

var defaultSchema = {
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    createdBy: {
        type: String,
        autoform: {
            omit: true
        },
        autoValue: function() {
            if (this.isInsert) {
                return Meteor.userId();
            } else if (this.isUpsert) {
                return {$setOnInsert: Meteor.userId()};
            } else {
                this.unset();
            }
        }
    },
};

var baseSchema = _.extend(defaultSchema, {
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
    // attributes: {
    //     type: String,
    //     autoform: {
    //         options: function() {
    //             var category = orion.entities.categories.collection.findOne(categoryId.get());
    //             return category.attributes.map(function(value) {
    //                 return {
    //                     value: value,
    //                     label: value
    //                 }
    //             })
    //         }
    //     },
    //     optional: false,
    //     label: 'Attributes'
    // },
    // image: orion.attribute('file', {
    //     label: 'Image',
    //     optional: true
    // }),
    // "links.$": {
    //     type: String
    // },
    // links: {
    //     type: [String],
    //     label: 'Links',
    //     optional: true
    // },
    // review: orion.attribute('froala', {
    //     label: 'Review',
    //     optional: true
    // }),
});

var categoryId = new ReactiveVar(null);

function updateRatingsSchema(attributes) {
    var ratingsSchema = attributes.reduce(function(schema, attribute) {
        schema['ratings.' + attribute] = {
            type: Number,
            label: attribute,
            min: 1,
            max: 10,
            optional: true
        }
        return schema;
    }, {
        ratings: {
            type: Object,
            label: 'Ratings',
            optional: true
        }
    });
    schema = _.extend(_.clone(baseSchema), ratingsSchema);
    orion.entities.ratings.schema = schema;
    orion.entities.ratings.collection.attachSchema(new SimpleSchema(schema), {
        replace: true
    });
}

if (Meteor.isClient) {
    Tracker.autorun(function() {
        var category_id = categoryId.get();
        if (!category_id) {
            return;
        }
        var category = orion.entities.categories.collection.findOne(category_id);
        Meteor.call('updateRatingsSchema', category.attributes);
        updateRatingsSchema(category.attributes);
        AutoForm.invalidateFormContext('createEntityForm');
        AutoForm.invalidateFormContext('updateEntityForm');
    })
    Template.adminEntitiesCreate.events({
        'change select[data-schema-key="category"]': function(e) {
            categoryId.set($(e.currentTarget).val());
        }
    });
    Template.adminEntitiesCreate.rendered = function() {
        categoryId.set($('select[data-schema-key="category"]').val());
    };
    Template.adminEntitiesUpdate.events({
        'change select[data-schema-key="category"]': function(e) {
            categoryId.set($(e.currentTarget).val());
        }
    });
    Template.adminEntitiesUpdate.rendered = function() {
        categoryId.set($('select[data-schema-key="category"]').val());
    };
}

if (Meteor.isServer) {
    Meteor.methods({
        updateRatingsSchema: function(attributes) {
            updateRatingsSchema(attributes);
        }
    })
}



orion.addEntity('ratings', _.extend(_.clone(baseSchema), {}), {
    icon: 'bookmark',
    sidebarName: 'Ratings',
    pluralName: 'Ratings',
    singularName: 'Rating',
    tableColumns: [
        {
            data: 'product',
            title: 'Product'
        },
        {
            data: 'brand',
            title: 'Brand'
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