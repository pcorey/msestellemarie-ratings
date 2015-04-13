orion.admin.addAdminSubscription('entity', 'categories');
orion.admin.addAdminSubscription('entity', 'brands');

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
    "image.fileId": {
        type: String
    },
    "image.url": {
        type: String
    },
    image: orion.attribute('file', {
        label: 'Image',
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
    }
}

var categoryId = new ReactiveVar(null);

function updateReviewsSchema(attributes) {
    var reviewsSchema = attributes.reduce(function(schema, attribute) {
        schema['ratings.' + attribute] = {
            type: Number,
            label: attribute,
            min: 1,
            max: 10,
            optional: true,
            defaultValue: 1
        }
        return schema;
    }, {
        ratings: {
            type: Object,
            label: 'Reviews',
            optional: true
        }
    });
    schema = _.extend(_.clone(baseSchema), _.extend(reviewsSchema, _.clone(schemaEndcap)));
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

function setAverageOnUpdate(userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    var ratings = doc.ratings;
    var overall = 0;
    for (var key in ratings) {
            overall += ratings[key];
    }
    overall /= Object.keys(ratings).length;
    modifier.$set.average = overall;
}

function setAverageOnInsert(userId, doc) {
    var ratings = doc.ratings;
    var overall = 0;
    for (var key in ratings) {
            overall += ratings[key];
    }
    overall /= Object.keys(ratings).length;
    doc.average = overall;
}

orion.entities.reviews.collection.before.insert(setAverageOnInsert);
orion.entities.reviews.collection.before.update(setAverageOnUpdate);

if (Meteor.isServer) {
    Meteor.publish('reviews', function(averageSort, limit, category, brand, search, ids) {
        check(averageSort, Match.Integer);
        check(limit, Match.Integer);
        check(category, Match.OneOf(null, String));
        check(brand, Match.OneOf(null, String));
        check(search, Match.OneOf(null, String));
        check(ids, Match.OneOf(null, Array));
        var find = {};
        var options = {
            sort: {
                average: averageSort
            },
            limit: limit
        };
        var category = category;
        var brand = brand;
        if (category) {
            find.category = category;
        }
        if (brand) {
            find.brand = brand;
        }
        if (search) {
            find.$text = {
                $search: search
            };
        }
        if (ids && ids.length) {
            find._id = {$in: ids};
        }
        return orion.entities.reviews.collection.find(find, options);
    });
}

SimpleSchema.debug = true;