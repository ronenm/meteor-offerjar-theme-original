Template.NegotiationHistoryRow.helpers({
  id: function() {
    return this[0];
  },
  legend: function() {
    return OfferJar.UI.tr("history_"+this[1]+"der",'buy') + " " + OfferJar.UI.tr("offered");
  },
  offer: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    if (!negotiation) return null;
    var currency = negotiation.currency;
    if (!currency) {
      var button = OfferJar.UI.currentButton.get();
      if (!button) return null;
      currency = button.currency;
    }
    var price = this[2];
    return new Money(price,OfferJar.UI.findOrAddCurrency(currency));
  },
  time:function() {
    return this[3];
  },
  index: function() {
    return this[4];
  }
});

Template.NegotiationHistory.hooks({
  rendered: function() {
    var $history_wrapper = this.$('#negotiation-history');
    $('.history-item',$history_wrapper).last().velocity("scroll", {duration: 500, easing: "spring", container: $history_wrapper});
  }
})