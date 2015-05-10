Template.OfferJarImage.helpers({
  url: function() {
    var style = Template.instance().data.style || 'limit_width';
    var image = Template.instance().data.image;
    return image.url[style];
  },
  title: function() {
    return Template.instance().data.hideTitle ? null : Template.instance().data.image.title;
  }
})

Template.ProductGallery.hooks({
  rendered: function() {
    this.$('.slider').slick({
      dots: true,
      arrows: true,
      adaptiveHeight: false,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: false,
      centerPadding: '60px',
    });
  }
});

Template.ProductGallery.helpers({
  singleImage: function() {
    var images = Template.instance().data.images;
    return images&&images.length==1 ? images[0] : null;
  },
  imageIndices: function() {
    var images = Template.instance().data.images;
    return _.map(images,function(img,idx) {
      return {index: idx};
    })
  }
})