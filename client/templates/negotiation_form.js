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

function calculateInputBinWidth(event) {
  var $input = event.data.$('input[name="bid"]');
  var $parent = $input.parent();
  var $symbol = $('.currnecy-symbol',$parent);
  var newWidth = $parent.innerWidth() - $symbol.outerWidth() - 10;
  $input.css({width: newWidth});
}

Template.NegotiationForm.hooks({
  rendered: function() {
    calculateInputBinWidth({data: this});
    $(window).resize(this,calculateInputBinWidth);
  }
});

function animateUserBid() {
  var $animated = $('#bid .price-col');
  var $input = $('#negotiationForm input[name="bid"]');
  
  var animOffset = $animated.offset();
  var inputOffset = $input.offset();
  
  if (inputOffset && animOffset) {
    deltaY = inputOffset.top - animOffset.top;
    $animated.velocity({top: "+" + deltaY + 'px'},0).velocity({top: 0},{ duration: 2000, easing: 'spring'});
  }
  
}

AutoForm.hooks({
  negotiationForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var negotiation = OfferJar.UI.Negotiations.findOne(currentDoc._id);
      var transition = negotiation && negotiation.currentState()==="initial_bid" ? 'set_initial_bid' : 'go_bid';
      var self = this;
      animateUserBid();
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
