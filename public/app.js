angular.module('app', ['ngAnimate'])

    /*.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })*/

    .filter('money', function() {
        var symbol = ' руб.';

        return function(value) {
            var str = value.toString();
            var headCount = str.length % 3;
            var head = str.substr(0, headCount);
            var tail = str.substr(headCount, str.length - headCount).match(/(\d{3})/g);

            if (!tail) return head + symbol;
            return head + (head.length > 1 ? ' ' : '') + tail.join(' ') + symbol;
        };
    })

    .filter('decimal', function() {
        return function(value) {
            return value.toString().replace('.', ',');
        };
    })

    .directive('slideViewer', function() {
        return {
            templateUrl: 'templates/slide-viewer.html',

            scope: {
                navigatorFlip: '=', // navigator horizontal or vertical orientation
                navigatorLoop: '=', // loop navigator slider moving
                sketchShow: '=', // slide sketch visibility
                current: '=', // current slide index
                slides: '=', // slide array
                context: '=', // slide context
                hideCloseButton: '=', // close button visibility
                close: '&onClose' // close button click event
            },

            controller: ['$scope', '$timeout', function($scope, $timeout) {
                var lastAppliedIndex;

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
                    $scope.current = index;
                    lastAppliedIndex = index;

                    return index;
                };

                var setIndexQuickly = function(value) {
                    if (lastAppliedIndex !== value) {
                        $scope.index = setIndex(value);
                        $scope.prevIndex = undefined;
                    }
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

                $scope.$watch('current', setIndexQuickly);

                $scope.$watch('slides', function() {
                    setIndexQuickly($scope.current || 0);
                });
            }]
        };
    })

    .directive('slideInfo', function() {
        return {
            templateUrl: 'templates/slide-info.html',
            replace: true,
            transclude: true,
            controller: ['$scope', function($scope) {
                $scope.showInfo = true;
            }]
        };
    })

    .controller('BikesController', ['$scope', '$http', function($scope, $http) {
        $http.get('/data/bikes.json').success(function(data) {
            $scope.bikes = data;
        });
    }])

    .controller('AppController', ['$scope', '$http', function($scope, $http) {
        $scope.showSketch = true;

        $http.get('/data/slides.json').success(function(data) {
            $scope.main = {
                slides: data.main,
                current: 8,
                context: {
                    showDetails: function(index) {
                        $scope.detail.current = index;
                        $scope.detail.visible = true;
                    }
                }
            };
            $scope.detail = {
                slides: data.detail,
                current: 0,
                visible: false,
                close: function() {
                    $scope.detail.visible = false;
                }
            };
        });
    }]);