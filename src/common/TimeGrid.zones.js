
/* Zones-rendering methods for the TimeGrid class
----------------------------------------------------------------------------------------------------------------------*/

$.extend(TimeGrid.prototype, {
	
	zonesSkeleton : null,
	
	// renders all the zones
	renderZones : function(zones) {
	
		this.eventSkeletonEl = $('<div class="fc-content-skeleton"/>');
		
		this.renderDropZones(zones.dropZones);
		this.renderSealedZones(zones.sealedZones);
		
		this.el.append(this.eventSkeletonEl);
	},
	
	
	destroyZones : function() {
		if (this.zonesSkeleton) {
			this.zonesSkeleton.remove();
			this.zonesSkeleton = null;
		}
	},
	
	
	
	renderDropZones : function(zones) {
		var html = '';
		var view = this.view;
		
		for (i=0; i < zones.length; i++) {
			var zone = zones[i];
			zone.background = (zone.background != undefined) ? zone.background : '#bbeebb' ;
			zone.cls = (zone.cls) ? zone.cls : 'fc-dropZone' ;
			
			var start = zone.start.clone();
			var end = zone.end.clone();
			
			if (zone.weekly) {
					var diff = start.getDay() - view.start.getDay() ;
					diff = (diff < 0) ? diff + 7 : diff;
					
					var newStart = view.start.clone();
					newStart.setDate(newStart.getDate() + diff); 
					newStart.setHours(start.getHours());
					newStart.setMinutes(start.getMinutes());
					start = newStart;
					
					var newEnd = view.start.clone();
					newEnd.setDate(newEnd.getDate() + diff); 
					newEnd.setHours(end.getHours());
					newEnd.setMinutes(end.getMinutes());
					end = newEnd;
			}
 
			if (start >= this.start && end <= this.end) {
				html += getZoneHtml(zone, start, end);
			}
		}
		$('<table></table>').append(html).appendTo(zonesSkeleton);
	}
	
	
	
	
	
	// render the dropZones
	// Renders and returns the <table> portion of the event-skeleton.
	// Returns an object with properties 'tbodyEl' and 'segs'.
	__renderDropZones : function(zones) {
		var view = this.view;
		var tableEl = $('<table><tr/></table>');
		var trEl = tableEl.find('tr');
		var allSegs = this.eventsToSegs(events);
		var segCols = this.groupSegCols(allSegs); // groups into sub-arrays, and assigns 'col' to each seg
		var html = ''; // html string with default HTML for all events, concatenated together
		var i, seg;
		var col, segs;
		var containerEl;

		// build the combined HTML string. and compute top/bottom
		for (i = 0; i < allSegs.length; i++) {
			seg = allSegs[i];
			html += this.renderSegHtml(seg);

			seg.top = this.computeDateTop(seg.start, seg.start);
			seg.bottom = this.computeDateTop(seg.end, seg.start);
		}

		// Grab individual elements from the combined HTML string. Use each as the default rendering.
		// Then, compute the 'el' for each segment. An el might be null if the eventRender callback returned false.
		$(html).each(function(i, node) {
			allSegs[i].el = view.resolveEventEl(allSegs[i].event, $(node));
		});

		for (col = 0; col < segCols.length; col++) { // iterate each column grouping
			segs = segCols[col];

			segs = $.grep(segs, renderedSegFilter); // filter out unrendered segments
			placeSlotSegs(segs); // compute horizontal coordinates, z-index's, and reorder the array
			segCols[col] = segs; // assign back

			containerEl = $('<div class="fc-event-container"/>');

			// assign positioning CSS and insert into container
			for (i = 0; i < segs.length; i++) {
				seg = segs[i];
				seg.el.css(this.generateSegPositionCss(seg));
				containerEl.append(seg.el);
			}

			trEl.append($('<td/>').append(containerEl));
		}

		this.bookendCells(trEl, 'eventSkeleton');

		return  {
			tableEl: tableEl,
			segs: flattenArray(segCols) // will contain only segments with rendered els
		};
		
		
	},
	
	// render the sealedZones
	renderSealedZones : function(zones) {
		
		
		
	},
	
	
	// make the html of a zone
	renderZoneHtml : function() {
		
		
	}
	
	
	
	
	// Renders the events onto the grid and returns an array of segments that have been rendered
	__renderEvents: function(events) {
		var res = this.renderEventTable(events);

		this.eventSkeletonEl = $('<div class="fc-content-skeleton"/>').append(res.tableEl);
		this.el.append(this.eventSkeletonEl);

		return res.segs; // return segment objects. for the view
	},



	// Renders the HTML for a single event segment's default rendering
	__renderSegHtml: function(seg) {
		var view = this.view;
		var event = seg.event;
		var isDraggable = view.isEventDraggable(event);
		var isResizable = seg.isEnd && view.isEventResizable(event);
		var classes = this.getSegClasses(seg, isDraggable, isResizable);
		var skinCss = this.getEventSkinCss(event);
		var timeText;
		var fullTimeText; // more verbose time text. for the print stylesheet

		classes.unshift('fc-time-grid-event');

		if (view.isMultiDayEvent(event)) { // if the event appears to span more than one day...
			// Don't display time text on segments that run entirely through a day.
			// That would appear as midnight-midnight and would look dumb.
			// Otherwise, display the time text for the *segment's* times (like 6pm-midnight or midnight-10am)
			if (seg.isStart || seg.isEnd) {
				timeText = view.getEventTimeText(seg.start, seg.end);
				fullTimeText = view.getEventTimeText(seg.start, seg.end, 'LT');
			}
		} else {
			// Display the normal time text for the *event's* times
			timeText = view.getEventTimeText(event);
			fullTimeText = view.getEventTimeText(event, 'LT');
		}

		return '<a class="' + classes.join(' ') + '"' +
			(skinCss ? ' style="' + skinCss + '"' : '') +
			'>' +
				'<div class="fc-content">' +
					(timeText ?
						'<div class="fc-time" data-full="' + htmlEscape(fullTimeText) + '">' +
							'<span>' + htmlEscape(timeText) + '</span>' +
						'</div>' :
						''
						) +
					(event.title ?
						'<div class="fc-title">' +
							htmlEscape(event.title) +
						'</div>' :
						''
						) +
				'</div>' +
				'<div class="fc-bg"/>' +
				(isResizable ?
					'<div class="fc-resizer"/>' :
					''
					) +
			'</a>';
	},


	// Generates an object with css properties/values that should be applied to an event segment element.
	// Contains important positioning-related properties that should be applied to any event element, customized or not.
	__generateSegPositionCss: function(seg) {
		var view = this.view;
		var isRTL = view.opt('isRTL');
		var shouldOverlap = view.opt('slotEventOverlap');
		var backwardCoord = seg.backwardCoord; // the left side if LTR. the right side if RTL. floating-point
		var forwardCoord = seg.forwardCoord; // the right side if LTR. the left side if RTL. floating-point
		var left; // amount of space from left edge, a fraction of the total width
		var right; // amount of space from right edge, a fraction of the total width
		var props;

		if (shouldOverlap) {
			// double the width, but don't go beyond the maximum forward coordinate (1.0)
			forwardCoord = Math.min(1, backwardCoord + (forwardCoord - backwardCoord) * 2);
		}

		if (isRTL) {
			left = 1 - forwardCoord;
			right = backwardCoord;
		}
		else {
			left = backwardCoord;
			right = 1 - forwardCoord;
		}

		props = {
			zIndex: seg.level + 1, // convert from 0-base to 1-based
			top: seg.top,
			bottom: -seg.bottom, // flipped because needs to be space beyond bottom edge of event container
			left: left * 100 + '%',
			right: right * 100 + '%'
		};

		if (shouldOverlap && seg.forwardPressure) {
			// add padding to the edge so that forward stacked events don't cover the resizer's icon
			props[isRTL ? 'marginLeft' : 'marginRight'] = 10 * 2; // 10 is a guesstimate of the icon's width 
		}

		return props;
	},


	// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's col
	__groupSegCols: function(segs) {
		var view = this.view;
		var segCols = [];
		var i;

		for (i = 0; i < view.colCnt; i++) {
			segCols.push([]);
		}

		for (i = 0; i < segs.length; i++) {
			segCols[segs[i].col].push(segs[i]);
		}

		return segCols;
	}
	
	
});
