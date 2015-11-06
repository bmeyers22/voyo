angular.module('Voyo').run(['$ionicScrollDelegate', function ($ionicScrollDelegate) {
  (function() {
    'use strict'

    var Waypoint = window.Waypoint

    function IonicAdapter(element) {
      this.$element = $(element)
    }

    // Apply jquery methods first
    $.each([
      'innerHeight',
      'innerWidth',
      'offset',
      'off',
      'on',
      'outerHeight',
      'outerWidth'
    ], function(i, method) {
      IonicAdapter.prototype[method] = function() {
        var args = Array.prototype.slice.call(arguments)
        return this.$element[method].apply(this.$element, args)
      }
    });

    [
      {
        method: 'scrollTop',
        fn() {
          let scroller = $ionicScrollDelegate.$getByHandle(this.$element.attr('delegate-handle'));
          return scroller.getScrollPosition().top;
        }
      },
      {
        method: 'scrollLeft',
        fn() {
          let scroller = $ionicScrollDelegate.$getByHandle(this.$element.attr('delegate-handle'));
          return scroller.getScrollPosition().left;
        }
      }
    ].forEach( (obj) => {
      IonicAdapter.prototype[obj.method] = obj.fn
    });

    $.each([
      'extend',
      'inArray',
      'isEmptyObject'
    ], function(i, method) {
      IonicAdapter[method] = $[method]
    })

    Waypoint.adapters.push({
      name: 'ionic',
      Adapter: IonicAdapter
    })
    Waypoint.Adapter = IonicAdapter
  }())
}]);
