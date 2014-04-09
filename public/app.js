angular.module('app',[])
    .controller('Page1Controller', ['$scope', '$http', function($scope, $http) {

        $scope.moveNext = function() {
            $scope.setIndex($scope.index + 1);
        };

        $scope.movePrev = function() {
            $scope.setIndex($scope.index - 1);
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

            this.index = index;
            this.canMoveNext = canMoveNext;
            this.canMovePrev = canMovePrev;
        };

        $http.get('/data/list.json').success(function(data) {
            $scope.data = data;
            $scope.setIndex(0);
        });
    }]);