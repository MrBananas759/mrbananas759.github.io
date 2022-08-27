var autoClick = false;
var clickGolden = false;


if (autoClick) {
	Game.ClickCookie();
}

Document.addEventListener('keydown', function(event)) {
	if(event.keyCode == 49) {
		autoClick == !autoClick;
	}
}
