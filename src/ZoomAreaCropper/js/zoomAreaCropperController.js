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
        $scope.timestamp = Date.now();
        $scope.isMouseDown = false;
        $scope.isMouseOverFocus = false;
        $scope.focusElem = false;
        $scope.focusPos = {
            x: 290,
            y: 190
        };
        $scope.mousePos = {
            x: 0,
            y: 0
        };
        $scope.dimensions = {
            width: 0,
            height: 0
        }
        $scope.selectedCrop = -1;
        $scope.showHandle = false;
        window.addEventListener('mouseup', $scope.mouseUp);
        console.info('$scope.model: ', $scope.model);
        console.info('$scope.model.value: ', $scope.model.value);
        $scope.model.value = $scope.getPropertyValue();
        setTimeout(function() {
            var img = document.getElementById('zac-' + $scope.timestamp);
            $scope.dimensions = {
                width: img.offsetWidth,
                height: img.offsetHeight
            }
        }, 1000);
    };

	// Event Handler Methods /////////////////////////////////////////////////////

    $scope.addCrop = function() {
        var newCrop = {
            x: Math.floor($scope.model.value.media.width / 2) - Math.floor($scope.model.config.width / 2),
            y: Math.floor($scope.model.value.media.height / 2) - Math.floor($scope.model.config.height / 2),
            width: $scope.model.config.width,
            height: $scope.model.config.height,
            zoom: 1
        };
        if ($scope.model.value.crops) {
            $scope.model.value.crops.push(newCrop);
        } else {
            $scope.model.value.crops = [newCrop];
        }
        $scope.switchCrop($scope.model.value.crops.length - 1);
    };

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
    };

    $scope.mouseDown = function(e) {
        $scope.mousePos = {
            x: e.clientX,
            y: e.clientY
        };
        window.addEventListener('mousemove', $scope.mouseMove);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    };

    $scope.mouseMove = function(e) {
        e.preventDefault();
        var diff = {
            x: e.clientX - $scope.mousePos.x,
            y: e.clientY - $scope.mousePos.y
        }
        $scope.mousePos = {
            x: e.clientX,
            y: e.clientY
        }
        $scope.focusPos = {
            x: $scope.focusPos.x + diff.x,
            y: $scope.focusPos.y + diff.y
        };
        $scope.calcCropFromFocus($scope.focusPos);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    };

    $scope.mouseUp  = function(e) {
        $scope.isMouseDown = false;
        window.removeEventListener('mousemove', $scope.mouseMove);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

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

    $scope.calcCropFromFocus = function(focus) {
         var percent = {
            x: focus.x / $scope.dimensions.width,
            y: focus.y / $scope.dimensions.height
        };

        var center = {
            x: Math.floor(percent.x * $scope.model.value.media.width),
            y: Math.floor(percent.y * $scope.model.value.media.height)
        };

        var crop = $scope.model.value.crops[$scope.selectedCrop];

        var newPos = {
            x: center.x - Math.floor(crop.width / 2),
            y: center.y - Math.floor(crop.height / 2)
        };

        if (newPos.x < 0) {
            newPos.x = 0;
        }
        if (newPos.y < 0) {
            newPos.y = 0;
        }

        crop.x = newPos.x;
        crop.y = newPos.y;

        $scope.model.value.crops[$scope.selectedCrop] = crop;
    };

    $scope.calcFocusFromCrop = function(crop) {
        var center = {
            x: crop.x + Math.floor(crop.width / 2),
            y: crop.y + Math.floor(crop.height / 2)
        };
        var percent = {
            x: center.x / $scope.model.value.media.width,
            y: center.y / $scope.model.value.media.height
        };
        var newPos = {
            x: Math.floor($scope.dimensions.width * percent.x),
            y: Math.floor($scope.dimensions.height * percent.y)
        };
        $scope.focusPos = newPos;
    };

    $scope.cropSrc = function(index) {
        var url =$scope.model.value.media.url;
        var crop = $scope.model.value.crops[index];
        if (!crop.zoom) { 
            crop.zoom = 1;
        }
        url = url + "?crop=" + crop.x + "," + crop.y + "," + Math.ceil(crop.width / crop.zoom) + "," + Math.ceil(crop.height / crop.zoom);
        url = url + "&width=" + crop.width + "&height=" + crop.height;
        return url;
    }

    $scope.cropThumbStyle = function(index) {
        var style = {};
        if ($scope.selectedCrop == index) {
            style = {
                "border": "solid 2px rgba(0,0,0,0.3)"
            };
        }
        return style;
    };

    $scope.currentZoom = function() {
        var crop = $scope.model.value.crops[$scope.selectedCrop];
        if (!crop.zoom) {
            crop.zoom = 1;
        }
        return crop.zoom;
    };

    $scope.focusPosStyle = function() {
        var style = {
            "top": $scope.focusPos.y + "px",
            "left": $scope.focusPos.x + "px"
        }
        return style;
    };

    /**
    * @method getPropertyValue
    * @returns {Object}
    * @description If the $scope.model.value already exists, return it. Otherwise, 
    * create a new, default model.
    */
    $scope.getPropertyValue = function() {
        var value = {
            crops: [],
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

    $scope.switchCrop = function(index) {
        $scope.showHandle = true;
        $scope.selectedCrop = index;
        var crop = $scope.model.value.crops[index];
        $scope.calcFocusFromCrop(crop);
    };
    
	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
