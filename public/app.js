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

            if (index <= 0) {
                index = 0;
                canMovePrev = false;
            }
            if (index >= indexSup) {
                index = indexSup;
                canMoveNext = false;
            }

            this.prevIndex = this.index;
            $timeout(function() { $scope.index = index; }, 0);
            this.canMoveNext = canMoveNext;
            this.canMovePrev = canMovePrev;
        };

        // Slide sketch visibility
        $scope.sketch = false;

        $http.get('/data/list.json').success(function(data) {
            $scope.data = data;
            $scope.setIndex(0);
        });
    }]);