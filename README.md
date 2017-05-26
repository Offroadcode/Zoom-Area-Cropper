# Zoom-Area-Cropper &middot; ![version](https://img.shields.io/badge/version-1.0.1-green.svg) [![our umbraco](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/website-utilities/text-over-image-editor/)

A custom property editor for Umbraco that allows the editor to select multiple cropping areas with different zooms for an image.

![example](https://github.com/Offroadcode/Zoom-Area-Cropper/blob/master/assets/zoomAreaCropper.gif)

## Installation & Use

You can install the selected release through the Umbraco package installer or [download and install locally from Our](https://our.umbraco.org/projects/website-utilities/zoom-area-cropper/).

After installing the package, create a new DataType and select "Zoom Area Cropper" from the property editor dropdown. Set the width and height you want your crops to output to in the DataType, and then add it to a DocType of your choice.

Once installed, in the editor for a page with the cropper you can select an image, and then add one or more crop points for it. Each crop point has its focus determined by the focus handle, has a name you can change, and then has a zoom level that you can adjust independent of other crops after selecting "preview crop". (See gif above for example of what this looks like).

[Here's a simple example of making use of Zoom Area Cropper in your view](https://gist.github.com/naepalm/ef62771d72af15b9f337307eec01b4d1).

**Note:** Super large images work with the cropper but can sometimes take several seconds in such cases for the preview crops to update as ImageProcessor works through the bigger images. More typical sized media are more speedy with the previews.

## Questions?

If you have questions, feel free to ask them [here](https://github.com/Offroadcode/Zoom-Area-Cropper/issues).

## Contribute

Want to contribute to the Zoom Area Cropper package? You'll want to use Grunt (our task runner) to help you integrate with a local copy of Umbraco.

### Install Dependencies
*Requires Node.js to be installed and in your system path*

    npm install -g grunt-cli && npm install -g grunt
    npm install

### Build

    grunt

Builds the project to /dist/. These files can be dropped into an Umbraco 7 site, or you can build directly to a site using:

    grunt --target="D:\inetpub\mysite"

You can also watch for changes using:

    grunt watch
    grunt watch --target="D:\inetpub\mysite"

If you want to build the package file (into a pkg folder), use:

    grunt umbraco
