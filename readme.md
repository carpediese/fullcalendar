
FullCalendar - Full-sized drag & drop event calendar
====================================================

This document describes how to modify or contribute to the FullCalendar project. If you are looking for end-developer documentation, please visit the [project homepage][fc-homepage].


Drop Zones and Sealed Zones
---------------------------

This fork added some drop zones and sealed zone to the version 1.6.4 of fullCalendar.
As soon as you give a drop zone, the event of the fullcalendar can only be dropped in one of these zones.
A sealed zone is a zone where you will never be able to drop something.
A sealed zone can be placed in a drop zone.

You can visit the demo pages on [dropZones](https://github.com/carpediese/fullcalendar/blob/master/demos/dropping-retriction.html) and [sealedZones only](https://github.com/carpediese/fullcalendar/blob/master/demos/sealed-zones.html).

The zones works only in agenda views.

### Configuration

```
$('#calendar').fullCalendar({
	editable: true,								// if non editable, useless
	defaultView: 'agendaWeek',					// works only in agenda views
	dropZones: [
		{
			start: new Date(y, m, d, 8, 0),		// Begin date of the drop zone (required)
			end: new Date(y, m, d, 15, 30),		// End date of the drop zone (required)
			background: '#bbeebb',				// Background color of the zone
			cls: 'dropzone',					// Additional class to add on the zone
			weekly: true						// If the zone must be repeted every week			
		}
	],
	sealedZones: [
		{
			// same configuration as the dropzone
		}
	]
});
```

### API

You can access to 3 methods to check if an element is in a zone or not (usefull for external droping) :

 * `isInDropZone(event)` : Check if the event is in a dropzone. Return `true` if the calendar does not contains dropzones.
 * `isInSealedZone(event)` : Check if the event is in a sealed zone. Return `false` if the calendar does not contains sealed zone.
 * `authorizedToDrop(event)` : Check if the event is authorized to be dropped. It is simply `(isInDropZone(event) && !isInSealedZone(event))`

You can call the methods like this.
```
$('#calendar').fullCalendar('method', params);
```



Getting Set Up
--------------

You will need [Git][git], [Node][node], and NPM installed. For clarification, please view the [jQuery readme][jq-readme], which requires a similar setup.

Also, you will need the [grunt-cli][grunt-cli] and [bower][bower] packages installed globally (`-g`) on your system:

	npm install -g grunt-cli bower

Then, clone FullCalendar's git repo:

	git clone git://github.com/arshaw/fullcalendar.git

Enter the directory and install FullCalendar's development dependencies:

	cd fullcalendar && npm install


Development Workflow
--------------------

After you make code changes, you'll want to compile the JS/CSS so that it can be previewed from the tests and demos. You can either manually rebuild each time you make a change:

	grunt dev

Or, you can run a script that automatically rebuilds whenever you save a source file:

	./build/watch

You can optionally add the `--sourceMap` flag to output source maps for debugging.

When you are finished, run the following command to write the distributable files into the `./build/out/` and `./build/dist/` directories:

	grunt

If you want to clean up the generated files, run:

	grunt clean


Writing Tests
-------------

When fixing a bug or writing a feature, please make a corresponding HTML file in the `./tests/` directory to visually demonstrate your work. If the test requires user intervention to prove its point, please write instructions for the user to follow. Explore the existing tests for more info.


[fc-homepage]: http://arshaw.com/fullcalendar/
[git]: http://git-scm.com/
[node]: http://nodejs.org/
[grunt-cli]: http://gruntjs.com/getting-started#installing-the-cli
[bower]: http://bower.io/
[jq-readme]: https://github.com/jquery/jquery/blob/master/README.md#what-you-need-to-build-your-own-jquery
