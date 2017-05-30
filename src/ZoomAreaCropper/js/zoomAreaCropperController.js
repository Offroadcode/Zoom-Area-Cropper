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
            x: 0,
            y: 0
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
        $scope.showCrops = false;
        $scope.showHandle = false;
        $scope.viewMode = "main";
        window.addEventListener('mouseup', $scope.mouseUp);
        $scope.model.value = $scope.getPropertyValue();
        /*if ($scope.model.value.media.url !== "") {
            $scope.setImageDimensions();
        }*/
    };

	// Event Handler Methods /////////////////////////////////////////////////////

    /**
     * @method addCrop
     * @returns {void}
     * @description Creates a new crop.
     */
    $scope.addCrop = function() {
        $scope.viewMode = 'main';
        var value = $scope.model.value;
        var configHeight = Number($scope.model.config.height);
        var configWidth = Number($scope.model.config.width);
        var newCrop = {
            x: Math.floor(value.media.width / 2) - Math.floor(configWidth / 2),
            y: Math.floor(value.media.height / 2) - Math.floor(configHeight / 2),
            width: configWidth,
            height: configHeight,
            url: "",
            name: "Crop " + (value.crops.length + 1),
            zoom: 1
        };
        if (value.crops) {
            value.crops.push(newCrop);
        } else {
            value.crops = [newCrop];
        }
        $scope.model.value = value;
        $scope.switchCrop(value.crops.length - 1);
    };

    /**
     * @method changeMode
     * @param {string} mode - 'main' or 'crop'
     * @returns {void}
     * @description Changes the view mode between the crop or main views.
     */
    $scope.changeMode = function(mode) {
        $scope.viewMode = mode;
    };

    /**
     * @method deleteSelectedCrop
     * @returns {void}
     * @description Deletes the currently selected crop.
     */
    $scope.deleteSelectedCrop = function() {
        $scope.model.value.crops.splice($scope.selectedCrop, 1);
        $scope.selectedCrop = -1;
        $scope.showHandle = false;
        $scope.viewMode = "main";
    }

    /**
    * @method $scope.handleMediaPickerSelection
    * @param {Object} data - modal object returned by dialogService.mediaPicker().
    * @description Event handler triggered by a media picker dialog. If there is 
    * an image selected, updates the $scope.model.value with the image's 
    * information.
    */
    $scope.handleMediaPickerSelection = function(data) {
        if (data) {
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
                /*$scope.setImageDimensions();*/
            }
        }
    };

    /**
     * @method mouseDown
     * @param {Event} e
     * @returns {void}
     * @description Event handler for when the mouse was clicked down on the 
     * focus handle.
     */
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

    /**
     * @method mouseMove
     * @param {Event} e
     * @returns {void}
     * @description Event handler for when the mouse is moved across the viewport, 
     * to move the focus handle.
     */
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
        $scope.updateCropUrl();
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    };

    /**
     * @method mouseUp
     * @param {Event} e
     * @returns {void}
     * @description Event handler for when the moues is released to stop dragging 
     * the focus handle.
     */
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
        $scope.model.value.crops = [];
        $scope.showHandle = false;
        $scope.showCrops = false;
    }

    /**
     * @method updateCropCoord
     * @returns {void}
     * @description Update the currently selected crop's coordinates based on 
     * the focus handle, and then update the url.
     */
    $scope.updateCropCoord = function() {
        $scope.calcCropFromFocus($scope.focusPos);
        $scope.updateCropUrl();
    };

	// Helper Methods ////////////////////////////////////////////////////////////

    /**
     * @method calcCropFromFocus
     * @param {Object} focus
     * @returns {void}
     * @description Calculates and updates current crop's positional data based 
     * on the current position of the focus handle.
     */
    $scope.calcCropFromFocus = function(focus) {

        // 1. Determine the focus point's relative position by percentage.
         var percent = {
            x: focus.x / $scope.dimensions.width,
            y: focus.y / $scope.dimensions.height
        };

        // 2. Calculate its actual position on the full sized image. This is the 
        // center of the crop.
        var center = {
            x: Math.floor(percent.x * $scope.model.value.media.width),
            y: Math.floor(percent.y * $scope.model.value.media.height)
        };

        var crop = $scope.model.value.crops[$scope.selectedCrop];

        // 3. Get the crop's source width and height by dividing the output 
        // width and height by the zoom.

        var sourceDimensions = {
            width: Math.ceil(crop.width / crop.zoom),
            height: Math.ceil(crop.height / crop.zoom)
        };

        // 4. Subtract half of the crop souce width/height from the crop's 
        // center to get the crop's corner. This is the crop x/y.
        var cropCorner = {
            x: center.x - Math.floor(sourceDimensions.width / 2),
            y: center.y - Math.floor(sourceDimensions.height / 2)
        };

        crop.x = cropCorner.x;
        crop.y = cropCorner.y;

        $scope.model.value.crops[$scope.selectedCrop] = crop;
    };

    /**
     * @method calcFocusFromCrop
     * @param {Object} focus
     * @returns {void}
     * @description Calculates and updates the focus handle's positional data based 
     * on the current position of the focus handle.
     */
    $scope.calcFocusFromCrop = function(crop) {

        var sourceDimensions = {
            width: Math.ceil(crop.width / crop.zoom),
            height: Math.ceil(crop.height / crop.zoom)
        };

        var cropCenter = {
            x: crop.x + Math.floor(sourceDimensions.width / 2),
            y: crop.y + Math.floor(sourceDimensions.height / 2)
        };

        var percent = {
            x: cropCenter.x / $scope.model.value.media.width,
            y: cropCenter.y / $scope.model.value.media.height
        };

        var newPos = {
            x: Math.floor($scope.dimensions.width * percent.x),
            y: Math.floor($scope.dimensions.height * percent.y)
        };
        
        $scope.focusPos = newPos;
    };

    /**
     * @method cropSrc
     * @param {number} index
     * @returns {string}
     * @description Build the crop's url for the image src, and return it.
     */
    $scope.cropSrc = function(index) {
        var url = $scope.model.value.media.url;
        var crop = JSON.parse(JSON.stringify($scope.model.value.crops[index]));
        if (!crop.zoom) { 
            crop.zoom = 1;
        }
        // We can't start a crop beyond it's topmost or leftmost section.
        if (crop.x < 0) {
            crop.x = 0;
        }
        if (crop.y < 0) {
            crop.y = 0;
        }
        url = url + "?crop=" + crop.x + "," + crop.y + "," + Math.ceil(crop.width / crop.zoom) + "," + Math.ceil(crop.height / crop.zoom);
        url = url + "&width=" + crop.width + "&height=" + crop.height;
        return url;
    };

    /**
     * @method cropThumbStyle
     * @param {number} index
     * @returns {Object}
     * @description Return style data for the indicated crop.
     */
    $scope.cropThumbStyle = function(index) {
        var style = {};
        if ($scope.selectedCrop == index) {
            style = {
                "border": "solid 2px rgba(0,0,0,0.3)"
            };
        }
        return style;
    };

    /**
     * @method currentZoom
     * @returns {number}
     * @description Return the current zoom rating on the currently selected crop.
     */
    $scope.currentZoom = function() {
        var crop = $scope.model.value.crops[$scope.selectedCrop];
        if (!crop.zoom) {
            crop.zoom = 1;
        }
        return crop.zoom;
    };

    /**
     * @method focusPosStyle
     * @returns {Object}
     * @description Return style data to position the focus handle.
     */
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

    /**
     * @method setImageDimensions
     * @returns {void}
     * @description Waits one second for image dimensions to be set and then uses 
     * those to determine the focus position.
     */
    $scope.setImageDimensions = function() {
        var img = document.getElementById('zac-' + $scope.timestamp);
        $scope.dimensions = {
            width: img.offsetWidth,
            height: img.offsetHeight
        }
        $scope.focusPos = {
            x: Math.ceil($scope.dimensions.width / 2),
            y: Math.ceil($scope.dimensions.height / 2)
        };
        $scope.showCrops = true;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    /**
     * @method switchCrop
     * @param {number} index
     * @returns {void}
     * @description Switch the selected crop to the indicated index and perform
     * needed operations to show its details.
     */
    $scope.switchCrop = function(index) {
        $scope.showHandle = true;
        $scope.selectedCrop = index;
        var crop = $scope.model.value.crops[index];
        $scope.calcFocusFromCrop(crop);
        $scope.updateCropUrl();
    }; 

    /**
     * @method updateCropUrl
     * @returns {void}
     * @description Update the currently selected crop's image url with the new 
     * positioning data.
     */
    $scope.updateCropUrl = function() {
        var crop = $scope.model.value.crops[$scope.selectedCrop];
        var url = $scope.cropSrc($scope.selectedCrop);
        crop.url = url;
        $scope.model.value.crops[$scope.selectedCrop] = crop;
    };
    
	// Call $scope.init() ////////////////////////////////////////////////////////

	$scope.init();

});
