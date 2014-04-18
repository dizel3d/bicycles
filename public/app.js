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
            replace: true,

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

                $scope.setIndex = setIndex;

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

    .directive('slideImage', function() {
        var originSize;
        var thisScope;

        var handleResize = function(size) {
            var percent = Math.max(size.w / originSize.w, size.h / originSize.h);

            var region = {
                width: originSize.w * percent,
                height: originSize.h * percent
            };
            angular.extend(region, {
                'margin-top': (size.h - region.height) / 2,
                'margin-left': (size.w - region.width) / 2
            });

            this.css(region);

            thisScope.$parent.slideImageRegion = region;
            setTimeout(function() { thisScope.$digest(); }, 0);
        };

        var setUpOriginSize = function(element) {
            if (!element.is(':visible')) return false;

            originSize = {
                w: element.width(),
                h: element.height()
            };

            var handleWindowResize = function() {
                handleResize.call(element, {
                    w: angular.element(window).width(),
                    h: angular.element(window).height()
                })
            };

            angular.element(window).on('resize', handleWindowResize);
            handleWindowResize();

            return true;
        };

        return {
            restrict: 'C',
            link: function(scope, element) {
                thisScope = scope;

                element.one('load', function() {
                    if (setUpOriginSize(element)) return;

                    var stopWatch = scope.$watch('$parent.current', function() {
                        if (setUpOriginSize(element)) stopWatch();
                    });
                });
            }
        };
    })

    .controller('BikesController', ['$scope', function($scope) {
        $scope.$watch('context.bikes', function(value) {
            $scope.bikes = value;
        })
    }])

    .controller('BikeController', ['$scope', function($scope) {
        $scope.$watch('context.bikes', function(bikes) {
            $scope.bike = bikes[$scope.$parent.$index];
        })
    }])

    .controller('AppController', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.showSketch = $location.path() === '/dev';

        $http.get('/data/slides.json').success(function(data) {
            // main slides
            $scope.main = {
                slides: data.main,
                current: 0,
                context: {
                    showDetails: function(index) {
                        angular.extend($scope.detail, {
                            current: index,
                            visible: true
                        });
                    },
                    showBike: function(index) {
                        angular.extend($scope.bike, {
                            current: index,
                            visible: true
                        });
                    }
                }
            };

            // detail slides
            $scope.detail = {
                slides: data.detail,
                current: 0,
                visible: false
            };

            // bike slide common info
            var bikeSlide = data.bike;

            $http.get('/data/bikes.json').success(function(bikes) {
                $scope.main.context.bikes = bikes;

                var slides = new Array(bikes.length);
                for (var i = 0; i < bikes.length; ++i) {
                    slides[i] = angular.extend({}, bikeSlide);
                }

                // bike slides
                $scope.bike = {
                    slides: slides,
                    current: 0,
                    visible: false,
                    context: {
                        bikes: bikes
                    }
                };
            });
        });
    }]);