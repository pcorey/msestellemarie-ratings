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
        },
        {
            data: 'attributes',
            title: 'Attributes'
        }
    ]
});

if (Meteor.isServer) {
    Meteor.publish('categories', function(find, options) {
        return orion.entities.categories.collection.find(find, options);
    });
}