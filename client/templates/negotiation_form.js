Template.NegotiationForm.helpers({
  inputPlaceHolder: function() {
    return OfferJar.UI.tr("offer_placeholder");
  },
  schema: function() {
    return this.createNegotiationSchema('bid');
  },
  doc: function() {
    return {_id: this._id, bid: this.bid};
  },
  formType: function() {
    return this.isWaiting ? "disabled" : "normal";
  }
});

AutoForm.hooks({
  negotiationForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var transition = this.template.$('button[type="submit"]').attr('id');
      var negotiation = OfferJar.UI.Negotiations.findOne(currentDoc._id);
      var self = this;
      negotiation.remoteTransition(transition,insertDoc,function(error,result) {
        if (error) {
          self.done(error);
        } else {
          self.done();
        }
      });
      return false;
    }
  }
});