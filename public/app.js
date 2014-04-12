angular.module('app', ['ngAnimate'])

    .controller('ViewerController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        $scope.moveNext = function() {
            this.setIndex(this.index + 1);
        };

        $scope.movePrev = function() {
            this.setIndex(this.index - 1);
        };

        $scope.setIndex = function(index) {
            var indexSup = this.data.length - 1;
            var canMoveNext = true;
            var canMovePrev = true;

            if (this.loopNavigator) {
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

            this.prevIndex = this.index;
            $timeout(function() { $scope.index = index; }, 0);
            this.canMoveNext = canMoveNext;
            this.canMovePrev = canMovePrev;
        };

        // TODO change slide on arrow keys down
        $scope.onKeyDown = function(e) {
            switch (e.keyCode) {
                case 37:
                case 38:
                    this.movePrev();
                    break;
                case 39:
                case 40:
                    this.moveNext();
                    break;
            }
        };

        $scope.flipNavigator = true;
        $scope.loopNavigator = $scope.flipNavigator;

        // Slide sketch visibility
        $scope.sketch = false;

        $http.get('/data/list.json').success(function(data) {
            $scope.data = data;
            $scope.setIndex(0);
        });
    }]);