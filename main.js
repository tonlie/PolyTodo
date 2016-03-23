(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // init
  app.statusKnown = false;
  app.items = [];
  app.ref = null;
  app.user = null;

  // crud functions
  app.updateItems = function(snapshot) {
    this.items = [];
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.uid = childSnapshot.key();
      this.push('items', item);
    }.bind(this));
  }

  app.addItem = function(event) {
    event.preventDefault(); // don't send the form!
    this.ref.push({
      done: false,
      text: app.newItemValue
    });
    this.newItemValue = '';
  };

  app.toggleItem = function(event) {
    this.ref.child(event.model.item.uid).
      update({done: event.model.item.done});
  };

  app.deleteItem = function(event) {
    this.ref.child(event.model.item.uid).remove();
  };

  // Firebase
  // app.firebaseURL = 'https://polytodo.firebaseio.com/';
  // app.firebaseProvider = 'google';

  document.addEventListener('loggedIn', function(e) {
    app.statusKnown = true;
    app.user = e.detail.user;
    app.ref = new Firebase(e.detail.url + '/user/' + e.detail.user.uid);
    app.ref.on('value', function(snapshot) {
      app.updateItems(snapshot);
    });
  });

  document.addEventListener('loggedOut', function() {
    app.statusKnown = false;
    app.ref = null;
    app.user = null;
    app.items = [];
  });
})(document);
