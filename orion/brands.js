orion.addEntity('brands', {
    brand: {
        type: String,
        label: 'Brand',
        optional: false
    },
    slug: {
        type: String,
        label: 'Slug',
        optional: false
    }
}, {
    icon: 'bookmark',
    sidebarName: 'Brands',
    pluralName: 'Brands',
    singularName: 'Brand',
    tableColumns: [
        {
            data: 'brand',
            title: 'Brand'
        }
    ]
});

if (Meteor.isServer) {
    Meteor.publish('brands', function(find, options) {
        return orion.entities.brands.collection.find(find, options);
    });
}