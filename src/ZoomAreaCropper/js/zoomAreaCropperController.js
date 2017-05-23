angular.module("umbraco").controller("zoom.area.cropper.controller", function($scope, dialogService) {

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
        console.info('$scope.model: ', $scope.model);
        console.info('$scope.model.value: ', $scope.model.value);
        $scope.model.value = $scope.getPropertyValue();
    };

	// Event Handler Methods /////////////////////////////////////////////////////

    /**
    * @method $scope.handleMediaPickerSelection
    * @param {Object} data - modal object returned by dialogService.mediaPicker().
    * @description Event handler triggered by a media picker dialog. If there is 
    * an image selected, updates the $scope.model.value with the image's 
    * information.
    */
    $scope.handleMediaPickerSelection = function(data) {
        if (data) {
			console.info("data from picker: ", data);
            if (data.id) {
                var media = {
                    altText: data.name,
                    height: data.originalHeight,
                    id: data.id,
                    url: data.image,
                    width: data.originalWidth
                };
				data.properties.forEach(function(property) {
					if (property.alias == "altText") {
						if (property.value != "") {
							media.altText = property.value;
						}
					}
				});
                $scope.model.value.media = media;
            }
        }
		console.info("media: ", media);
        console.info("$scope.model: ", $scope.model);
    };

    /**
    * @method openMediaPicker
    * @description Opens the media picker dialog, showing only images, and sends 
    * the data returned to $scope.handleMediaPickerSelection.
    */
    $scope.openMediaPicker = function() {
        var options = {
            onlyImages: true,
            callback: $scope.handleMediaPickerSelection
        };
        dialogService.mediaPicker(options);
    };

    /**
     * @method removeImage
     * @returns {void}
     * @description Removes the image.
     */
    $scope.removeImage = function() {
        $scope.model.value.media = {
            url: ""
        };
    }

	// Helper Methods ////////////////////////////////////////////////////////////

    /**
    * @method getPropertyValue
    * @returns {Object}
    * @description If the $scope.model.value already exists, return it. Otherwise, 
    * create a new, default model.
    */
    $scope.getPropertyValue = function() {
        var value = {
            media: {
                url: ""
            }
        };
        if ($scope.model) {
            if ($scope.model.value != undefined && $scope.model.value !== "") {
                value = $scope.model.value;
            }
        }
        return value;
    };

    /**
    * @method hasImageSelected
    * @returns {bool}
    * @description Returns true if there is a selected media image, otherwise returns false.
    */
    $scope.hasImageSelected = function() {
        var hasImageSelected = false;
        if (($scope.model && $scope.model.value)) {
            if ($scope.model.value.media && $scope.model.value.media.id && $scope.model.value.media.id != 0) {
                hasImageSelected = true;
            }
        }
        return hasImageSelected;
    };
    
	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
