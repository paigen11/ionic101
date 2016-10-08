var app = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.map', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapController'
      }
    }
  })
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/search');
});

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

app.service('googleMap', function() {
  this.makeMarker = function(coords, map) {
    var marker = new google.maps.Marker({
          position: coords,
          map: map
    });
    return marker;
  };
});

app.service('geoCode', function() {
  this.getCoords = function() {
    // $localStorage.token = res.data.token;
    // $localStorage.token = res.data.user;
    // $localStorage.$reset();
    // user: $localStorage.user
  };
});

app.controller('MapController', function($scope, $state, $cordovaGeolocation, googleMap) {
  var coords = {};
  var positionOptions = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(positionOptions)
  .then(function(position) {
    coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var mapElement = document.getElementById('map');
    var mapOptions = {
      center: coords,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapElement, mapOptions);
    $scope.map = map;
    googleMap.makeMarker(coords, map);
  });
});