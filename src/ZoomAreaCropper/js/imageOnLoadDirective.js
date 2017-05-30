(function(){
    angular.module('umbraco.directives').directive('zacimageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
                        scope.$apply(attrs.zacimageonload);
                    }
                });
            }
        };
    });
})();