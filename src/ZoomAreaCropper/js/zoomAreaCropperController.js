angular.module("umbraco").controller("zoom.area.cropper.controller", function($scope) {

	// Initialization Methods ////////////////////////////////////////////////////

	/**
	* @method init
	* @description Triggered on the controller loaded, kicks off any initialization functions.
	*/
	$scope.init = function() {
        $scope.setVariables();
	};

    /**
    * @method setVariables
    * @description Sets up the initial variables for the view.
    */
    $scope.setVariables = function() {
        $scope.model.value = $scope.getPropertyValue();
    };

	// Event Handler Methods /////////////////////////////////////////////////////

	// Helper Methods ////////////////////////////////////////////////////////////

    /**
    * @method getPropertyValue
    * @returns {Object}
    * @description If the $scope.model.value already exists, return it. Otherwise, 
    * create a new, default model.
    */
    $scope.getPropertyValue = function() {
        var value = {};
        if ($scope.model) {
            if ($scope.model.value != undefined) {
                value = $scope.model.value;
            }
        }
        return value;
    };

	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
