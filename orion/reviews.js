orion.admin.addAdminSubscription(orion.subs.subscribe('entity', 'categories'));
orion.admin.addAdminSubscription(orion.subs.subscribe('entity', 'brands'));

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
        autoform: {
            options: function() {
                return orion.entities.brands.collection.find().fetch().map(function(value) {
                    return {
                        value: value._id,
                        label: value.brand
                    };
                });
            }
        },
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
    }
});

var schemaEndcap = {
    image: orion.attribute('file', {
        label: 'Image',
        optional: true
    }),
    review: orion.attribute('froala', {
        label: 'Review',
        optional: true
    }),
    "links.$.url": {
        type: String,
        label: "URL"
    },
    "links.$.label": {
        type: String,
        label: "Label"
    },
    "links.$": {
        type: Object
    },
    links: {
        type: [Object],
        label: 'Links',
        optional: true
    },
    slug: {
        type: String,
        label: 'Slug',
        optional: false
    }
}

var categoryId = new ReactiveVar(null);

function updateReviewsSchema(attributes) {
    var reviewsSchema = attributes.reduce(function(schema, attribute) {
        schema['reviews.' + attribute] = {
            type: Number,
            label: attribute,
            min: 1,
            max: 10,
            optional: true,
            defaultValue: 1
        }
        return schema;
    }, {
        reviews: {
            type: Object,
            label: 'Reviews',
            optional: true
        }
    });
    schema = _.extend(_.clone(baseSchema), _.extend(reviewsSchema, schemaEndcap));
    orion.entities.reviews.schema = schema;
    orion.entities.reviews.collection.attachSchema(new SimpleSchema(schema), {
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
        Meteor.call('updateReviewsSchema', category.attributes);
        updateReviewsSchema(category.attributes);
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
        updateReviewsSchema: function(attributes) {
            updateReviewsSchema(attributes);
        }
    })
}

orion.addEntity('reviews', _.extend(_.clone(baseSchema), {}), {
    icon: 'bookmark',
    sidebarName: 'Reviews',
    pluralName: 'Reviews',
    singularName: 'Review',
    tableColumns: [
        {
            data: 'product',
            title: 'Product'
        }
    ]
});

function setAverage(userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    var ratings = doc.reviews;
    var overall = 0;
    for (var key in ratings) {
            overall += ratings[key];
    }
    overall /= Object.keys(ratings).length;
    modifier.$set.average = overall;
}

orion.entities.reviews.collection.before.insert(setAverage);
orion.entities.reviews.collection.before.update(setAverage);