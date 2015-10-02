import ajax from 'ic-ajax';
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    // var aboutToExpireIngradients =
  },

  model: function(params) {
    var appId = 'c9e9f00b';
    var key = '67a44b3aebc4aaec7faf77561e3c6d34';
    var path = 'https://api.edamam.com/search';
    var query = params.name;
    var to = 10;

    return ajax.request({url: '%@?q=%@&app_id=%@&app_key=%@'.fmt(path, query, appId, key, to), type: 'get', dataType: "jsonp"}).then(function(res) {
      // return res.hits.map(r => r.recipe);
      var recipes = res.hits.map(function(r) {

        return r.recipe;
      });

      recipes.name = params.name;
      return recipes;
    });
  }
});
