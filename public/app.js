angular.module('app', ['ngAnimate'])
    .controller('Page1Controller', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

        var nextIsVisible = true;

        $scope.moveNext = function() {
            $scope.setIndex($scope.index + 1);
            $scope.moveDirection = '';
        };

        $scope.movePrev = function() {
            $scope.setIndex($scope.index - 1);
            $scope.moveDirection = 'up';
        };

        $scope.setIndex = function(index) {
            var indexSup = $scope.data.length - 1;
            var canMoveNext = true;
            var canMovePrev = true;

            if (index <= 0) {
                index = 0;
                canMovePrev = false;
            }
            if (index >= indexSup) {
                index = indexSup;
                canMoveNext = false;
            }

            this.prevIndex = this.index === undefined ? index : this.index;

            // TODO replace with img.onload
            $timeout(function() {
                nextIsVisible = false;
                $scope.index = index;
                $scope.moveCount += 1;
                $scope.canMoveNext = canMoveNext;
                $scope.canMovePrev = canMovePrev;
            }, 100);
        };

        $scope.canShowNext = function() {
            if (!nextIsVisible) {
                $timeout(function() {
                    nextIsVisible = true;
                }, 0);
            }
            return nextIsVisible;
        };

        $http.get('/data/list.json').success(function(data) {
            $scope.data = data;
            $scope.moveCount = -1;
            $scope.setIndex(0);
        });
    }]);