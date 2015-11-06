var app = function () {
  
  // https://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
  Backbone.View.prototype.close = function(){
    this.remove();
    this.unbind();
    if (this.onClose){
      this.onClose();
    }
  }


  //MODELS
  var Address = Backbone.Model.extend();
  // - email
  // - status: "new|failed|done"
  // - apiKey
  // - channel

  //COLLECTIONS
  var Addresses = Backbone.Collection.extend({
    model: Address,
  });
  
  //VIEWS
  var AddressView = Backbone.View.extend({
    // creates a new <li class="list-group-item"> dom element
    tagName: 'li',
    className: 'list-group-item',
    //template: Handlebars.compile($("#address-template").html()),
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },
    render: function() {
      var statusClasses = "list-group-item-success list-group-item-info list-group-item-warning list-group-item-danger"
      s = this.model.get("status");
      if (s == "done") {
        this.$el.removeClass(statusClasses).addClass("list-group-item-success");
      } else if (s == "failed") {
        this.$el.removeClass(statusClasses).addClass("list-group-item-danger");
      } else {
        this.$el.removeClass(statusClasses);
      }
      this.$el.html(this.model.get("email") + '<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>' + this.model.get("channel"));
      return this; 
    }
  });

  var AddressList = Backbone.View.extend({
    el: '#progress',  // bind to the existing DOM element
    events: {
      // delete button
    },
    initialize: function() {
      this.childViews = [];  // must keep track of child views for cleanup
      this.listenTo(this.collection, "update", this.render);
      //this.listenTo(this.collection, "remove", this.remove);
    },
    render: function() {
      _.invoke(this.childViews, "close");
      this.collection.each(function(address) {
        addressView = new AddressView({model: address});
        this.$('#address-list').append(addressView.render().el);
        this.childViews.push(addressView);
      }, this);
    },
    addNew: function(apiKey, channel, emails) {
      if (channel.slice(0, 1) == '#') {
        channel = channel.slice(1);
      }
      var newEmails = [];
      _.invoke(emails, "trim");
      emails = _.uniq(emails);
      _.each(emails, function(email) {
        if (email != '' && !this.collection.findWhere({email: email})) {
          // don't add duplicates
          newEmails.push(new Address({
            email: email,
            "status": "new",
            channel: channel,
            apiKey: apiKey
          }));
        }
      }, this);
      this.collection.add(newEmails);
    },
    invite: function() {
      slack.clearCache(); // clear cache so new registering users will get picked up
      this.collection.each(function(addr) {
        if (addr.get("status") != "done") {
          // skip already added users
          slack.getUserByEmail(addr.get("email"), addr.get("apiKey")).then(function(userID) {
            if (userID === undefined) {
              // unknown user
              addr.set({"status": "failed"});
            } else {
              slack.getGroupByName(addr.get("channel"), addr.get("apiKey")).then(function(groupID) {
                slack.addUserToGroup(userID.id, groupID.id, addr.get("apiKey")).then(function(success) {
                  if (success) {
                    addr.set({"status": "done"});
                  } else {
                    addr.set({"status": "failed"});
                  }

                });
              });
            }
          });
        }
      });
    }
  });


  var init = function appInit() {
    addresses = new Addresses();
    var mainView = new AddressList({collection: addresses});
    this.collections.addresses = addresses;
    this.views.main = mainView;
    console.log("app started");
  };

  
  var add = function add(apiKey, channel, emails) {
    this.views.main.addNew(apiKey, channel, emails);
  };

  var invite = function() {
    this.views.main.invite();
  }

  return {
    init: init,
    add: add,
    invite: invite,
    collections: {},
    views: {}
  }
}();
