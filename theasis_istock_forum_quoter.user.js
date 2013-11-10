// ==UserScript==
// @name           iStock Forum Quoter
// @namespace      theasis
// @match          http://*.istockphoto.com/forum_messages.php*
// @match          https://*.istockphoto.com/forum_messages.php*
// @match          http://*.istockphoto.com/forum_post.php*
// @match          https://*.istockphoto.com/forum_post.php*
// @version	   0.0.2
// iStockPhoto greasemonkey script (c) Martin McCarthy 2013
// ==/UserScript==
// This script makes it easy to quote bits of other forum posts and do a few other things when *NOT* in WYSIWYG mode
//
// 9 Nov 2013 Martin McCarthy
// Initial version
//

function Ex(message) {
	this.message=message;
	this.name="Local Exception";
}
function main() {
	if (jQ("#EditorBody_ifr").length>0) {
		// WYSIWYG mode. Ew!! Abandon ship!
		return;
	}
	
	var textArea=jQ("#EditorBody");
	setupPage=function() {
		var form=jQ("#ForumMultisitePostForm");
		addButton("Colour",form,"theasisForumColorTag","colour");
		addButton("]",form,"theasisForumRightBracket");
		addButton("[",form,"theasisForumLeftBracket");
		addButton("Quote",form,"theasisForumQuote",quoteSelectedText);
	};
	addButton=function(value,target,id,spesh) {
		var speshFn=spesh;
		switch(typeof spesh) {
			case "undefined":
				speshFn=function(){insertSpecial(value);};
				break;
			case "string":
				speshFn=function(){insertSpecial(spesh);};
				break;
		}
		var idAttr=id?" id='"+id+"' ":"";
		if (value && target) {
			jQ("<input type='submit' class='forumSubmitButton'"+idAttr+"value='"+value+"'>").click(speshFn).insertAfter(target);
		} else {
			throw new Ex("Invalid button data");
		}
	};
	insertSpecial=function(spesh) {
		switch(spesh) {
		case '[':
			textArea.append("&amp;#91;");
			break;
		case ']':
			textArea.append("&amp;#93;");
			break;
		case 'colour':
			textArea.append("[color=#0099bb][/color]");
			break;
		}
	};
	quoteSelectedText=function() {
		textArea.append("[quote]" + getSelectionHtml() + "[/quote]\n");
	};
	getSelectionHtml=function() {
		var html = "";
		if (typeof window.getSelection != "undefined") {
			var sel = window.getSelection();
			if (sel.rangeCount) {
				var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
					container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
			}
		} else if (typeof document.selection != "undefined") {
			if (document.selection.type == "Text") {
				html = document.selection.createRange().htmlText;
			}
		}
		return html;
	};
	
	setupPage();
}

// load jQuery and kick off the meat of the code when jQuery has finished loading
function addJQuery(callback) {
	window.jQ=jQuery.noConflict(true);
	main(); 
}

addJQuery(main);

