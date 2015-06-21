Template.registerHelper('lineLegend',function() {
  var inst = Template.instance();
  if (this.legend || inst.get('legend')) {
    return this.legend || inst.get('legend');
  } else {
    var key = this.legendKey || inst.get('defaultKey');
    return key ? OfferJar.UI.tr(key,this.action||inst.get('action')||'buy',this.legendParams||inst.get('legendParams')) : inst.get('defaultLegend') || 'Missing translation!!!';
  }
});

Template.PriceLine.helpers({
  webClass: function() {
    return "price-line row";
  },
  lineId: function() {
    return (this.id || s.dasherize(this.field));
  },
  linePriceClass: function() {
    return  (this.priceClass || 'price-default');
  },
  price: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    if (!negotiation) return null;
    var currency = negotiation.currency;
    if (!currency) {
      var button = OfferJar.UI.currentButton.get();
      if (!button) return null;
      currency = button.currency;
    }
    var price = negotiation[this.field];
    return new Money(price,OfferJar.UI.findOrAddCurrency(currency));
  },
});

Template.PriceLine.hooks({
  created: function() {
    this.defaultLegend = s.humanize(this.field);
  }
});

Template.NegotiationDialog.hooks({
  rendered: function() {
    var template = this;
    this.autorun(function() {
      var negotiation = OfferJar.UI.currentNegotiation.get();
    
      if (!negotiation) {
        template.$(".price-line").not('#final-price').addClass('invisible');
      } else {
        template.$(".price-line").not('#original-price').each(function() {
          var $this = $(this);
          var fld = s.camelize($this.prop('id'));
          if (negotiation&&negotiation[fld]&&negotiation[fld]>0.01) {
            $this.removeClass('invisible');
          } else {
            $this.addClass('invisible');
          }
        });
      }
    })
  }
});

Template.PriceLine.copyAs(["RetailPriceLine", "PriceLineCallOut"]);

Template.RetailPriceLine.helpers({
  lineLegend: function() {
    return OfferJar.UI.tr('buy_offer_legend','buy')
  },
  linePriceClass: function() { return "price-important" },
  lineId: function() { return "original-price"; },
  price: function() {
    var button = OfferJar.UI.currentButton.get();
    if (_.isObject(button)) {
      return new Money(button.offer,OfferJar.UI.findOrAddCurrency(button.currency));
    } else {
      return null;
    }
  }
});

Template.PriceLineCallOut.hooks({
  rendered: function() {
    var tempInst = this;
    var field = this.data.field;
    this.autorun(function() {
      var nego = OfferJar.UI.currentNegotiation.get();
      if (nego[field] !== tempInst.oldPrice) {
        tempInst.$('.price').velocity('callout.oj_flash',{
          duration: 3000,                                                      
          delay: 500,
          drag: true,
          stagger: 1600,
          backwards: true
        });
        tempInst.oldPrice = nego[field];
      }
    });
  }
});

Template.NegotiationButton.helpers({
  attrs: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    var tempInstance = Template.instance();
    var buttonStyle = tempInstance.get('buttonStyle') || 'primary';
    attr = {
      class: tempInstance.get('transition') + " btn btn-" + buttonStyle + (tempInstance.get('class') ? " " + tempInstance.get('class') : ""),
    };
    if (negotiation.isWaiting || !negotiation.canTransition(Meteor.userId(),tempInstance.get('transition'))) {
      if (tempInstance.get('unavailableClass')) {
        attr.class += (" " + tempInstance.unavailableClass);
      }
      attr.disabled = true;
    }
    attr.id = tempInstance.id || tempInstance.get('transition');
    if (tempInstance.get("buttonType")) {
      attr.type = tempInstance.get('buttonType');
    }
    return attr;
  }
});

