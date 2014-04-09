angular.module('app',[])
    .controller('Page1Controller', ['$scope', '$http', function($scope, $http) {
        $http.get('/data/list.json').success(function(data) {
            $scope.data = data;
        });
        $scope.index = 0;
    }]);