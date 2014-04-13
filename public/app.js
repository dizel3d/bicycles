angular.module('app', ['ngAnimate'])

    .directive('slideViewer', function() {
        return {
            templateUrl: 'templates/slide-viewer.html',

            scope: {
                navigatorFlip: '=', // navigator horizontal or vertical orientation
                navigatorLoop: '=', // loop navigator slider moving
                sketchShow: '=', // slide sketch visibility
                current: '=', // current slide index
                slides: '=', // slide array
                context: '=' // slide context
            },

            controller: ['$scope', '$timeout', function($scope, $timeout) {
                var setIndex = function(index) {
                    if (!$scope.slides || isNaN(index)) {
                        return;
                    }

                    var indexSup = $scope.slides.length - 1;
                    var canMoveNext = true;
                    var canMovePrev = true;

                    if ($scope.navigatorLoop) {
                        if (index < 0) {
                            index = indexSup;
                        }
                        if (index > indexSup) {
                            index = 0;
                        }
                    } else {
                        if (index <= 0) {
                            index = 0;
                            canMovePrev = false;
                        }
                        if (index >= indexSup) {
                            index = indexSup;
                            canMoveNext = false;
                        }
                    }

                    $scope.prevIndex = $scope.index;
                    $timeout(function() { $scope.index = index; }, 0);
                    $scope.canMoveNext = canMoveNext;
                    $scope.canMovePrev = canMovePrev;
                };

                $scope.moveNext = function() {
                    setIndex($scope.index + 1);
                };

                $scope.movePrev = function() {
                    setIndex($scope.index - 1);
                };

                // TODO change slide on arrow keys down
                $scope.onKeyDown = function(e) {
                    switch (e.keyCode) {
                        case 37:
                        case 38:
                            $scope.movePrev();
                            break;
                        case 39:
                        case 40:
                            $scope.moveNext();
                            break;
                    }
                };

                $scope.$watch('current', function(value) {
                    setIndex(value);
                });

                $scope.$watch('slides', function() {
                    setIndex($scope.current || 0);
                });
            }]
        };
    })

    .directive('slideInfo', function() {
        return {
            templateUrl: 'templates/slide-info.html',
            transclude: true,
            controller: ['$scope', function($scope) {
                $scope.showInfo = true;
            }]
        };
    })

    .controller('AppController', ['$scope', '$http', function($scope, $http) {
        $scope.showSketch = false;

        $http.get('/data/list.json').success(function(data) {
            $scope.main = {
                slides: data.main,
                current: 1,
                context: {
                    showDetails: function(index) {
                        $scope.details.current = index;
                        $scope.details.isVisible = true;
                    }
                }
            };
            $scope.details = {
                slides: data.details,
                current: 0,
                isVisible: false
            };
        });
    }]);