Template.NegotiationButton.events({
  'click button': function(event,template) {
    if (template.alternativeHandler) return true;
    event.preventDefault();
    
    var negotiation = OfferJar.UI.currentNegotiation.get();
    if (negotiation) {
      negotiation.remoteTransition(template.transition,{},function(error,result) {
        if (_.has(template,'postTransitionCallback')) {
          template.postTransitionCallback(error,result);
        } else if (error) {
          throw error;
        }
      });
    }
    return true;
  }
});

Template.NegotiationButton.copyAs(["NegotiationCheckoutButton","NegotiationAcceptOfferButton","NegotiationSubmitOfferButton"]);

Template.NegotiationAcceptOfferButton.hooks({
  created: function() {
    this.transition = 'accept_other_bid';
    this.unavailableClass = 'hidden';
    this.defaultKey = this.transition;
    this.defaultLegend = s.humanize(this.transition);
    this.data.legendKey = this.transition;
  }
});

Template.NegotiationCheckoutButton.hooks({
  created: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    this.transition = 'checkout';
    this.buttonStyle = 'success';
    this.legend = negotiation && negotiation.successData && negotiation.successData[1] || 'Checkout';
    this.unavailableClass = 'hidden';
    this.defaultKey = this.transition;
    this.defaultLegend = s.humanize(this.transition);
    this.checkoutUrl = negotiation.successData[0];
    this.postTransitionCallback = function(error,result) {
      if (error) {
        throw error;
      }
      window.top.location.href = this.checkoutUrl;
    };
  }
});

Template.NegotiationSubmitOfferButton.helpers({
  attrs: function() {
    attr = {
      class: "btn btn-success",
      type: 'submit',
      id: 'submit-bid'
    };
    return attr;
  }
});


Template.NegotiationSubmitOfferButton.hooks({
  created: function() {
    this.defaultKey = 'submit';
    this.data.legendKey = 'submit';
    this.defaultLegend = 'Submit';
    this.alternativeHandler = true;
  }
});

Template.NegotiationLatestMessage.helpers({
  attrs: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    var waiting = !negotiation || negotiation.isWaiting;
    var att = {
      id: waiting ? "waiting-for-response" : "latest-message",
      class: waiting ? "row alert alert-info loading" : "well well-sm"
    }
    
    if (waiting) {
      att.role = "alert";
    }
    return att;
  },
  showSpin: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    return !negotiation || negotiation.isWaiting;
  },
  messageAvailable: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    return negotiation && (negotiation.isWaiting || negotiation.lastMessage());
  },
  messageHtml: function() {
    var negotiation = OfferJar.UI.currentNegotiation.get();
    
    if (negotiation) {
      if (negotiation.isWaiting) {
        return OfferJar.UI.tr(negotiation.currentState(),'buy');
      } else {
        var lastMessage = negotiation.lastMessage();
        if (!lastMessage) return undefined;
        return OfferJar.UI.messageHTML(lastMessage);
      }
    } else {
      return undefined;
    }
  },
  spinnerHtml: function() {
    return "<div class='message-spinner'></div>";
  }
});

Template.NegotiationAcceptOfferExtra.helpers({
  canAcceptOffer: function() {
    var nego = OfferJar.UI.currentNegotiation.get();
    return nego ? nego.canTransition(Meteor.userId(),'accept_other_bid') : false;
  }
});

Template.NegotiationAcceptOfferExtra.hooks({
  rendered: function() {
    this.animIntervalId = Meteor.setInterval(function() {
      this.$(".animate.glyphicon").velocity("callout.oj_animate_arrow");
    }, 1000);
  },
  destroyed: function() {
    Meteor.clearInterval(this.animIntervalId);
  }
});

Template.NegotiationAcceptOfferExtra.events({
  'click a': function(event,template) {
    var $anchor = $(event.target);
    var href = $anchor.attr('href');
    var $target = $(href);
    $target.velocity("scroll", {duration: 500});
    Meteor.clearInterval(template.animIntervalId);
    return false;
  }
});

