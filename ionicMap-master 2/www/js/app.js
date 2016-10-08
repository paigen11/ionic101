
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
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapController'
      }
    }
  })
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/home');
});

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, geoCode) {
  $scope.markerData = {};
  $ionicModal.fromTemplateUrl('templates/marker.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeMarker = function() {
    $scope.modal.hide();
  };

  $scope.makeMarker = function() {
    $scope.modal.show();
  };

  $scope.doCoords = function() {
    console.log("Looking up address", $scope.markerData);
    $timeout(function() {
      geoCode.getCoords($scope.markerData)
      $scope.closeMarker();
    }, 1000);
  };
});

app.service('googleMap', function() {
  var data ={};
  this.makeMarker = function(coords, map) {
    var marker = new google.maps.Marker({
          position: coords,
          map: map
    });
    return marker;
  };
});

app.service('geoCode', function() {
  this.getCoords = function(data) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': data.address}, function(results, status) {
      if (status == 'OK') {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng()
        console.log(latitude);
        console.log(longitude);
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  };
});

app.controller('MapController', function($scope, $state, $cordovaGeolocation, googleMap, $ionicLoading) {
  console.log("MainController is active");
  var coords = {};
  var positionOptions = {timeout: 10000, enableHighAccuracy: true};
  $ionicLoading.show();
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
    $ionicLoading.hide();
    var map = new google.maps.Map(mapElement, mapOptions);
    googleMap.makeMarker(coords, map);
  });
});
