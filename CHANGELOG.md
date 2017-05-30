# Change Log

## v1.0.3

### Fixed

* Added directive to listen for end of loading of main image so that the proper 
calculations for showing previews and positioning the focus handler can be properly
done when dealing with slow load times (especially on larger images). Solves 
issues [#2](https://github.com/Offroadcode/Zoom-Area-Cropper/issues/2) and [#3](https://github.com/Offroadcode/Zoom-Area-Cropper/issues/3).
* Added '?width=600' to main image preview url so that larger images don't need 
to be sent down to client only to be resized by browser.

## v1.0.2

### Added

* The height and width prevalues are now required, preventing a developer from 
setting up an editor with no configured values for those fields.

## v1.0.1

### Fixed

* Fixed issue where failing to save and reload editor page after selecting image 
would cause crop previews to show incorrectly due to incorrect image dimension 
assumptions.

## v1.0.0

### Added

* Added CHANGELOG.md.

### Changed

* Ensured correct staff for Offroadcode on meta.json.

## v1.0.0-rc2

### Changed

* Improved JSdoc commenting on controller file.
* Improved documentation on Readme.

### Fixed

* Fixed Property Value Converter.
* Fixed issue with Gruntfile not properly copying DLL.

### Removed

* Removed console statements from controller.
