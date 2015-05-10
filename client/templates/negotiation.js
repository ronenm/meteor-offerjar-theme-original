Template.Negotiation.helpers({
  productTitle: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    if ( negotiation && negotiation.title ) {
      return negotiation.title;
    } else {
      var button = OfferJar.UI.currentButton.get();
      if (button) {
        return button.title;
      } else {
        return null;
      }
    }
  }
});