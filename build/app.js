
// minifier: path aliases

enyo.path.addPaths({layout: "/home/marcel/Dropbox/webOS-Apps/Enyo2/tt-rssenyo/enyo/../lib/layout/", onyx: "/home/marcel/Dropbox/webOS-Apps/Enyo2/tt-rssenyo/enyo/../lib/onyx/", onyx: "/home/marcel/Dropbox/webOS-Apps/Enyo2/tt-rssenyo/enyo/../lib/onyx/source/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: "",
onRenderRow: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect || t.index === -1) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
this.setupItem(e);
var t = this.fetchRowNode(e);
t && (t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren(), this.doRenderRow({
rowIndex: e
}));
},
fetchRowNode: function(e) {
if (this.hasNode()) return this.node.querySelector('[data-enyo-index="' + e + '"]');
},
rowForEvent: function(e) {
if (!this.hasNode()) return -1;
var t = e.target;
while (t && t !== this.node) {
var n = t.getAttribute && t.getAttribute("data-enyo-index");
if (n !== null) return Number(n);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
this.setupItem(e);
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n;
t && (t.id !== e.id ? n = t.querySelector("#" + e.id) : n = t), e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1,
reorderable: !1,
centerReorderContainer: !0,
swipeableComponents: [],
enableSwipe: !0,
persistSwipeableItem: !1
},
events: {
onSetupItem: "",
onSetupReorderComponents: "",
onSetupPinnedReorderComponents: "",
onReorder: "",
onSetupSwipeItem: "",
onSwipeDrag: "",
onSwipe: "",
onSwipeComplete: ""
},
handlers: {
onAnimateFinish: "animateFinish",
ondrag: "drag",
onup: "dragfinish",
onholdpulse: "holdpulse",
onRenderRow: "rowRendered",
ondragstart: "dragstart",
onflick: "flick"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
initHoldCounter: 3,
holdCounter: 3,
holding: !1,
draggingRowIndex: -1,
dragToScrollThreshold: .1,
prevScrollTop: 0,
autoScrollTimeoutMS: 20,
autoScrollTimeout: null,
pinnedReorderMode: !1,
initialPinPosition: -1,
itemMoved: !1,
currentPage: null,
swipeIndex: null,
swipeDirection: null,
persistentItemVisible: !1,
persistentItemOrigin: null,
swipeComplete: !1,
completeSwipeTimeout: null,
completeSwipeDelayMS: 500,
normalSwipeSpeedMS: 200,
fastSwipeSpeedMS: 100,
flicked: !0,
percentageDraggedThreshold: .2,
importProps: function(e) {
e.reorderable && (this.touch = !0), this.inherited(arguments);
},
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
initComponents: function() {
this.createReorderTools(), this.inherited(arguments), this.createSwipeableComponents();
},
createReorderTools: function() {
this.createComponent({
name: "reorderContainer",
classes: "enyo-list-reorder-container",
ondown: "sendToStrategy",
ondrag: "sendToStrategy",
ondragstart: "sendToStrategy",
ondragfinish: "sendToStrategy",
onflick: "sendToStrategy"
});
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
createSwipeableComponents: function() {
for (var e = 0; e < this.swipeableComponents.length; e++) this.$.swipeableComponents.createComponent(this.swipeableComponents[e], {
owner: this.owner
});
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
sendToStrategy: function(e, t) {
this.$.strategy.dispatchEvent("on" + t.type, t, e);
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
holdpulse: function(e, t) {
if (!this.getReorderable() || this.holding) return;
if (this.holdCounter <= 0) {
this.resetHoldCounter(), this.hold(e, t);
return;
}
this.holdCounter--;
},
resetHoldCounter: function() {
this.holdCounter = this.initHoldCounter;
},
hold: function(e, t) {
t.preventDefault();
if (this.shouldDoReorderHold(e, t)) return this.holding = !0, this.reorderHold(t), !1;
},
dragstart: function(e, t) {
return this.swipeDragStart(e, t);
},
drag: function(e, t) {
return t.preventDefault(), this.shouldDoReorderDrag(t) ? (this.reorderDrag(t), !0) : this.shouldDoSwipeDrag() ? (this.swipeDrag(e, t), !0) : this.preventDragPropagation;
},
flick: function(e, t) {
this.shouldDoSwipeFlick() && this.swipeFlick(e, t);
},
dragfinish: function(e, t) {
this.getReorderable() && (this.resetHoldCounter(), this.finishReordering(e, t)), this.swipeDragFinish(e, t);
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i), this.getReorderable() && this.draggingRowIndex > -1 && this.hideReorderingRow();
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0, this.p0RowBounds = this.getPageRowHeights(this.$.page0)), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0, this.p1RowBounds = this.getPageRowHeights(this.$.page1)), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
getPageRowHeights: function(e) {
var t = [], n = document.querySelectorAll("#" + e.id + " div[data-enyo-index]");
for (var r = 0, i, s; r < n.length; r++) i = n[r].getAttribute("data-enyo-index"), i !== null && (s = enyo.dom.getBounds(n[r]), t.push({
height: s.height,
width: s.width,
index: parseInt(i, 10)
}));
return t;
},
updateRowBounds: function(e) {
var t = this.getRowBoundsUpdateIndex(e, this.p0RowBounds);
if (t > -1) {
this.updateRowBoundsAtIndex(t, this.p0RowBounds, this.$.page0);
return;
}
t = this.getRowBoundsUpdateIndex(e, this.p1RowBounds);
if (t > -1) {
this.updateRowBoundsAtIndex(t, this.p1RowBounds, this.$.page1);
return;
}
},
getRowBoundsUpdateIndex: function(e, t) {
for (var n = 0; n < t.length; n++) if (t[n].index == e) return n;
return -1;
},
updateRowBoundsAtIndex: function(e, t, n) {
var r = document.querySelectorAll("#" + n.id + ' div[data-enyo-index="' + t[e].index + '"]'), i = enyo.dom.getBounds(r[0]);
t[e].height = i.height, t[e].width = i.width;
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return t = Math.max(t, 0), {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), this.shouldDoPinnedReorderScroll() && this.reorderScroll(e, t), n;
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
rowRendered: function(e, t) {
this.updateRowBounds(t.rowIndex);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
},
shouldDoReorderHold: function(e, t) {
return !!this.getReorderable() && t.rowIndex >= 0 && !this.pinnedReorderMode && e === this.$.strategy && t.index >= 0 ? !0 : !1;
},
reorderHold: function(e) {
this.$.strategy.listReordering = !0, this.buildReorderContainer(), this.doSetupReorderComponents(e), this.styleReorderContainer(e), this.draggingRowIndex = this.placeholderRowIndex = e.rowIndex, this.itemMoved = !1, this.initialPageNumber = this.currentPageNumber = Math.floor(e.rowIndex / this.rowsPerPage), this.currentPage = this.currentPageNumber % 2, this.prevScrollTop = this.getScrollTop(), this.replaceNodeWithPlaceholder(e.rowIndex);
},
buildReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.reorderComponents.length; e++) this.$.reorderContainer.createComponent(this.reorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
styleReorderContainer: function(e) {
this.setItemPosition(this.$.reorderContainer, e.rowIndex), this.setItemBounds(this.$.reorderContainer, e.rowIndex), this.$.reorderContainer.setShowing(!0), this.centerReorderContainer && this.centerReorderContainerOnPointer(e);
},
appendNodeToReorderContainer: function(e) {
this.$.reorderContainer.createComponent({
allowHtml: !0,
content: e.innerHTML
}).render();
},
centerReorderContainerOnPointer: function(e) {
var t = this.getNodePosition(this.hasNode()), n = e.pageX - t.left - parseInt(this.$.reorderContainer.domStyles.width, 10) / 2, r = e.pageY - t.top + this.getScrollTop() - parseInt(this.$.reorderContainer.domStyles.height, 10) / 2;
this.getStrategyKind() != "ScrollStrategy" && (n -= this.getScrollLeft(), r -= this.getScrollTop()), this.positionReorderContainer(n, r);
},
positionReorderContainer: function(e, t) {
this.$.reorderContainer.addClass("enyo-animatedTopAndLeft"), this.$.reorderContainer.addStyles("left:" + e + "px;top:" + t + "px;"), this.setPositionReorderContainerTimeout();
},
setPositionReorderContainerTimeout: function() {
var e = this;
this.clearPositionReorderContainerTimeout(), this.positionReorderContainerTimeout = setTimeout(function() {
e.$.reorderContainer.removeClass("enyo-animatedTopAndLeft"), e.clearPositionReorderContainerTimeout();
}, 100);
},
clearPositionReorderContainerTimeout: function() {
this.positionReorderContainerTimeout && (clearTimeout(this.positionReorderContainerTimeout), this.positionReorderContainerTimeout = null);
},
shouldDoReorderDrag: function(e) {
return !this.getReorderable() || this.draggingRowIndex < 0 || this.pinnedReorderMode ? !1 : !0;
},
reorderDrag: function(e) {
this.positionReorderNode(e), this.checkForAutoScroll(e);
var t = this.getRowIndexFromCoordinate(e.pageY);
t !== -1 && t != this.placeholderRowIndex && this.movePlaceholderToIndex(t);
},
positionReorderNode: function(e) {
var t = this.$.reorderContainer.hasNode().style, n = parseInt(t.left, 10) + e.ddx, r = parseInt(t.top, 10) + e.ddy;
r = this.getStrategyKind() == "ScrollStrategy" ? r + (this.getScrollTop() - this.prevScrollTop) : r, this.$.reorderContainer.addStyles("top: " + r + "px ; left: " + n + "px"), this.prevScrollTop = this.getScrollTop();
},
checkForAutoScroll: function(e) {
var t = this.getNodePosition(this.hasNode()), n = this.getBounds(), r;
e.pageY - t.top < n.height * this.dragToScrollThreshold ? (r = 100 * (1 - (e.pageY - t.top) / (n.height * this.dragToScrollThreshold)), this.scrollDistance = -1 * r) : e.pageY - t.top > n.height * (1 - this.dragToScrollThreshold) ? (r = 100 * ((e.pageY - t.top - n.height * (1 - this.dragToScrollThreshold)) / (n.height - n.height * (1 - this.dragToScrollThreshold))), this.scrollDistance = 1 * r) : this.scrollDistance = 0, this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling();
},
stopAutoScrolling: function() {
this.autoScrollTimeout && (clearTimeout(this.autoScrollTimeout), this.autoScrollTimeout = null);
},
startAutoScrolling: function() {
this.autoScrollTimeout = setTimeout(enyo.bind(this, this.autoScroll), this.autoScrollTimeoutMS);
},
autoScroll: function() {
this.scrollDistance === 0 ? this.stopAutoScrolling() : this.autoScrollTimeout || this.startAutoScrolling(), this.setScrollPosition(this.getScrollPosition() + this.scrollDistance), this.positionReorderNode({
ddx: 0,
ddy: 0
}), this.startAutoScrolling();
},
movePlaceholderToIndex: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
var n = e > this.draggingRowIndex ? e + 1 : e, r = Math.floor(n / this.rowsPerPage), i = r % 2;
r >= this.pageCount && (r = this.currentPageNumber, i = this.currentPage), this.currentPage == i ? this.$["page" + this.currentPage].hasNode().insertBefore(this.placeholderNode, this.$.generator.fetchRowNode(n)) : (this.$["page" + i].hasNode().insertBefore(this.placeholderNode, this.$.generator.fetchRowNode(n)), this.updatePageHeight(this.currentPageNumber, this.$["page" + this.currentPage]), this.updatePageHeight(r, this.$["page" + i]), this.updatePagePositions(r, i)), this.placeholderRowIndex = e, this.currentPageNumber = r, this.currentPage = i, this.itemMoved = !0;
},
finishReordering: function(e, t) {
if (this.draggingRowIndex < 0 || this.pinnedReorderMode) return;
var n = this;
return this.stopAutoScrolling(), this.$.strategy.listReordering = !1, this.moveReorderedContainerToDroppedPosition(t), setTimeout(function() {
n.completeFinishReordering(t);
}, 100), t.preventDefault(), !0;
},
moveReorderedContainerToDroppedPosition: function() {
var e = this.getRelativeOffset(this.placeholderNode, this.hasNode()), t = this.getStrategyKind() == "ScrollStrategy" ? e.top : e.top - this.getScrollTop(), n = e.left - this.getScrollLeft();
this.positionReorderContainer(n, t);
},
completeFinishReordering: function(e) {
if (this.draggingRowIndex == this.placeholderRowIndex && !this.pinnedReorderMode) {
if (!this.itemMoved) {
this.beginPinnedReorder(e);
return;
}
this.dropReorderedRow(e);
}
this.removePlaceholderNode(), this.dropReorderedRow(e), this.reorderRows(e), this.resetReorderState(), this.refresh();
},
beginPinnedReorder: function(e) {
this.buildPinnedReorderContainer(), this.doSetupPinnedReorderComponents(enyo.mixin(e, {
index: this.draggingRowIndex
})), this.pinnedReorderMode = !0, this.initialPinPosition = e.pageY;
},
emptyAndHideReorderContainer: function() {
this.$.reorderContainer.destroyComponents(), this.$.reorderContainer.setShowing(!1);
},
buildPinnedReorderContainer: function() {
this.$.reorderContainer.destroyClientControls();
for (var e = 0; e < this.pinnedReorderComponents.length; e++) this.$.reorderContainer.createComponent(this.pinnedReorderComponents[e], {
owner: this.owner
});
this.$.reorderContainer.render();
},
dropReorderedRow: function(e) {
this.emptyAndHideReorderContainer(), this.positionReorderedNode();
},
reorderRows: function(e) {
this.doReorder(this.makeReorderEvent(e)), this.shouldMoveItemtoDiffPage() && this.moveItemToDiffPage(), this.updateListIndices();
},
makeReorderEvent: function(e) {
return e.reorderFrom = this.draggingRowIndex, e.reorderTo = this.placeholderRowIndex, e;
},
shouldMoveItemtoDiffPage: function() {
return this.currentPageNumber != this.initialPageNumber;
},
moveItemToDiffPage: function() {
var e, t, n = this.currentPage == 1 ? 0 : 1;
this.initialPageNumber < this.currentPageNumber ? (e = this.$["page" + this.currentPage].hasNode().firstChild, this.$["page" + n].hasNode().appendChild(e)) : (e = this.$["page" + this.currentPage].hasNode().lastChild, t = this.$["page" + n].hasNode().firstChild, this.$["page" + n].hasNode().insertBefore(e, t)), this.updatePagePositions(this.initialPageNumber, n);
},
positionReorderedNode: function() {
var e = this.placeholderRowIndex > this.draggingRowIndex ? this.placeholderRowIndex + 1 : this.placeholderRowIndex, t = this.$.generator.fetchRowNode(e);
this.$["page" + this.currentPage].hasNode().insertBefore(this.hiddenNode, t), this.showNode(this.hiddenNode);
},
resetReorderState: function() {
this.draggingRowIndex = this.placeholderRowIndex = -1, this.holding = !1, this.pinnedReorderMode = !1;
},
updateListIndices: function() {
if (this.shouldDoRefresh()) {
this.refresh();
return;
}
var e = Math.min(this.draggingRowIndex, this.placeholderRowIndex), t = Math.max(this.draggingRowIndex, this.placeholderRowIndex), n = this.draggingRowIndex - this.placeholderRowIndex > 0 ? 1 : -1, r, i, s, o;
if (n === 1) {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r.setAttribute("data-enyo-index", "reordered");
for (i = t - 1, s = t; i >= e; i--) {
r = this.$.generator.fetchRowNode(i);
if (!r) {
enyo.log("No node - " + i);
continue;
}
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o + 1, r.setAttribute("data-enyo-index", s);
}
r = document.querySelectorAll('[data-enyo-index="reordered"]')[0], r.setAttribute("data-enyo-index", this.placeholderRowIndex);
} else {
r = this.$.generator.fetchRowNode(this.draggingRowIndex), r.setAttribute("data-enyo-index", this.placeholderRowIndex);
for (i = e + 1, s = e; i <= t; i++) {
r = this.$.generator.fetchRowNode(i);
if (!r) {
enyo.log("No node - " + i);
continue;
}
o = parseInt(r.getAttribute("data-enyo-index"), 10), s = o - 1, r.setAttribute("data-enyo-index", s);
}
}
},
shouldDoRefresh: function() {
return Math.abs(this.initialPageNumber - this.currentPageNumber) > 1;
},
getNodeStyle: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
var n = this.getRelativeOffset(t, this.hasNode()), r = this.getDimensions(t);
return {
h: r.height,
w: r.width,
left: n.left,
top: n.top
};
},
getRelativeOffset: function(e, t) {
var n = {
top: 0,
left: 0
};
if (e !== t && e.parentNode) do n.top += e.offsetTop || 0, n.left += e.offsetLeft || 0, e = e.offsetParent; while (e && e !== t);
return n;
},
getDimensions: function(e) {
var t = window.getComputedStyle(e, null);
return {
height: parseInt(t.getPropertyValue("height"), 10),
width: parseInt(t.getPropertyValue("width"), 10)
};
},
replaceNodeWithPlaceholder: function(e) {
var t = this.$.generator.fetchRowNode(e);
if (!t) {
enyo.log("No node - " + e);
return;
}
this.placeholderNode = this.createPlaceholderNode(t), this.hiddenNode = this.hideNode(t), this.$["page" + this.currentPage].hasNode().insertBefore(this.placeholderNode, this.hiddenNode);
},
createPlaceholderNode: function(e) {
var t = this.$.placeholder.hasNode().cloneNode(!0), n = this.getDimensions(e);
return t.style.height = n.height + "px", t.style.width = n.width + "px", t;
},
removePlaceholderNode: function() {
this.removeNode(this.placeholderNode), this.placeholderNode = null;
},
removeHiddenNode: function() {
this.removeNode(this.hiddenNode), this.hiddenNode = null;
},
removeNode: function(e) {
if (!e || !e.parentNode) return;
e.parentNode.removeChild(e);
},
updatePageHeight: function(e, t) {
var n = t.getBounds().height;
this.pageHeights[e] = n;
},
updatePagePositions: function(e, t) {
this.positionPage(this.currentPageNumber, this.$["page" + this.currentPage]), this.positionPage(e, this.$["page" + t]);
},
correctPageHeights: function() {
var e = this.initialPageNumber % 2;
this.updatePageHeight(this.currentPageNumber, this.$["page" + this.currentPage]), e != this.currentPageNumber && this.updatePageHeight(this.initialPageNumber, this.$["page" + e]);
},
hideNode: function(e) {
return e.style.display = "none", e;
},
showNode: function(e) {
return e.style.display = "block", e;
},
dropPinnedRow: function(e) {
var t = this;
this.moveReorderedContainerToDroppedPosition(e), setTimeout(function() {
t.completeFinishReordering(e);
}, 100);
return;
},
getRowIndexFromCoordinate: function(e) {
var t = this.getScrollTop() + e - this.getNodePosition(this.hasNode()).top, n = this.positionToPageInfo(t), r = n.no == this.p0 ? this.p0RowBounds : this.p1RowBounds;
if (!r) return -1;
var i = n.pos, s = parseInt(window.getComputedStyle(this.placeholderNode).height, 10);
for (var o = 0, u = 0; o < r.length; o++) {
u += r[o].height > 0 ? r[o].height : s;
if (u >= i) return r[o].index;
}
return -1;
},
getIndexPosition: function(e) {
return this.getNodePosition(this.$.generator.fetchRowNode(e));
},
getNodePosition: function(e) {
var t = e, n = 0, r = 0;
while (e && e.offsetParent) n += e.offsetTop, r += e.offsetLeft, e = e.offsetParent;
e = t;
var i = enyo.dom.getCssTransformProp();
while (e && e.getAttribute) {
var s = enyo.dom.getComputedStyleValue(e, i);
if (s && s != "none") {
var o = s.lastIndexOf(","), u = s.lastIndexOf(",", o - 1);
o >= 0 && u >= 0 && (n += parseFloat(s.substr(o + 1, s.length - o)), r += parseFloat(s.substr(u + 1, o - u)));
}
e = e.parentNode;
}
return {
top: n,
left: r
};
},
cloneRowNode: function(e) {
return this.$.generator.fetchRowNode(e).cloneNode(!0);
},
setItemPosition: function(e, t) {
var n = this.getNodeStyle(t), r = this.getStrategyKind() == "ScrollStrategy" ? n.top : n.top - this.getScrollTop(), i = "top:" + r + "px; left:" + n.left + "px;";
e.addStyles(i);
},
setItemBounds: function(e, t) {
var n = this.getNodeStyle(t), r = "width:" + n.w + "px; height:" + n.h + "px;";
e.addStyles(r);
},
shouldDoPinnedReorderScroll: function() {
return !this.getReorderable() || !this.pinnedReorderMode ? !1 : !0;
},
reorderScroll: function(e, t) {
this.getStrategyKind() == "ScrollStrategy" && this.$.reorderContainer.addStyles("top:" + (this.initialPinPosition + this.getScrollTop() - this.rowHeight) + "px;");
var n = this.getRowIndexFromCoordinate(this.initialPinPosition);
n != this.placeholderRowIndex && this.movePlaceholderToIndex(n);
},
hideReorderingRow: function() {
var e = document.querySelectorAll('[data-enyo-index="' + this.draggingRowIndex + '"]')[0];
e && (this.hiddenNode = this.hideNode(e));
},
isReordering: function() {
return this.draggingRowIndex > -1;
},
swipeDragStart: function(e, t) {
return !this.hasSwipeableComponents() || t.vertical || this.draggingRowIndex > -1 ? !1 : (this.setSwipeDirection(t.xDirection), this.completeSwipeTimeout && this.completeSwipe(t), this.setFlicked(!1), this.setSwipeComplete(!1), this.swipeIndexChanged(t.index) && (this.clearSwipeables(), this.setSwipeIndex(t.index)), this.persistentItemVisible || this.startSwipe(t), this.draggedXDistance = 0, this.draggedYDistance = 0, !0);
},
shouldDoSwipeDrag: function() {
return this.getEnableSwipe() && !this.isReordering();
},
swipeDrag: function(e, t) {
return this.draggedOutOfBounds(t) ? (this.swipeDragFinish(t), this.preventDragPropagation) : this.persistentItemVisible ? (this.dragPersistentItem(t), this.preventDragPropagation) : (this.dragSwipeableComponents(this.calcNewDragPosition(t.ddx)), this.draggedXDistance = t.dx, this.draggedYDistance = t.dy, this.preventDragPropagation);
},
shouldDoSwipeFlick: function() {
return !this.isReordering();
},
swipeFlick: function(e, t) {
return this.getEnableSwipe() ? Math.abs(t.xVelocity) < Math.abs(t.yVelocity) ? !1 : (this.setFlicked(!0), this.persistentItemVisible ? (this.flickPersistentItem(t), !0) : (this.swipe(this.normalSwipeSpeedMS), !0)) : !1;
},
swipeDragFinish: function(e, t) {
return this.getEnableSwipe() ? this.wasFlicked() ? this.preventDragPropagation : (this.persistentItemVisible ? this.dragFinishPersistentItem(t) : this.calcPercentageDragged(this.draggedXDistance) > this.percentageDraggedThreshold ? this.swipe(this.fastSwipeSpeedMS) : this.backOutSwipe(t), this.preventDragPropagation) : this.preventDragPropagation;
},
hasSwipeableComponents: function() {
return this.$.swipeableComponents.controls.length !== 0;
},
positionSwipeableContainer: function(e, t) {
var n = this.$.generator.fetchRowNode(e);
if (!n) return;
var r = this.getRelativeOffset(n, this.hasNode()), i = this.getDimensions(n), s = t == 1 ? -1 * i.width : i.width;
this.$.swipeableComponents.addStyles("top: " + r.top + "px; left: " + s + "px; height: " + i.height + "px; width: " + i.width + "px;");
},
setSwipeDirection: function(e) {
this.swipeDirection = e;
},
setFlicked: function(e) {
this.flicked = e;
},
wasFlicked: function() {
return this.flicked;
},
setSwipeComplete: function(e) {
this.swipeComplete = e;
},
swipeIndexChanged: function(e) {
return this.swipeIndex === null ? !0 : e === undefined ? !1 : e !== this.swipeIndex;
},
setSwipeIndex: function(e) {
this.swipeIndex = e === undefined ? this.swipeIndex : e;
},
calcNewDragPosition: function(e) {
var t = window.getComputedStyle(this.$.swipeableComponents.hasNode());
if (!t) return !1;
var n = parseInt(t.left, 10), r = this.getDimensions(this.$.swipeableComponents.node), i = this.swipeDirection == 1 ? 0 : -1 * r.width, s = this.swipeDirection == 1 ? n + e > i ? i : n + e : n + e < i ? i : n + e;
return s;
},
dragSwipeableComponents: function(e) {
this.$.swipeableComponents.applyStyle("left", e + "px");
},
draggedOutOfBounds: function(e) {
var t = this.getNodePosition(this.hasNode()), n = this.getBounds(), r = e.pageY - t.top < 0, i = e.pageY - t.top > n.height, s = e.pageX - t.left < 0, o = e.pageX - t.left > n.width;
return r || i || s || o;
},
startSwipe: function(e) {
e.index = this.swipeIndex, this.positionSwipeableContainer(this.swipeIndex, e.xDirection), this.$.swipeableComponents.setShowing(!0), this.setPersistentItemOrigin(e.xDirection), this.doSetupSwipeItem(e);
},
dragPersistentItem: function(e) {
var t = 0, n = this.persistentItemOrigin == "right" ? Math.max(t, t + e.dx) : Math.min(t, t + e.dx);
this.$.swipeableComponents.applyStyle("left", n + "px");
},
dragFinishPersistentItem: function(e) {
var t = this.calcPercentageDragged(e.dx) > .2, n = e.dx > 0 ? "right" : e.dx < 0 ? "left" : null;
this.persistentItemOrigin == n ? t ? this.slideAwayItem() : this.bounceItem(e) : this.bounceItem(e);
},
flickPersistentItem: function(e) {
e.xVelocity > 0 ? this.persistentItemOrigin == "left" ? this.bounceItem(e) : this.slideAwayItem() : e.xVelocity < 0 && (this.persistentItemOrigin == "right" ? this.bounceItem(e) : this.slideAwayItem());
},
setPersistentItemOrigin: function(e) {
this.persistentItemOrigin = e == 1 ? "left" : "right";
},
calcPercentageDragged: function(e) {
return Math.abs(e / parseInt(window.getComputedStyle(this.$.swipeableComponents.hasNode()).width, 10));
},
swipe: function(e) {
this.setSwipeComplete(!0), this.animateSwipe(0, e);
},
backOutSwipe: function(e) {
var t = this.getDimensions(this.$.swipeableComponents.node), n = this.swipeDirection == 1 ? -1 * t.width : t.width;
this.animateSwipe(n, this.fastSwipeSpeedMS), this.setSwipeDirection(null), this.setFlicked(!0);
},
bounceItem: function(e) {
var t = window.getComputedStyle(this.$.swipeableComponents.node);
parseInt(t.left, 10) != parseInt(t.width, 10) && this.animateSwipe(0, this.normalSwipeSpeedMS);
},
slideAwayItem: function() {
var e = this.$.swipeableComponents, t = parseInt(window.getComputedStyle(e.node).width, 10), n = this.persistentItemOrigin == "left" ? -1 * t : t;
this.animateSwipe(n, this.normalSwipeSpeedMS), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
clearSwipeables: function() {
this.$.swipeableComponents.setShowing(!1), this.persistentItemVisible = !1, this.setPersistSwipeableItem(!1);
},
completeSwipe: function(e) {
this.completeSwipeTimeout && (clearTimeout(this.completeSwipeTimeout), this.completeSwipeTimeout = null), this.getPersistSwipeableItem() ? this.persistentItemVisible = !0 : (this.$.swipeableComponents.setShowing(!1), this.swipeComplete && this.doSwipeComplete({
index: this.swipeIndex,
xDirection: this.swipeDirection
})), this.setSwipeDirection(null);
},
animateSwipe: function(e, t) {
var n = enyo.now(), r = 0, i = this.$.swipeableComponents, s = parseInt(i.domStyles.left, 10), o = e - s;
this.stopAnimateSwipe();
var u = enyo.bind(this, function() {
var e = enyo.now() - n, r = e / t, a = s + o * Math.min(r, 1);
i.applyStyle("left", a + "px"), this.job = enyo.requestAnimationFrame(u), e / t >= 1 && (this.stopAnimateSwipe(), this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
this.completeSwipe();
}), this.completeSwipeDelayMS));
});
this.job = enyo.requestAnimationFrame(u);
},
stopAnimateSwipe: function() {
this.job && (this.job = enyo.cancelRequestAnimationFrame(this.job));
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.strategyKind = this.resetStrategyKind(), this.inherited(arguments);
},
resetStrategyKind: function() {
return enyo.platform.android >= 3 ? "TranslateScrollStrategy" : "TouchScrollStrategy";
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath || this.getStrategy(), i = -1 * this.getScrollTop();
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(-1 * this.getScrollTop() - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0;
var e = this.getStrategy().$.scrollMath || this.getStrategy();
e.setScrollY(this.pullHeight), e.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
}, {
name: "placeholder",
classes: "enyo-list-placeholder"
}, {
name: "swipeableComponents",
style: "position:absolute; display:block; top:-1000px; left:0px;"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() ? (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), u++) : (this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth)), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// DockRightArranger.js

enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
overlap: 0,
layoutWidth: 0,
constructor: function() {
this.inherited(arguments), this.overlap = this.container.overlap != null ? this.container.overlap : this.overlap, this.layoutWidth = this.container.layoutWidth != null ? this.container.layoutWidth : this.layoutWidth;
},
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
var f = o > this.layoutWidth ? this.overlap : 0;
a = o - e[r].width + f;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var l = !1;
for (k = r + 1; k < u; k++) {
var f = 0;
if (l) f = 0; else if (e[r].width + e[k].width - this.overlap > o) f = 0, l = !0; else {
f = e[r].width - this.overlap;
for (i = r; i < k; i++) {
var c = f + e[i + 1].width - this.overlap;
if (!(c < o)) {
f = o;
break;
}
f = c;
}
f = o - f;
}
this.container.transitionPositions[r + "." + k] = f;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels(), s = e < n ? i[n].width : i[e].width;
return s;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
rendered: function() {
this.inherited(arguments), enyo.makeBubble(this, "scroll");
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 && (t += e.length), e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (var n in this.position) e[t].applyStyle(n, this.position[n] + "px");
},
highlightAnchorPointChanged: function() {
this.addRemoveClass("pinDebug", this.highlightAnchorPoint);
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath && this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale), this.alignImage();
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : this.scale == "fit" ? (this.fitAlignment = "center", this.scale = Math.max(t, n)) : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
alignImage: function() {
if (this.fitAlignment && this.fitAlignment === "center") {
var e = this.getScrollBounds();
this.setScrollLeft(e.maxLeft / 2), this.setScrollTop(e.maxTop / 2);
}
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
var e = this.getBufferRange();
for (var t in e) this.loadImageView(e[t]);
},
getBufferRange: function() {
var e = [];
if (this.layout.containerBounds) {
var t = 1, n = this.layout.containerBounds, r, i, s, o, u, a;
o = this.index - 1, u = 0, a = n.width * t;
while (o >= 0 && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.unshift(o), o--;
o = this.index, u = 0, a = n.width * (t + 1);
while (o < this.images.length && u <= a) s = this.$["container" + o], u += s.width + s.marginWidth, e.push(o), o++;
}
return e;
},
reflow: function() {
this.inherited(arguments), this.loadNearby();
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? this.$["image" + e].src != this.images[e] && (this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadNearby(), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
var e = getBufferRange();
for (var t = 0; t < this.images.length; t++) enyo.indexOf(t, e) === -1 && this.$["image" + t] && this.$["image" + t].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// App.js

MarkReadTimer = "", gblUseJsonpRequest = !1, gblApiLevel = 0, enyo.kind({
name: "App",
kind: "FittableRows",
handlers: {
onmousemove: "handleGlobalMouseMove",
onmousedown: "handleGlobalMouseDown",
onmouseup: "handleGlobalMouseUp"
},
fit: !0,
components: [ {
kind: "Panels",
name: "viewPanels",
fit: !0,
classes: "panels-sample-sliding-panels",
arrangerKind: "CollapsingArranger",
wrap: !1,
components: [ {
name: "left",
style: "width: 240px",
showing: !1,
components: [ {
kind: "enyo.Scroller",
fit: !0,
components: [ {
name: "main",
classes: "nice-padding",
allowHtml: !0
} ]
} ]
}, {
name: "left2",
kind: "FittableRows",
classes: "panels-theme-light",
style: "width:260px; background-color:#fff;",
components: [ {
kind: "onyx.Toolbar",
components: [ {
content: "TT-RSS Reader"
}, {
fit: !0
}, {
kind: "onyx.ToggleIconButton",
name: "toggleUnread",
onChange: "clickRefresh",
style: " position:fixed; right:5px;",
value: !0,
src: "assets/menu-icon-bookmark.png"
} ]
}, {
name: "left3",
kind: "FittableRows",
fit: !0,
classes: "panels-theme-light",
components: [ {
kind: "Scroller",
touch: !0,
fit: !0,
horizontal: "hidden",
classes: "scroller-sample-scroller",
components: [ {
kind: "gts.DividerDrawer",
name: "categoryHeader",
caption: "Categories",
open: !0,
onChange: "resize",
components: [ {
kind: "Scroller",
touch: !0,
fit: !1,
horizontal: "hidden",
classes: "scroller-sample-scroller",
components: [ {
kind: "Repeater",
name: "categoryRepeater",
onSetupItem: "setupCategories",
fit: !0,
ontap: "clickCategory",
components: [ {
name: "categorylist",
classes: "repeater-sample-item",
style: "padding: 5px;nowr font-weight: bold;",
components: [ {
kind: "FittableColumns",
name: "Data1",
fit: !0,
classes: "fittable-sample-shadow",
style: "height: auto",
components: [ {
tag: "span",
name: "titel",
fit: !0,
style: "white-space:nowrap; text-align:left; margin-left:5px; overflow:hidden;"
}, {
tag: "span",
name: "unread",
fit: !1,
style: "width:50px; text-align:right; margin-left:2px; margin-right:2px; font-weight:normal;"
} ]
} ]
} ]
} ]
} ]
}, {
kind: "gts.DividerDrawer",
name: "feedHeader",
fit: !0,
caption: "Feeds",
open: !0,
onChange: "resize",
components: [ {
kind: "Scroller",
touch: !0,
fit: !1,
horizontal: "hidden",
classes: "scroller-sample-scroller",
components: [ {
kind: "Repeater",
name: "feedRepeater",
onSetupItem: "setupFeeds",
fit: !0,
ontap: "clickFeed",
components: [ {
name: "feedlist",
classes: "repeater-sample-item",
style: "padding: 5px; font-weight: bold;",
components: [ {
kind: "FittableColumns",
name: "Data1",
fit: !0,
classes: "fittable-sample-shadow",
style: "height: auto",
components: [ {
kind: "enyo.Image",
fit: !1,
name: "icon",
src: "assets/blankfeedicon.ico",
style: "height:32px; width:32px;"
}, {
tag: "span",
name: "titel",
fit: !0,
style: "width:auto; white-space:nowrap; text-align:left; margin-left:5px; padding-top:8px; overflow:hidden;"
}, {
tag: "span",
name: "unread",
fit: !1,
style: "width:50px; text-align:right; margin-left:2px; margin-right:2px; padding-top:8px; font-weight:normal;"
} ]
} ]
} ]
} ]
} ]
}, {
name: "left2blank",
fit: !0
} ]
} ]
}, {
kind: "onyx.Toolbar",
style: "background: #252525;",
components: [ {
kind: "onyx.Button",
content: "Setup",
ontap: "LoginTap"
}, {
kind: "onyx.Button",
content: "Add Feed",
ontap: "addFeedClick"
}, {
kind: "onyx.IconButton",
src: "assets/menu-icon-refresh.png",
ontap: "clickRefresh"
} ]
} ]
}, {
name: "middle",
kind: "FittableRows",
fit: !0,
style: "width:400px;",
classes: "panels-theme-light",
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "enyo.Image",
name: "feedTitleIcon",
fit: !1,
src: "",
style: "height:30px;"
}, {
name: "lblFeedTitle",
content: "Feed",
style: "font-size:1.2em; font-weight:bold;"
}, {
fit: !0
}, {
kind: "onyx.ToggleIconButton",
name: "toggleFeedUnread",
onChange: "UpdateFeedClick",
style: " position:fixed; right:5px;",
value: !0,
src: "assets/menu-icon-bookmark.png"
} ]
}, {
kind: "Scroller",
name: "articleScroller",
touch: !0,
fit: !0,
horizontal: "hidden",
classes: "scroller-sample-scroller",
components: [ {
kind: "Repeater",
name: "articleRepeater",
onSetupItem: "setupArticles",
fit: !0,
ontap: "clickItem",
onhold: "holdItem",
components: [ {
name: "item",
classes: "repeater-sample-item",
style: "border: 1px solid black; padding: 5px; font-weight: bold;",
components: [ {
kind: "FittableRows",
name: "Data1",
fit: !0,
classes: "fittable-sample-shadow",
style: "height: auto",
components: [ {
tag: "div",
name: "titel",
style: "width:100%; text-align:left;"
}, {
tag: "div",
name: "preview",
style: "width:100%; text-align:left; font-weight:normal;"
}, {
tag: "div",
name: "timestamp",
style: "width:100%; text-align:right; font-size:10px;"
} ]
} ]
} ]
} ]
}, {
fit: !0
}, {
kind: "FittableColumns",
name: "listviewtoolbar",
showing: !0,
style: "width:100%; height: 60px; background: #252525;",
components: [ {
kind: "enyo.Image",
name: "bb10listviewgrabber",
fit: !1,
src: "assets/bb10panelBack.png",
style: "height:60px;",
ontap: "bb10backmain"
}, {
style: "width: 10px"
}, {
kind: "FittableRows",
style: "height: 60px; background: #252525;",
components: [ {
style: "height: 14px"
}, {
kind: "FittableColumns",
style: "height: 32px; background: #252525;",
components: [ {
kind: "onyx.Grabber",
name: "listviewgrabber",
style: "height: 30px"
}, {
style: "width: 10px"
}, {
kind: "onyx.MenuDecorator",
style: "width: 100px",
onSelect: "MarkFeedReadClick",
components: [ {
kind: "onyx.Button",
content: "Mark"
}, {
kind: "onyx.Menu",
components: [ {
content: "read until current",
name: "current"
}, {
content: "list read",
name: "list"
}, {
content: "feed read",
name: "feed"
} ]
} ]
}, {
style: "width: 10px"
}, {
kind: "onyx.IconButton",
style: "height: 32px; margin-top: 15px",
src: "assets/menu-icon-refresh.png",
ontap: "UpdateFeedClick"
}, {
style: "width: 10px"
}, {
kind: "onyx.Button",
name: "FeedListPageUpButton",
content: "Up",
onmousedown: "FeedListPageUpDown",
onmouseup: "FeedListPageUpUp",
showing: !1,
style: "margin-left:0px; margin-right:0px; width:68px;"
}, {
style: "width: 10px"
}, {
kind: "onyx.Button",
name: "FeedListPageDownButton",
content: "Dwn",
onmousedown: "FeedListPageDownDown",
onmouseup: "FeedListPageDownUp",
showing: !1,
style: "margin-left:0px; margin-right:0px; width:68px;"
} ]
}, {
style: "height: 14px"
} ]
} ]
} ]
}, {
name: "body",
kind: "FittableRows",
fit: !0,
classes: "panels-theme-light",
components: [ {
name: "articleViewTitle",
content: "",
style: "padding: 5px; font-weight: bold;",
ontap: "enablePanels",
ondragfinish: "titleDragFinish",
ondragstart: "titleDragStart"
}, {
kind: "FittableColumns",
fit: !1,
style: "height: 40px; padding: 5px",
ontap: "enablePanels",
components: [ {
kind: "enyo.Image",
name: "articleTitleIcon",
fit: !1,
src: "",
style: "height:30px; width:30px;"
}, {
name: "articleViewTitle2",
content: "",
style: "font-size: 0.8em; padding: 5px;"
} ]
}, {
content: "",
style: "border: 1px solid silver;"
}, {
kind: "Scroller",
name: "articlePreviewScroller",
horizontal: "hidden",
fit: !0,
touch: !0,
ondragfinish: "titleDragFinish",
ondragstart: "titleDragStart",
components: [ {
name: "articlePreview",
classes: "panels-sample-sliding-content",
allowHtml: !0,
content: ""
} ]
}, {
kind: "Scroller",
name: "articleViewScroller",
horizontal: "hidden",
fit: !0,
touch: !0,
ondragfinish: "titleDragFinish",
ondragstart: "titleDragStart",
components: [ {
name: "articleView",
kind: "MyAjaxWebView",
classes: "panels-sample-sliding-content",
allowHtml: !0,
content: ""
} ]
}, {
kind: "FittableColumns",
name: "articleviewtoolbar",
showing: !0,
style: "width:100%; height: 60px; background: #252525;",
components: [ {
kind: "enyo.Image",
name: "bb10articleviewgrabber",
fit: !1,
src: "assets/bb10panelBack.png",
style: "height:60px;",
ontap: "enablePanels"
}, {
kind: "onyx.Grabber",
name: "grabberArticleView",
ontap: "enablePanels"
}, {
kind: "FittableRows",
style: "height: 60px; background: #252525;",
components: [ {
style: "height: 14px"
}, {
kind: "FittableColumns",
style: "height: 32px; background: #252525;",
components: [ {
style: "width: 5px"
}, {
kind: "onyx.Button",
name: "btnUnlockPanels",
content: "<-",
ontap: "enablePanels",
showing: !1
}, {
style: "width: 5px"
}, {
kind: "onyx.Button",
name: "btnPrevArticle",
style: "width: 40px",
content: "<",
ontap: "prevArticle"
}, {
style: "width: 5px"
}, {
kind: "onyx.Checkbox",
style: "height: 29px",
name: "chkArticleRead",
onchange: "toggleArticleRead",
checked: !1
}, {
kind: "onyx.IconButton",
name: "bb10btnread",
src: "assets/bb10readoff.png",
showing: !0,
ontap: "markreadbb10"
}, {
style: "width: 8px"
}, {
kind: "FittableRows",
style: "background: #252525; width: 23px; padding-right: 5px;",
components: [ {
name: "lblArticles1",
align: "center",
style: "font-size: 11px; text-align: center; color: white; height: 20px; padding-top: 1px; padding-bottom: 1px; vertical-align: top;"
}, {
name: "lblArticles2",
align: "center",
style: "font-size: 11px; text-align: center; color: white; height: 20px; padding-top: 1px; padding-bottom: 1px; vertical-align: bottom;"
}, {
style: "height: 3px"
} ]
}, {
kind: "onyx.MenuDecorator",
onSelect: "shareArticle",
components: [ {
kind: "onyx.Button",
name: "btnshare",
content: "..."
}, {
kind: "onyx.Menu",
components: [ {
content: "Twitter",
name: "shareTW"
}, {
content: "Facebook",
name: "shareFB"
}, {
content: "App.net"
}, {
content: "G+"
} ]
} ]
}, {
kind: "onyx.IconButton",
name: "bb10btnshare",
src: "assets/bb10-share32.png",
showing: !0,
ontap: "shareArticlebb10"
}, {
style: "width: 8px"
}, {
kind: "onyx.IconButton",
name: "btnbrowser",
src: "assets/browser2.png",
ontap: "openArticle"
}, {
style: "width: 8px"
}, {
kind: "onyx.IconButton",
name: "iconStarred",
src: "assets/starred-footer.png",
ontap: "toggleArticleStarred"
}, {
style: "width: 8px"
}, {
kind: "onyx.IconButton",
name: "iconPublished",
src: "assets/published-off.png",
ontap: "toggleArticlePublished"
}, {
style: "width: 8px"
}, {
kind: "onyx.Button",
name: "btnFullArticle",
content: "Full",
ontap: "showFullArticle"
}, {
style: "width: 8px"
}, {
kind: "onyx.Button",
name: "btnNextArticle",
style: "width: 40px",
content: ">",
ontap: "nextArticle"
} ]
}, {
style: "height: 14px"
} ]
} ]
} ]
} ]
}, {
name: "loadbar",
content: "",
classes: "squaresWaveG",
style: "position: relative; width: auto; height:5px",
showing: !1
}, {
name: "loadbarBlank",
content: "",
style: "position: relative; width: auto; height:5px; background: #000000"
}, {
kind: enyo.Signals,
onkeyup: "handleKeyUp",
onkeydown: "handleKeyDown",
onkeypress: "handleKeyPress"
}, {
kind: "enyo.ApplicationEvents",
onBack: "goBack"
}, {
kind: "onyx.Toolbar",
showing: !1,
components: [ {
kind: "onyx.Button",
content: "Categories",
ontap: "getCategories"
}, {
kind: "onyx.Button",
content: "Get feeds:",
ontap: "getFeeds"
}, {
kind: "onyx.Input",
name: "catID",
style: "width: 50px",
placeholder: "CatID",
onchange: "getFeeds"
}, {
kind: "onyx.Button",
content: "Get content:",
ontap: "getHeadlines"
}, {
kind: "onyx.Input",
name: "feedID",
style: "width: 50px",
placeholder: "FeedID",
onchange: "getHeadlines"
}, {
kind: "onyx.Button",
content: "Get article:",
ontap: "getArticle"
}, {
kind: "onyx.Input",
name: "articleID",
style: "width: 50px",
placeholder: "ID",
onchange: "getArticle"
} ]
}, {
name: "LoginPopup",
style: "width:320px; height",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
autoDismiss: !1,
components: [ {
kind: "Scroller",
style: "height: 280px",
touch: !0,
fit: !0,
horizontal: "hidden",
classes: "scroller-sample-scroller",
components: [ {
kind: "onyx.Groupbox",
style: "width:100%; background-color:#EAEAEA;",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Server (with http:// or https://)",
name: "serverAddress",
value: "http://",
style: "width:100%;"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
name: "serverUser",
placeholder: "Username",
value: "",
style: "width:100%;"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
type: "password",
name: "serverPassword",
placeholder: "Enter password",
value: "",
style: "width:100%;"
} ]
} ]
}, {
kind: "FittableColumns",
style: "width:100%; margin-top:5px;",
components: [ {
kind: "onyx.PickerDecorator",
style: "width:100%;",
components: [ {
style: "width:100%;",
classes: "onyx-blue"
}, {
kind: "onyx.Picker",
name: "pickViewMode",
onSelect: "handleViewModeChange",
components: [ {
content: "Standard 3 Columns View",
value: "0",
name: "VM0",
active: !0
}, {
content: "Alternative 2 Columns view",
value: "1",
name: "VM1"
}, {
content: "Alternative 3 Columns view",
value: "2",
name: "VM2"
} ]
} ]
} ]
}, {
kind: "onyx.Checkbox",
name: "useJsonpRequest",
content: "Use JsonpRequest",
style: "width:100%; height:24px; padding:10px 0px 0px 40px;"
}, {
kind: "onyx.Checkbox",
name: "autoLoadFirstFeed",
content: "Autoload 1st feed",
style: "width:100%; height:24px; padding:10px 0px 0px 40px;",
onchange: "AutoLoadChanged"
}, {
kind: "onyx.Checkbox",
name: "autoLoadAllArticles",
content: "Autoload 'all articles' feed",
style: "width:100%; height:24px; padding:10px 0px 0px 40px;",
onchange: "AutoLoadChanged"
}, {
kind: "onyx.Checkbox",
name: "autoLockPanels",
checked: !0,
content: "Swipeable article view (on phones)",
style: "width:100%; height:24px; padding:10px 0px 0px 40px;"
}, {
kind: "FittableColumns",
style: "height: auto",
components: [ {
kind: "onyx.PickerDecorator",
components: [ {}, {
kind: "onyx.Picker",
name: "pickMarkReadTimeout",
onSelect: "changeMarkReadTimeout",
components: [ {
content: "1s",
value: 1e3,
name: "T1s"
}, {
content: "2s",
value: 2e3,
name: "T2s",
active: !0
}, {
content: "3s",
value: 3e3,
name: "T3s"
}, {
content: "5s",
value: 5e3,
name: "T5s"
}, {
content: "off",
value: 0,
name: "Toff"
} ]
} ]
}, {
content: "Auto mark read timer",
style: "padding-left: 10px; vertical-align: middle"
} ]
} ]
}, {
kind: "FittableColumns",
style: "width:100%; margin-top:5px;",
components: [ {
kind: "onyx.Button",
content: "Save",
ontap: "LoginSave",
style: "width:50%;"
}, {
kind: "onyx.Button",
content: "Cancel",
ontap: "LoginClose",
style: "width:50%;"
} ]
} ]
}, {
name: "AddFeedPopup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
autoDismiss: !1,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
content: "Add a new feed into:"
}, {
name: "AddFeedCategory",
content: ""
}, {
kind: "onyx.Groupbox",
style: "width:100%; background-color:#EAEAEA;",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "FeedURL",
name: "AddFeedURL",
value: "",
selectOnFocus: !0,
style: "width:100%;"
} ]
} ]
}, {
tag: "div",
style: "height:10px;"
}, {
kind: "onyx.Button",
content: "Add",
ontap: "addFeedSave",
style: "width:100%;"
}, {
tag: "div",
style: "height:2px;"
}, {
kind: "onyx.Button",
content: "Cancel",
ontap: "addFeedClose",
style: "width:100%;"
} ]
}, {
name: "MarkFeedReadPopup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
components: [ {
content: "Really mark feed as read?"
}, {
tag: "div",
style: "height:10px;"
}, {
kind: "onyx.Button",
classes: "onyx-negative",
content: "Yes",
ontap: "MarkFeedRead",
style: "width:100%;"
}, {
tag: "div",
style: "height:2px;"
}, {
kind: "onyx.Button",
content: "No",
ontap: "MarkFeedReadClose",
style: "width:100%;"
} ]
} ],
FeedID: [],
FeedUnread: [],
FeedTitle: [],
FeedIcon: [],
CategoryID: [],
CategoryUnread: [],
CategoryTitle: [],
currentCategoryIndex: 0,
currentFeedIndex: 0,
currentFeedID: "",
currentFeed: "",
Articles: [],
ArticleData: [],
ArticleID: [],
ArticleURL: [],
ArticleUnread: [],
ArticleStarred: [],
ttrssURL: null,
ttrssUser: null,
ttrssPassword: null,
ttrssIconPath: null,
ttrss_SID: "",
ttrssAutoMarkRead: "2000",
JustStarted: !0,
staredon: "assets/starred-footer-on.png",
staredoff: "assets/starred-footer.png",
publishedon: "assets/published-on.png",
publishedoff: "assets/published-off.png",
ViewMode: "0",
AutoLoadFirstFeed: !1,
AutoLockPanels: !0,
AutoLoadAllArticles: !1,
dragStartPanelIndex: null,
rendered: function(e, t) {
this.inherited(arguments), window.setTimeout(enyo.bind(this, "startapp"), 10);
},
create: function() {
this.inherited(arguments);
},
startapp: function(e, t) {
gblBB10 = !0, BetaDate = "20131012", jetzt = new Date, Tag = jetzt.getDate(), Tag = Tag < 10 ? "0" + Tag : Tag, Monat = jetzt.getMonth() + 1, Monat = Monat < 10 ? "0" + Monat : Monat, Jahr = jetzt.getYear() + 1900, Datum = Jahr + Monat + Tag, Datum > BetaDate && (console.log("BETA abgelaufen"), window.close()), this.ttrssURL = localStorage.getItem("ttrssurl"), this.ttrssPassword = localStorage.getItem("ttrsspassword"), this.ttrssUser = localStorage.getItem("ttrssuser"), this.ttrssAutoMarkRead = localStorage.getItem("ttrssautomarkreadtimeout"), this.ViewMode = localStorage.getItem("ViewMode"), this.AutoLoadFirstFeed = localStorage.getItem("AutoLoadFirstFeed") == "true", this.AutoLoadAllArticles = localStorage.getItem("AutoLoadAllArticles") == "true", this.AutoLockPanels = localStorage.getItem("AutoLockPanels") == "true", gblUseJsonpRequest = localStorage.getItem("UseJsonpRequest") == "true", this.changeViewMode(), this.ttrssURL == null ? this.$.LoginPopup.show() : ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError")), window.innerWidth < 1024 ? (this.$.btnFullArticle.setShowing(!1), window.innerWidth > 400 ? (this.$.categoryRepeater.applyStyle("font-size", "1.8em"), this.$.feedRepeater.applyStyle("font-size", "1.8em"), this.$.articleRepeater.applyStyle("font-size", "1.8em"), this.$.articlePreviewScroller.applyStyle("font-size", "1.8em"), this.$.articleViewScroller.applyStyle("font-size", "1.8em"), this.$.articleViewTitle.applyStyle("font-size", "2.0em"), this.$.articleViewTitle2.applyStyle("font-size", "1.6em")) : (this.$.categoryRepeater.applyStyle("font-size", "1.2em"), this.$.feedRepeater.applyStyle("font-size", "1.2em"), this.$.articleRepeater.applyStyle("font-size", "1.2em"), this.$.articlePreviewScroller.applyStyle("font-size", "1.2em"), this.$.articleViewScroller.applyStyle("font-size", "1.2em"), this.$.articleViewTitle.applyStyle("font-size", "1.4em"), this.$.articleViewTitle2.applyStyle("font-size", "1.0em"))) : (this.$.viewPanels.layout.peekWidth = 40, this.ViewMode == "0" ? this.$.btnFullArticle.setShowing(!0) : this.$.btnFullArticle.setShowing(!1)), this.AutoLockPanels && (this.$.btnNextArticle.setShowing(!1), this.$.btnPrevArticle.setShowing(!1)), gblBB10 ? (this.$.bb10articleviewgrabber.setShowing(!0), this.$.btnUnlockPanels.setShowing(!1), this.$.listviewgrabber.setShowing(!1), this.$.bb10listviewgrabber.setShowing(!0), this.$.bb10btnshare.setShowing(!0), this.$.btnshare.setShowing(!1), this.$.bb10btnread.setShowing(!0), this.$.chkArticleRead.setShowing(!1), this.$.chkArticleRead.applyStyle("height", "20px"), this.staredon = "assets/bb10staron.png", this.staredoff = "assets/bb10staroff.png", this.$.iconStarred.setSrc(this.staredoff), this.publishedon = "assets/bb10publishon.png", this.publishedoff = "assets/bb10publishoff.png", this.$.btnbrowser.setSrc("assets/bb10browser.png")) : (this.$.bb10articleviewgrabber.setShowing(!1), this.$.btnUnlockPanels.setShowing(!0), this.$.listviewgrabber.setShowing(!0), this.$.bb10listviewgrabber.setShowing(!1), this.$.bb10btnshare.setShowing(!1), this.$.btnshare.setShowing(!0), this.$.bb10btnread.setShowing(!1), this.$.chkArticleRead.setShowing(!0));
},
resizeHandler: function() {
this.inherited(arguments), window.innerWidth < 1024 ? (this.$.btnFullArticle.setShowing(!1), window.innerWidth > 400 ? (this.$.categoryRepeater.applyStyle("font-size", "1.8em"), this.$.feedRepeater.applyStyle("font-size", "1.8em"), this.$.articleRepeater.applyStyle("font-size", "1.8em"), this.$.articlePreviewScroller.applyStyle("font-size", "1.8em"), this.$.articleViewScroller.applyStyle("font-size", "1.8em"), this.$.articleViewTitle.applyStyle("font-size", "2.0em"), this.$.articleViewTitle2.applyStyle("font-size", "1.6em")) : (this.$.categoryRepeater.applyStyle("font-size", "1.2em"), this.$.feedRepeater.applyStyle("font-size", "1.2em"), this.$.articleRepeater.applyStyle("font-size", "1.2em"), this.$.articlePreviewScroller.applyStyle("font-size", "1.2em"), this.$.articleViewScroller.applyStyle("font-size", "1.2em"), this.$.articleViewTitle.applyStyle("font-size", "1.4em"), this.$.articleViewTitle2.applyStyle("font-size", "1.0em"))) : (this.$.viewPanels.layout.peekWidth = 40, this.ViewMode == "0" ? this.$.btnFullArticle.setShowing(!0) : this.$.btnFullArticle.setShowing(!1));
},
resize: function() {
this.$.left2.reflow(), this.$.middle.reflow(), this.$.left2blank.reflow(), this.$.feedRepeater.reflow(), this.$.body.reflow(), this.resized();
},
LoginClose: function(e, t) {
this.$.LoginPopup.hide();
},
LoginSave: function(e, t) {
this.ttrssURL = this.$.serverAddress.getValue(), this.ttrssUser = this.$.serverUser.getValue(), this.ttrssPassword = this.$.serverPassword.getValue(), this.ViewMode = this.$.pickViewMode.getSelected().value, this.AutoLoadFirstFeed = this.$.autoLoadFirstFeed.getValue(), this.AutoLockPanels = this.$.autoLockPanels.getValue(), this.AutoLoadAllArticles = this.$.autoLoadAllArticles.getValue(), gblUseJsonpRequest = this.$.useJsonpRequest.getValue(), localStorage.setItem("ttrssurl", this.ttrssURL), localStorage.setItem("ttrssuser", this.ttrssUser), localStorage.setItem("ttrsspassword", this.ttrssPassword), localStorage.setItem("ViewMode", this.ViewMode), localStorage.setItem("AutoLoadFirstFeed", this.AutoLoadFirstFeed), localStorage.setItem("AutoLoadAllArticles", this.AutoLoadAllArticles), localStorage.setItem("AutoLockPanels", this.AutoLockPanels), localStorage.setItem("UseJsonpRequest", gblUseJsonpRequest), localStorage.setItem("ttrssautomarkreadtimeout", this.ttrssAutoMarkRead), ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError")), this.$.LoginPopup.hide();
},
LoginTap: function(e, t) {
this.$.serverAddress.setValue(this.ttrssURL), this.$.serverUser.setValue(this.ttrssUser), this.$.serverPassword.setValue(this.ttrssPassword);
switch (this.ViewMode) {
case "0":
this.$.pickViewMode.setSelected(this.$.VM0);
break;
case "1":
this.$.pickViewMode.setSelected(this.$.VM1);
break;
case "2":
this.$.pickViewMode.setSelected(this.$.VM2);
}
this.$.autoLoadFirstFeed.setValue(this.AutoLoadFirstFeed), this.$.autoLoadAllArticles.setValue(this.AutoLoadAllArticles), this.$.autoLockPanels.setValue(this.AutoLockPanels);
switch (this.ttrssAutoMarkRead) {
case "1000":
this.$.pickMarkReadTimeout.setSelected(this.$.T1s);
break;
case "2000":
this.$.pickMarkReadTimeout.setSelected(this.$.T2s);
break;
case "3000":
this.$.pickMarkReadTimeout.setSelected(this.$.T3s);
break;
case "5000":
this.$.pickMarkReadTimeout.setSelected(this.$.T5s);
break;
case "0":
this.$.pickMarkReadTimeout.setSelected(this.$.Toff);
}
this.$.LoginPopup.show();
},
handleViewModeChange: function(e, t) {
this.ViewMode = t.selected.value, this.selectFeed(this.currentFeedIndex), this.changeViewMode();
},
changeViewMode: function(e, t) {
this.ViewMode == "1" ? (this.$.articlePreviewScroller.setShowing(!0), this.$.articleViewScroller.setShowing(!1), this.$.body.setShowing(!1), gblBB10 ? (this.$.FeedListPageUpButton.setShowing(!1), this.$.FeedListPageDownButton.setShowing(!1)) : (this.$.FeedListPageUpButton.setShowing(!0), this.$.FeedListPageDownButton.setShowing(!0))) : this.ViewMode == "2" ? (this.$.articlePreviewScroller.setShowing(!1), this.$.articleViewScroller.setShowing(!0), this.$.body.setShowing(!0), this.$.FeedListPageUpButton.setShowing(!1), this.$.FeedListPageDownButton.setShowing(!1)) : (this.$.articlePreviewScroller.setShowing(!0), this.$.articleViewScroller.setShowing(!1), this.$.body.setShowing(!0), this.$.FeedListPageUpButton.setShowing(!1), this.$.FeedListPageDownButton.setShowing(!1));
},
changeMarkReadTimeout: function(e, t) {
this.ttrssAutoMarkRead = t.selected.value;
},
processLoginSuccess: function(e) {
this.$.LoginPopup.hide(), this.ttrss_SID = e.sessionid, this.$.main.setContent("LOGIN SUCCESSS SID: " + e.sessionid), this.getCategories(), ttrssGetConfig(this.ttrssURL, this.ttrss_SID, enyo.bind(this, "processGetConfigSuccess"), enyo.bind(this, "processGetConfigError")), ttrssGetApiLevel(this.ttrssURL, this.ttrss_SID, enyo.bind(this, "processGetApiLevelSuccess"), enyo.bind(this, "processGetApiLevelError"));
var t = this.$.toggleUnread.getValue();
this.AutoLoadAllArticles && (this.$.lblFeedTitle.setContent("All articles"), this.$.feedTitleIcon.setShowing(!1), ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, t, -4, !1, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError")), window.innerWidth < 1024 && this.$.viewPanels.setIndex(2));
},
processLoginError: function(e) {
console.error("LOGIN Error: " + e.error), alert("LOGIN Error: " + e.error), this.$.main.setContent("LOGIN ERROR: " + e.error);
},
clickRefresh: function(e, t) {
console.error("clickRefresh"), this.getCategories();
},
getCategories: function(e) {
this.setLoadbar(!0);
var t = this.$.toggleUnread.getValue();
this.$.toggleFeedUnread.setValue(t), ttrssGetCategories(this.ttrssURL, this.ttrss_SID, t, enyo.bind(this, "processGetCategoriesSuccess"), enyo.bind(this, "processGetCategoriesError"));
},
processGetCategoriesSuccess: function(e) {
console.error("processGetCategoriesSuccess");
if (e.length == 0) {
console.log("GetCategories: NO Categories"), this.setLoadbar(!1), alert("Sorry, no news!"), this.setLoadbar(!1);
return;
}
var t = "";
this.CategoryTitle.length = 0, this.CategoryUnread.length = 0, this.CategoryID.length = 0;
var n = 0, r = null;
for (var i = 0; i < e.length; i++) t = t + "#" + e[i].id + " " + e[i].title + " - " + e[i].unread + "<br>", this.CategoryTitle[i] = html_entity_decode(e[i].title), this.CategoryUnread[i] = e[i].unread, this.CategoryID[i] = e[i].id, e[i].id > 0 && n++, e[i].id == 0 && (r = i);
this.$.categoryRepeater.setCount(this.CategoryTitle.length);
if (this.AutoLoadAllArticles) {
this.setLoadbar(!0);
var s = this.$.toggleUnread.getValue();
ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, s, -1, enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
} else this.CategoryTitle.length > 0 && (n ? this.selectCategory(0) : (this.$.categoryHeader.toggleOpen(!1), this.selectCategory(r))), this.CategoryTitle.length > 0 && n && this.selectCategory(0);
},
processGetCategoriesError: function(e) {
console.error("processGetCategoriesError"), console.error(e), alert(e), this.setLoadbar(!1);
},
getFeeds: function(e, t) {
this.setLoadbar(!0);
var n = this.$.toggleUnread.getValue();
ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, n, this.$.catID.getValue(), enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
},
processGetFeedsSuccess: function(e) {
this.FeedID.length = 0, this.FeedUnread.length = 0, this.FeedTitle.length = 0, ObjLength = e.length - 1;
var t = 0;
this.FeedTitle[0] = this.CategoryTitle[this.currentCategoryIndex], this.FeedIcon[0] = !1, this.FeedID[0] = this.CategoryID[this.currentCategoryIndex];
for (var n = 0; n < e.length; n++) this.FeedTitle[n + 1] = html_entity_decode(e[n].title), this.FeedUnread[n + 1] = e[n].unread, this.FeedID[n + 1] = e[n].id, this.FeedIcon[n + 1] = e[n].has_icon, t += e[n].unread;
this.FeedUnread[0] = t, this.$.feedRepeater.setCount(this.FeedTitle.length), this.AutoLoadFirstFeed && this.selectFeed(0);
},
processGetFeedsError: function(e) {
console.log(e), this.setLoadbar(!1);
},
processGetConfigSuccess: function(e) {
this.ttrssIconPath = this.ttrssURL + "/" + e.icons_url + "/";
},
processGetConfigError: function(e) {
console.log(e);
},
processGetApiLevelSuccess: function(e) {
gblApiLevel = e.level;
},
processGetApiLevelError: function(e) {
console.log(e);
},
getHeadlines: function(e, t) {
this.setLoadbar(!0);
var n = this.$.toggleFeedUnread.getValue();
ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, n, this.$.feedID.getValue(), !1, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
},
processGetHeadlinesSuccess: function(e) {
console.log(e.length), this.Articles.length = 0, this.ArticleData.length = 0, this.ArticleID.length = 0, this.ArticleURL.length = 0, this.ArticleUnread.length = 0, this.ArticleStarred.length = 0;
if (e.length == 0) {
console.log("GetHeadlines: NO HEADLINES"), this.setLoadbar(!1), this.$.articleRepeater.setCount(0), this.$.articleScroller.setScrollTop(0), this.$.viewPanels.setIndex(1), this.clickRefresh();
return;
}
for (var t = 0; t < e.length; t++) this.Articles[t] = html_entity_decode(e[t].title), this.ArticleID[t] = e[t].id, this.ArticleURL[t] = e[t].link, this.ArticleUnread[t] = e[t].unread, this.ArticleStarred[t] = e[t].marked, ttrssGetArticle(this.ttrssURL, this.ttrss_SID, e[t].id, enyo.bind(this, function(e, t) {
this.ArticleData[e] = t, (this.ViewMode == "1" || this.ViewMode == "2") && this.$.articleRepeater.renderRow(e);
}, t), enyo.bind(this, function() {}));
this.$.articleRepeater.setCount(this.Articles.length), this.$.articleScroller.setScrollTop(0);
},
processGetHeadlinesError: function(e) {
console.log(e), this.setLoadbar(!1);
},
getArticle: function(e, t) {
this.setLoadbar(!0), ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.$.articleID.getValue(), enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
},
processGetArticleSuccess: function(e) {
var t = "", n = e[0].updated, r = new Date(n * 1e3), i = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"), s = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"), o = i[r.getDay()] + " " + s[r.getMonth()] + " " + r.getDate() + ", " + r.getFullYear() + " " + r.getHours() + ":" + format_number(r.getMinutes(), 2, "0");
this.$.articleViewTitle.setContent(html_entity_decode(e[0].title)), this.$.articleViewTitle2.setContent(html_entity_decode(e[0].author) + " - " + o), this.$.articleViewScroller.setShowing(!1), this.$.articlePreviewScroller.setShowing(!0), this.$.articlePreview.setContent(e[0].content), this.$.articlePreviewScroller.setScrollTop(0), this.$.articlePreviewScroller.setScrollLeft(0), e[0].unread ? (this.$.chkArticleRead.setChecked(!1), this.$.bb10btnread.setSrc("assets/bb10readoff.png"), clearTimeout(this.MarkReadTimer), this.ttrssAutoMarkRead != "0" && (this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), this.ttrssAutoMarkRead))) : (this.$.chkArticleRead.setChecked(!0), this.$.bb10btnread.setSrc("assets/bb10readon.png")), e[0].marked ? this.$.iconStarred.setSrc(this.staredon) : this.$.iconStarred.setSrc(this.staredoff), e[0].published ? this.$.iconPublished.setSrc(this.publishedon) : this.$.iconPublished.setSrc(this.publishedoff), this.$.lblArticles1.setContent(this.RecentArticleIndex + 1), this.$.lblArticles2.setContent(this.Articles.length), this.$.articleTitleIcon.setSrc(this.ttrssIconPath + e[0].feed_id + ".ico"), this.resize(), this.setLoadbar(!1);
},
processGetFullArticleSuccess: function(e) {
var t = this.ArticleData[this.RecentArticleIndex], n = "", r = t[0].updated, i = new Date(r * 1e3), s = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"), o = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"), u = s[i.getDay()] + " " + o[i.getMonth()] + " " + i.getDate() + ", " + i.getFullYear() + " " + i.getHours() + ":" + format_number(i.getMinutes(), 2, "0");
this.$.articleViewTitle.setContent(html_entity_decode(t[0].title)), this.$.articleViewTitle2.setContent(html_entity_decode(t[0].author) + " - " + u), this.$.articlePreviewScroller.setShowing(!1), this.$.articleViewScroller.setShowing(!0), this.$.articleView.call(this.ArticleURL[this.RecentArticleIndex], e), this.$.articleViewScroller.setScrollTop(0), this.$.articleViewScroller.setScrollLeft(0), t[0].unread ? (this.$.chkArticleRead.setChecked(!1), clearTimeout(this.MarkReadTimer), this.ttrssAutoMarkRead != "0" && (this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), this.ttrssAutoMarkRead))) : this.$.chkArticleRead.setChecked(!0), t[0].marked ? this.$.iconStarred.setSrc(this.staredon) : this.$.iconStarred.setSrc(this.staredoff), t[0].published ? this.$.iconPublished.setSrc(this.publishedon) : this.$.iconPublished.setSrc(this.publishedoff), this.$.lblArticles1.setContent(this.RecentArticleIndex + 1), this.$.lblArticles2.setContent(this.Articles.length), this.$.articleTitleIcon.setSrc(this.ttrssIconPath + t[0].feed_id + ".ico"), this.resize(), this.setLoadbar(!1);
},
processGetArticleError: function(e) {
console.log(e), this.setLoadbar(!1);
},
TimedMarkRead: function() {
this.MarkArticleRead(), this.$.chkArticleRead.setChecked(!0), clearTimeout(this.MarkReadTimer);
},
toggleArticleRead: function(e, t) {
var n = this.$.chkArticleRead.getValue();
n ? this.MarkArticleRead() : this.MarkArticleUnread();
},
markreadbb10: function() {
var e = this.$.bb10btnread.src;
e == "assets/bb10readoff.png" ? (this.$.chkArticleRead.setValue(!0), this.MarkArticleRead()) : (this.$.chkArticleRead.setValue(!1), this.MarkArticleUnread());
},
MarkArticleRead: function() {
ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !1, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError")), this.ArticleUnread[this.RecentArticleIndex] = !1, this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("font-weight", "normal"), this.$.articleRepeater.children[this.RecentArticleIndex].$.preview.applyStyle("color", "#999999"), this.$.bb10btnread.setSrc("assets/bb10readon.png");
},
MarkArticleUnread: function() {
ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !0, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError")), this.ArticleUnread[this.RecentArticleIndex] = !0, this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("font-weight", "bold"), this.$.articleRepeater.children[this.RecentArticleIndex].$.preview.applyStyle("color", "#333333"), this.$.bb10btnread.setSrc("assets/bb10readoff.png");
},
processMarkArticleReadSuccess: function(e) {},
processMarkArticleReadError: function(e) {},
toggleArticleStarred: function(e, t) {
console.log(this.staredon), this.$.iconStarred.src == this.staredoff ? (ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !0, enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError")), this.$.iconStarred.setSrc(this.staredon)) : (ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !1, enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError")), this.$.iconStarred.setSrc(this.staredoff));
},
toggleArticleStarredList: function(e, t) {
this.ArticleStarred[t.index] ? (ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[t.index], !1, enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError")), this.ArticleStarred[t.index] = !1, e.setSrc("assets/starred-footer32.png")) : (ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[t.index], !0, enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError")), this.ArticleStarred[t.index] = !0, e.setSrc("assets/starred-footer32-on.png"));
},
processMarkArticleStarredSuccess: function(e) {},
processMarkArticleStarredError: function(e) {},
toggleArticlePublished: function(e, t) {
this.$.iconPublished.src == this.publishedoff ? (console.log("PUBLISH"), ttrssPublishArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !0, enyo.bind(this, "processPublishArticleSuccess"), enyo.bind(this, "processPublishArticleError")), this.$.iconPublished.setSrc(this.publishedon)) : (console.log("UNPUBLISH"), ttrssPublishArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !1, enyo.bind(this, "processPublishArticleSuccess"), enyo.bind(this, "processPublishArticleError")), this.$.iconPublished.setSrc(this.publishedoff));
},
processPublishArticleSuccess: function(e) {},
processPublishArticleError: function(e) {},
setupCategories: function(e, t) {
var n = t.index, r = t.item;
typeof r != "undefined" && (n == this.currentCategoryIndex ? (r.$.titel.applyStyle("font-weight", "bold"), r.$.unread.applyStyle("font-weight", "bold")) : (r.$.titel.applyStyle("font-weight", "normal"), r.$.unread.applyStyle("font-weight", "normal")), r.$.titel.setContent(this.CategoryTitle[n]), r.$.unread.setContent(this.CategoryUnread[n])), this.resize();
},
setupFeeds: function(e, t) {
var n = t.index, r = t.item;
n == this.currentFeedIndex ? (r.$.titel.applyStyle("font-weight", "bold"), r.$.unread.applyStyle("font-weight", "bold")) : (r.$.titel.applyStyle("font-weight", "normal"), r.$.unread.applyStyle("font-weight", "normal")), this.FeedIcon[n] && r.$.icon.setSrc(this.ttrssIconPath + this.FeedID[n] + ".ico"), r.$.unread.setContent(this.FeedUnread[n]), r.$.titel.setContent(this.FeedTitle[n]), this.resize(), n + 1 == this.FeedID.length && this.setLoadbar(!1);
},
setupArticles: function(e, t) {
var n = t.index, r = t.item;
r.$.titel.setContent(this.Articles[n]);
if (this.ArticleData.length > n) {
var i = this.ArticleData[n];
r.$.preview.setContent(stripHTML(html_entity_decode(i[0].content)));
var s = i[0].updated, o = new Date(s * 1e3), u = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"), a = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"), f = u[o.getDay()] + " " + a[o.getMonth()] + " " + o.getDate() + ", " + o.getFullYear() + " " + o.getHours() + ":" + format_number(o.getMinutes(), 2, "0");
r.$.timestamp.setContent(f);
}
this.ArticleUnread[n] ? (r.$.titel.applyStyle("font-weight", "bold"), r.$.preview.applyStyle("color", "#333333")) : (r.$.titel.applyStyle("font-weight", "normal"), r.$.preview.applyStyle("color", "#999999")), n + 1 == this.Articles.length && this.setLoadbar(!1);
},
clickCategory: function(e, t) {
this.selectCategory(t.index);
},
selectCategory: function(e) {
this.setLoadbar(!0);
var t = this.currentCategoryIndex;
this.currentCategoryIndex = e, this.$.categoryRepeater.renderRow(t), this.$.categoryRepeater.renderRow(this.currentCategoryIndex);
var n = this.$.toggleUnread.getValue();
ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, n, this.CategoryID[e], enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError")), this.$.viewPanels.setIndex(1);
},
clickFeed: function(e, t) {
this.selectFeed(t.index);
},
selectFeed: function(e) {
this.setLoadbar(!0);
var t = this.currentFeedIndex;
this.currentFeedIndex = e, this.$.feedRepeater.renderRow(t), this.$.feedRepeater.renderRow(this.currentFeedIndex), this.$.lblFeedTitle.setContent(this.FeedTitle[e]);
if (this.FeedIcon[e]) {
var n = this.ttrssIconPath + this.FeedID[e] + ".ico";
this.$.feedTitleIcon.setShowing(!0), this.$.feedTitleIcon.setSrc(n);
} else this.$.feedTitleIcon.setShowing(!1);
var r = this.$.toggleFeedUnread.getValue(), i = !1;
e == "0" && (i = !0), ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, r, this.FeedID[e], i, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError")), window.innerWidth < 1024 && this.$.viewPanels.setIndex(2);
},
addFeedClick: function(e, t) {
this.$.AddFeedCategory.setContent(this.CategoryTitle[this.currentCategoryIndex]), this.$.AddFeedPopup.show();
},
addFeedSave: function(e, t) {
ttrssSubscribeToFeed(this.ttrssURL, this.ttrss_SID, this.$.AddFeedURL.getValue(), this.CategoryID[this.currentCategoryIndex], enyo.bind(this, "addFeedSuccess"), enyo.bind(this, "addFeedError")), this.$.AddFeedPopup.hide();
},
addFeedClose: function(e, t) {
this.$.AddFeedPopup.hide();
},
addFeedSuccess: function(e) {
this.getCategories();
},
addFeedError: function(e) {
console.log(e), this.$.main.setContent(e);
},
MarkFeedReadClick: function(e, t) {
switch (t.originator.name) {
case "current":
var n = 0, r = 0;
for (var i = 0; i < this.$.articleScroller.controlAtIndex(1).controls.length; i++) {
n += this.$.articleScroller.controlAtIndex(1).controls[i].children[0].children[0].node.offsetHeight, r++;
if (n > this.$.articleScroller.getScrollTop()) break;
}
for (var i = 0; i < r; i++) ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[i], !1, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError")), this.ArticleUnread[i] = !1;
this.setLoadbar(!0), this.selectFeed(this.currentFeedIndex);
break;
case "list":
for (var i = 0; i < this.ArticleID.length; i++) ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[i], !1, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError")), this.ArticleUnread[i] = !1;
this.setLoadbar(!0), this.selectFeed(this.currentFeedIndex), this.getCategories();
break;
case "feed":
ttrssCatchupFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processMarkFeedReadSuccess"), enyo.bind(this, "processMarkFeedReadError"));
}
this.clickRefresh(), this.$.viewPanels.setIndex(1);
},
MarkFeedRead: function(e) {
ttrssCatchupFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processMarkFeedReadSuccess"), enyo.bind(this, "processMarkFeedReadError")), this.$.MarkFeedReadPopup.hide();
},
processMarkFeedReadSuccess: function(e) {
console.error(enyo.json.stringify(e)), this.$.articleRepeater.setCount(0), this.$.articleScroller.setScrollTop(0), this.getCategories();
},
processMarkFeedReadError: function(e) {
console.error(enyo.json.stringify(e));
},
MarkFeedReadClose: function(e) {
this.$.MarkFeedReadPopup.hide();
},
UpdateFeedClick: function(e) {
this.setLoadbar(!0), this.selectFeed(this.currentFeedIndex);
},
FeedListPageUp: function(e) {
var t = e ? window.innerHeight / 10 : Math.min(Math.abs(this.startY - this.mouseY) / 4, window.innerHeight / 10);
this.$.articleScroller.setScrollTop(this.$.articleScroller.getScrollTop() - t);
},
FeedListPageUpDown: function(e, t) {
this.startY = this.mouseY = t.screenY, this.FeedListPageUp(!0), this.FeedListPageUpInterval || (this.FeedListPageUpInterval = setInterval(enyo.bind(this, "FeedListPageUp"), 200)), this.FeedListPageDownInterval && clearInterval(this.FeedListPageDownInterval), this.FeedListPageDownInterval = null;
},
FeedListPageUpUp: function(e, t) {
this.FeedListPageUpInterval && clearInterval(this.FeedListPageUpInterval), this.FeedListPageUpInterval = null;
},
FeedListPageDown: function(e) {
var t = e ? window.innerHeight / 10 : Math.min(Math.abs(this.startY - this.mouseY) / 4, window.innerHeight / 10);
this.$.articleScroller.setScrollTop(this.$.articleScroller.getScrollTop() + t);
},
FeedListPageDownDown: function(e, t) {
this.startY = this.mouseY = t.screenY, this.FeedListPageDown(!0), this.FeedListPageDownInterval || (this.FeedListPageDownInterval = setInterval(enyo.bind(this, "FeedListPageDown"), 200)), this.FeedListPageUpInterval && clearInterval(this.FeedListPageUpInterval), this.FeedListPageUpInterval = null;
},
FeedListPageDownUp: function(e, t) {
this.FeedListPageDownInterval && clearInterval(this.FeedListPageDownInterval), this.FeedListPageDownInterval = null;
},
handleGlobalMouseUp: function(e, t) {
this.FeedListPageDownInterval && clearInterval(this.FeedListPageDownInterval), this.FeedListPageDownInterval = null, this.FeedListPageUpInterval && clearInterval(this.FeedListPageUpInterval), this.FeedListPageUpInterval = null;
},
handleGlobalMouseDown: function(e, t) {
this.mouseY = t.screenY;
},
handleGlobalMouseMove: function(e, t) {
this.mouseY = t.screenY;
},
processUpdateFeedSuccess: function(e) {
console.log(e), this.selectFeed(this.currentFeedIndex);
},
processUpdateFeedError: function(e) {
console.error(e);
},
holdItem: function(e, t) {
window.innerWidth < 1024 && this.ViewMode == 0 && (this.$.viewPanels.setIndex(3), this.$.left2.setShowing(!1), this.$.middle.setShowing(!1), gblBB10 ? this.$.btnUnlockPanels.setShowing(!1) : this.$.btnUnlockPanels.setShowing(!0), this.$.btnPrevArticle.setShowing(!1), this.$.btnNextArticle.setShowing(!1), this.$.grabberArticleView.setShowing(!1), this.$.viewPanels.setDraggable(!1), this.clickItem(" ", t), this.resize());
},
enablePanels: function(e, t) {
console.log("ENABLE Panels"), this.UpdateFeedClick(), this.$.left2.setShowing(!0), this.$.middle.setShowing(!0), this.$.btnUnlockPanels.setShowing(!1), this.$.btnPrevArticle.setShowing(!0), this.$.btnNextArticle.setShowing(!0), this.$.grabberArticleView.setShowing(!0), this.$.viewPanels.setIndex(2), this.resize(), this.$.viewPanels.setDraggable(!0);
},
clickItem: function(e, t) {
this.RecentArticleIndex = t.index;
if (this.ViewMode == "1") {
var n = this.ArticleURL[this.RecentArticleIndex];
window.open(n), this.MarkArticleRead();
return;
}
this.ViewMode == "2" ? (this.setLoadbar(!0), ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"))) : (this.setLoadbar(!0), window.innerWidth < 1024 && this.AutoLockPanels && (this.$.viewPanels.setIndex(3), this.$.left2.setShowing(!1), this.$.middle.setShowing(!1), gblBB10 ? this.$.btnUnlockPanels.setShowing(!1) : this.$.btnUnlockPanels.setShowing(!0), this.$.btnPrevArticle.setShowing(!1), this.$.btnNextArticle.setShowing(!1), this.$.grabberArticleView.setShowing(!1), this.$.viewPanels.setDraggable(!1), this.resize()), ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[t.index], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"))), window.innerWidth < 1024 ? this.$.viewPanels.setIndex(3) : this.$.viewPanels.setIndex(2);
},
openArticle: function(e, t) {
var n = this.ArticleURL[this.RecentArticleIndex];
window.open(n);
},
showFullArticle: function(e, t) {
var n = this.ArticleURL[this.RecentArticleIndex];
this.ttrssURL == ".." && (n = "proxy.php?proxy_url=" + n), ttrssGetFullArticle(n, enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError")), this.$.viewPanels.setIndex(3);
},
prevArticle: function(e, t) {
this.RecentArticleIndex == 0 && (this.UpdateFeedClick(), this.enablePanels()), this.RecentArticleIndex >= 1 && (this.setLoadbar(!0), this.RecentArticleIndex = this.RecentArticleIndex - 1, this.ViewMode != "0" ? ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError")) : ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError")));
},
nextArticle: function(e, t) {
this.RecentArticleIndex < this.Articles.length - 1 ? (this.setLoadbar(!0), this.RecentArticleIndex = this.RecentArticleIndex + 1, this.ViewMode != "0" ? ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError")) : ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"))) : this.vibrate();
},
shareArticle: function(e, t) {
var n = this.ArticleURL[this.RecentArticleIndex];
ShareText = this.ArticleData[this.RecentArticleIndex][0].title;
switch (t.originator.content) {
case "Twitter":
window.open("http://www.twitter.com/share?text=Via%20%23ttrssenyo:%20'" + ShareText + "'&url=" + n);
break;
case "Facebook":
window.open("http://www.facebook.com/sharer/sharer.php?u=" + n);
break;
case "G+":
window.open("https://m.google.com/app/plus/x/?v=compose&content=" + ShareText + "%20" + n);
break;
case "App.net":
window.open("https://alpha.app.net/intent/post?text=" + ShareText + "%20" + n + "%20via%20%23ttrssenyo");
}
},
shareArticlebb10: function(e, t) {
var n = this.ArticleURL[this.RecentArticleIndex];
ShareText = this.ArticleData[this.RecentArticleIndex][0].title;
var r = {
action: "bb.action.SHARE",
mimeType: "text/plain",
uri: n,
data: ShareText + " " + n + " via #ttrssenyo",
target_type: [ "APPLICATION", "VIEWER", "CARD" ]
};
blackberry.invoke.card.invokeTargetPicker(r, "Share", function() {
console.log("success");
}, function(e) {
console.log("error: " + e);
});
},
handleKeyDown: function(e, t) {
var n = t.keyCode;
switch (n) {
case 27:
console.error(" BACK ");
var r = this.$.viewPanels.getIndex();
switch (r) {
case 3:
this.$.viewPanels.setIndex(2);
break;
case 2:
this.$.viewPanels.setIndex(1);
}
t.preventDefault(), t.stopPropagation();
break;
case 37:
this.$.viewPanels.getIndex(1) && this.prevArticle();
break;
case 38:
switch (this.$.viewPanels.getIndex()) {
case 2:
this.$.articleViewScroller.scrollTo(0, this.$.articleViewScroller.getScrollBounds().top - 100);
break;
case 3:
this.$.articleViewScroller.scrollTo(0, this.$.articleViewScroller.getScrollBounds().top - 100);
}
break;
case 39:
this.$.viewPanels.getIndex(1) && this.nextArticle();
break;
case 40:
switch (this.$.viewPanels.getIndex()) {
case 2:
this.$.articleViewScroller.scrollTo(0, this.$.articleViewScroller.getScrollBounds().top + 100);
break;
case 3:
this.$.articleViewScroller.scrollTo(0, this.$.articleViewScroller.getScrollBounds().top + 100);
}
break;
case 74:
this.$.viewPanels.getIndex(1) && this.prevArticle();
break;
case 75:
this.$.viewPanels.getIndex(1) && this.nextArticle();
}
return;
},
handleKeyUp: function(e, t) {},
handleKeyPress: function(e, t) {},
goBack: function(e, t) {
console.error(" BACK ");
},
AutoLoadChanged: function(e, t) {
e == this.$.autoLoadAllArticles && e.getValue() && this.$.autoLoadFirstFeed.setValue(!1), e == this.$.autoLoadFirstFeed && e.getValue() && this.$.autoLoadAllArticles.setValue(!1);
},
titleDragStart: function(e, t) {
this.dragStartPanelIndex = this.$.viewPanels.getIndex();
},
titleDragFinish: function(e, t) {
console.log("DRAGSTOP " + t.dx), this.resize(), +t.dx < -80 && this.dragStartPanelIndex == 3 && this.$.viewPanels.getIndex() == 3 && this.nextArticle(), +t.dx > 80 && (this.$.btnUnlockPanels.getShowing() && this.prevArticle(), this.$.bb10articleviewgrabber.getShowing() && this.prevArticle()), this.resize();
},
bb10backmain: function() {
this.$.viewPanels.setIndex(1);
},
setLoadbar: function(e) {
e ? (this.$.loadbar.setShowing(!0), this.$.loadbarBlank.setShowing(!1)) : (this.$.loadbar.setShowing(!1), this.$.loadbarBlank.setShowing(!0));
},
vibrate: function() {
gblBB10 && navigator.vibrate(100);
}
});

// ttrss.js

function ttrssLogin(e, t, n, r, i) {
var s = {
op: "login",
user: t,
password: n
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssLoginResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/index.php",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssLoginResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssLoginResponse(e, t, n) {
var r = {
status: "99",
sessionid: "99",
error: "99"
};
r.status = e.status, r.status == 0 ? (r.sessionid = e.content.session_id, ttsessionID = e.content.session_id, t(r)) : (r.error = e.content.error, n(r));
}

function ttrssGetCategories(e, t, n, r, i) {
var s = {
op: "getCategories",
unread_only: n,
enable_nested: !1,
sid: t
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssGetCategoriesResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssGetCategoriesResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssGetCategoriesResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssGetFeeds(e, t, n, r, i, s) {
var o = {
op: "getFeeds",
cat_id: r,
unread_only: n,
enable_nested: !0,
sid: t
};
if (gblUseJsonpRequest) {
var u = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
u.response(function(e, t) {
ttrssGetFeedsResponse(t, i, s);
});
} else {
var u = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(o)
});
u.response(function(e) {
ttrssGetFeedsResponse(JSON.parse(e.xhrResponse.body), i, s);
});
}
u.go(o);
return;
}

function ttrssGetFeedsResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssGetHeadlines(e, t, n, r, i, s, o) {
var u = "unread";
n ? u = "unread" : u = "all_articles";
var a = {
op: "getHeadlines",
feed_id: r,
is_cat: i,
view_mode: u,
limit: 100,
show_excerpt: !0,
show_content: !0,
enable_nested: !0,
sid: t
};
if (gblUseJsonpRequest) {
var f = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
f.response(function(e, t) {
ttrssGetHeadlinesResponse(t, s, o);
});
} else {
var f = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(a)
});
f.response(function(e) {
ttrssGetHeadlinesResponse(JSON.parse(e.xhrResponse.body), s, o);
});
}
f.go(a);
return;
}

function ttrssGetHeadlinesResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssGetArticle(e, t, n, r, i) {
var s = {
op: "getArticle",
article_id: n,
sid: t
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssGetHeadlinesResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssGetHeadlinesResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssGetArticleResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssMarkArticleRead(e, t, n, r, i, s) {
var o = 1;
r ? o = 1 : o = 0;
var u = {
op: "updateArticle",
article_ids: n,
mode: o,
field: 2,
sid: t
};
if (gblUseJsonpRequest) {
var a = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
a.response(function(e, t) {
ttrssMarkArticleReadResponse(t, i, s);
});
} else {
var a = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(u)
});
a.response(function(e) {
ttrssMarkArticleReadResponse(JSON.parse(e.xhrResponse.body), i, s);
});
}
a.go(u);
return;
}

function ttrssMarkArticleReadResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssMarkArticleStarred(e, t, n, r, i, s) {
var o = 1;
r ? o = 1 : o = 0;
var u = {
op: "updateArticle",
article_ids: n,
mode: r,
field: 0,
sid: t
};
if (gblUseJsonpRequest) {
var a = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
a.response(function(e, t) {
ttrssMarkArticleStarredResponse(t, i, s);
});
} else {
var a = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(u)
});
a.response(function(e) {
ttrssMarkArticleStarredResponse(JSON.parse(e.xhrResponse.body), i, s);
});
}
a.go(u);
return;
}

function ttrssMarkArticleStarredResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssPublishArticle(e, t, n, r, i, s) {
var o = {
op: "updateArticle",
article_ids: n,
mode: r,
field: 1,
sid: t
};
if (gblUseJsonpRequest) {
var u = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
u.response(function(e, t) {
ttrssPublishArticleResponse(t, i, s);
});
} else {
var u = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(o)
});
u.response(function(e) {
ttrssPublishArticleResponse(JSON.parse(e.xhrResponse.body), i, s);
});
}
u.go(o);
return;
}

function ttrssPublishArticleResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssSubscribeToFeed(e, t, n, r, i, s) {
if (gblApiLevel <= 4) {
var o = {
op: "subscribeToFeed",
feed_url: n,
category_id: r,
sid: t
}, u = new enyo.Ajax({
url: e + "/public.php?op=subscribe&feed_url=" + n,
method: "GET"
});
u.response(function(e) {
ttrssSubscribeToFeedResponse(e, i, s);
}), u.go();
} else {
var o = {
op: "subscribeToFeed",
feed_url: n,
category_id: r,
sid: t
}, u = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(o)
});
u.response(function(e) {
ttrssSubscribeToFeedResponse(JSON.parse(e.xhrResponse.body), i, s);
}), u.go(o);
}
return;
}

function ttrssSubscribeToFeedResponse(e, t, n) {
t(e);
}

function ttrssUnsubscribeFeed(e, t, n, r, i) {
var s = {
op: "unsubscribeFeed",
feed_id: n,
sid: t
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssUnsubscribeFeedResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssUnsubscribeFeedResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssUnsubscribeFeedResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssGetFullArticle(e, t, n) {
var r = new enyo.Ajax({
url: e,
method: "GET"
});
r.response(function(e) {
t(e.xhrResponse.body);
}), r.go();
}

function ttrssGetConfig(e, t, n, r) {
var i = {
op: "getConfig",
sid: t
};
if (gblUseJsonpRequest) {
var s = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
s.response(function(e, t) {
ttrssGetConfigResponse(t, n, r);
});
} else {
var s = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(i)
});
s.response(function(e) {
ttrssGetConfigResponse(JSON.parse(e.xhrResponse.body), n, r);
});
}
s.go(i);
return;
}

function ttrssGetConfigResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssCatchupFeed(e, t, n, r, i) {
var s = {
op: "catchupFeed",
feed_id: n,
is_cat: !1,
sid: t
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssCatchupFeedResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssCatchupFeedResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssCatchupFeedResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssUpdateFeed(e, t, n, r, i) {
var s = {
op: "updateFeed",
feed_id: n,
sid: t
};
if (gblUseJsonpRequest) {
var o = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
o.response(function(e, t) {
ttrssUpdateFeedResponse(t, r, i);
});
} else {
var o = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(s)
});
o.response(function(e) {
ttrssUpdateFeedResponse(JSON.parse(e.xhrResponse.body), r, i);
});
}
o.go(s);
return;
}

function ttrssUpdateFeedResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

function ttrssGetApiLevel(e, t, n, r) {
var i = {
op: "getApiLevel",
sid: t
};
if (gblUseJsonpRequest) {
var s = new enyo.JsonpRequest({
url: e + "/api/index.php"
});
s.response(function(e, t) {
ttrssGetApiLevelResponse(t, n, r);
});
} else {
var s = new enyo.Ajax({
url: e + "/api/",
method: "POST",
handleAs: "json",
postBody: JSON.stringify(i)
});
s.response(function(e) {
ttrssGetApiLevelResponse(JSON.parse(e.xhrResponse.body), n, r);
});
}
s.go(i);
return;
}

function ttrssGetApiLevelResponse(e, t, n) {
e.status == 0 ? t(e.content) : n(e.content.error);
}

// tools.js

function format_number(e, t, n) {
var r = "" + e;
while (r.length < t) r = n + r;
return r;
}

function html_entity_decode(e, t) {
var n = {}, r = "", i = "", s = "";
i = e.toString();
if (!1 === (n = this.get_html_translation_table("HTML_ENTITIES", t))) return !1;
delete n["&"], n["&"] = "&amp;";
for (r in n) s = n[r], i = i.split(s).join(r);
return i = i.split("&#039;").join("'"), i;
}

function get_html_translation_table(e, t) {
var n = {}, r = {}, i, s = {}, o = {}, u = {}, a = {};
s[0] = "HTML_SPECIALCHARS", s[1] = "HTML_ENTITIES", o[0] = "ENT_NOQUOTES", o[2] = "ENT_COMPAT", o[3] = "ENT_QUOTES", u = isNaN(e) ? e ? e.toUpperCase() : "HTML_SPECIALCHARS" : s[e], a = isNaN(t) ? t ? t.toUpperCase() : "ENT_COMPAT" : o[t];
if (u !== "HTML_SPECIALCHARS" && u !== "HTML_ENTITIES") throw new Error("Table: " + u + " not supported");
n[38] = "&amp;", u === "HTML_ENTITIES" && (n[160] = "&nbsp;", n[161] = "&iexcl;", n[162] = "&cent;", n[163] = "&pound;", n[164] = "&curren;", n[165] = "&yen;", n[166] = "&brvbar;", n[167] = "&sect;", n[168] = "&uml;", n[169] = "&copy;", n[170] = "&ordf;", n[171] = "&laquo;", n[172] = "&not;", n[173] = "&shy;", n[174] = "&reg;", n[175] = "&macr;", n[176] = "&deg;", n[177] = "&plusmn;", n[178] = "&sup2;", n[179] = "&sup3;", n[180] = "&acute;", n[181] = "&micro;", n[182] = "&para;", n[183] = "&middot;", n[184] = "&cedil;", n[185] = "&sup1;", n[186] = "&ordm;", n[187] = "&raquo;", n[188] = "&frac14;", n[189] = "&frac12;", n[190] = "&frac34;", n[191] = "&iquest;", n[192] = "&Agrave;", n[193] = "&Aacute;", n[194] = "&Acirc;", n[195] = "&Atilde;", n[196] = "&Auml;", n[197] = "&Aring;", n[198] = "&AElig;", n[199] = "&Ccedil;", n[200] = "&Egrave;", n[201] = "&Eacute;", n[202] = "&Ecirc;", n[203] = "&Euml;", n[204] = "&Igrave;", n[205] = "&Iacute;", n[206] = "&Icirc;", n[207] = "&Iuml;", n[208] = "&ETH;", n[209] = "&Ntilde;", n[210] = "&Ograve;", n[211] = "&Oacute;", n[212] = "&Ocirc;", n[213] = "&Otilde;", n[214] = "&Ouml;", n[215] = "&times;", n[216] = "&Oslash;", n[217] = "&Ugrave;", n[218] = "&Uacute;", n[219] = "&Ucirc;", n[220] = "&Uuml;", n[221] = "&Yacute;", n[222] = "&THORN;", n[223] = "&szlig;", n[224] = "&agrave;", n[225] = "&aacute;", n[226] = "&acirc;", n[227] = "&atilde;", n[228] = "&auml;", n[229] = "&aring;", n[230] = "&aelig;", n[231] = "&ccedil;", n[232] = "&egrave;", n[233] = "&eacute;", n[234] = "&ecirc;", n[235] = "&euml;", n[236] = "&igrave;", n[237] = "&iacute;", n[238] = "&icirc;", n[239] = "&iuml;", n[240] = "&eth;", n[241] = "&ntilde;", n[242] = "&ograve;", n[243] = "&oacute;", n[244] = "&ocirc;", n[245] = "&otilde;", n[246] = "&ouml;", n[247] = "&divide;", n[248] = "&oslash;", n[249] = "&ugrave;", n[250] = "&uacute;", n[251] = "&ucirc;", n[252] = "&uuml;", n[253] = "&yacute;", n[254] = "&thorn;", n[255] = "&yuml;"), a !== "ENT_NOQUOTES" && (n[34] = "&quot;"), a === "ENT_QUOTES" && (n[39] = "&#39;"), n[60] = "&lt;", n[62] = "&gt;";
for (i in n) n.hasOwnProperty(i) && (r[String.fromCharCode(i)] = n[i]);
return r;
}

function stripHTML(e) {
var t = e.replace(/(<.*['"])([^'"]*)(['"]>)/g, function(e, t, n, r) {
return t + r;
});
return t.replace(/<\/?[^>]+>/gi, "");
}

Array.prototype.remove = function(e, t) {
var n = this.slice((t || e) + 1 || this.length);
return this.length = e < 0 ? this.length + e : e, this.push.apply(this, n);
}, enyo.kind({
name: "MyAjaxWebView",
kind: "Control",
style: "background: white;",
components: [ {
kind: "Button",
classes: "floating-menu",
name: "backb",
content: "Back",
disabled: !0,
onclick: "goPrevious"
}, {
kind: "Button",
classes: "floating-menu-right",
content: "Forward",
name: "forb",
disabled: !0,
onclick: "goNext"
}, {
name: "content",
onclick: "catchtap",
content: "",
allowHtml: !0
} ],
create: function() {
this.inherited(arguments), this.pages = [], this.base = "", this.currentPage = 0, this.setupMenu = !1, this.loadit();
},
goPrevious: function() {
return this.currentPage--, this.loadit(), !0;
},
goNext: function() {
return this.currentPage++, this.loadit(), !0;
},
loadit: function() {
this.currentPage <= 0 ? this.$.backb.setDisabled(!0) : this.$.backb.setDisabled(!1), this.currentPage + 1 >= this.pages.length ? this.$.forb.setDisabled(!0) : this.$.forb.setDisabled(!1);
if (this.pages[this.currentPage]) {
var e = this.pages[this.currentPage].src;
console.log(e), this.base = this.pages[this.currentPage].src.slice(0, this.pages[this.currentPage].src.indexOf("/", 8) + 1), this.base == "" && (this.base = e + "/"), console.log(this.base), (new enyo.Ajax({
url: "" + e,
handleAs: "text"
})).response(this, function(e, t) {
var n = 0, r = t.replace(/href=\"\//g, 'href="' + this.base);
r = r.replace(/src=\"\//g, 'src="' + this.base), console.log(this.base), this.$.content.setContent(r), this.$.content.render(), this.processChapter();
}).error(this, function(e, t) {
console.log("error " + t);
}).go();
}
},
call: function(e, t) {
try {
this.currentPage = this.pages.length, this.pages[this.pages.length] = {
src: e
}, this.currentPage <= 0 ? this.$.backb.setDisabled(!0) : this.$.backb.setDisabled(!1), this.currentPage + 1 >= this.pages.length ? this.$.forb.setDisabled(!0) : this.$.forb.setDisabled(!1);
if (this.pages[this.currentPage]) {
var n = e;
console.log(n), this.base = e.slice(0, e.indexOf("/", 8) + 1), this.base == "" && (this.base = n + "/"), console.log(this.base);
var r = 0, i = t.replace(/href=\"\//g, 'href="' + this.base);
i = i.replace(/src=\"\//g, 'src="' + this.base), console.log(this.base), this.$.content.setContent(i), this.$.content.render();
}
} catch (s) {}
},
processChapter: function() {
if (this.$.content.hasNode()) {
var node = this.$.content.node, nodes = node.children;
for (i = 0; i < nodes.length; i++) nodes[i].nodeName == "SCRIPT" && (console.log("found script"), eval(nodes[i].innerText)), nodes[i].baseURI = this.base;
}
this.$.content.render();
},
catchtap: function(e, t) {
console.log(t.target.href);
var n = "";
if (t.target.href) var n = t.target.href; else if (t.target.parentNode.href) var n = t.target.parentNode.href;
return n != "" && this.newpage(n), console.log("tapped"), t.preventDefault(), !0;
}
});

// ApplicationEvents.js

enyo.kind({
name: "enyo.ApplicationEvents",
kind: enyo.Component,
events: {
onLoad: "",
onUnload: "",
onError: "",
onWindowActivated: "",
onWindowDeactivated: "",
onWindowParamsChange: "",
onApplicationRelaunch: "",
onWindowRotated: "",
onOpenAppMenu: "",
onCloseAppMenu: "",
onWindowHidden: "",
onWindowShown: "",
onKeyup: "",
onKeydown: "",
onKeypress: "",
onBack: "",
onKeyboardShown: ""
},
create: function() {
this.inherited(arguments), enyo.dispatcher.rootHandler.addListener(this), window.addEventListener("unload", this.dispatchDomEvent.bind(this)), window.addEventListener("load", this.dispatchDomEvent.bind(this)), window.addEventListener("resize", this.dispatchDomEvent.bind(this)), window.addEventListener("message", this.dispatchDomEvent.bind(this));
},
destroy: function() {
enyo.dispatcher.rootHandler.removeListener(this), this.inherited(arguments);
},
dispatchDomEvent: function(e) {
return this.bubble("on" + enyo.cap(e.type), arguments);
}
}), enyo.dispatcher.rootHandler = {
requiresDomMousedown: !0,
listeners: [],
addListener: function(e) {
this.listeners.push(e);
},
removeListener: function(e) {
enyo.remove(e, this.listeners);
},
dispatchDomEvent: function(e) {
if (e.type == "resize") {
this.broadcastMessage("resize");
return;
}
return (e.type == "windowDeactivated" || e.type == "windowHidden") && this.broadcastMessage("autoHide"), this.broadcastEvent(e);
},
broadcastMessage: function(e) {
for (var t in enyo.master.$) enyo.master.$[t].broadcastMessage(e);
},
broadcastEvent: function(e) {
var t = !1;
for (var n = 0, r; r = this.listeners[n]; n++) t = r.dispatchDomEvent(e) || t;
return t;
},
isDescendantOf: function() {
return !1;
}
};

// DividerDrawer.js

enyo.kind({
name: "gts.DividerDrawer",
classes: "gts-DividerDrawer",
published: {
caption: "",
open: !0
},
events: {
onChange: ""
},
components: [ {
name: "base",
kind: "enyo.FittableColumns",
noStretch: !0,
classes: "base-bar",
ontap: "toggleOpen",
components: [ {
classes: "end-cap"
}, {
name: "caption",
classes: "caption"
}, {
classes: "bar",
fit: !0
}, {
name: "switch",
classes: "toggle",
value: !1
}, {
classes: "end-cap bar"
} ]
}, {
name: "client",
kind: "onyx.Drawer"
} ],
rendered: function() {
this.inherited(arguments), this.captionChanged(), this.openChanged();
},
reflow: function() {
this.$.base.reflow();
},
openChanged: function() {
this.$["switch"].value = this.open, this.$.client.setOpen(this.$["switch"].value), this.$["switch"].addRemoveClass("checked", this.$["switch"].value), this.reflow();
},
captionChanged: function() {
this.$.caption.setContent(this.caption), this.$.caption.applyStyle("display", this.caption ? "" : "none"), this.reflow();
},
toggleOpen: function(e, t) {
return this.open = !this.$["switch"].value, this.$["switch"].value = this.open, this.openChanged(), this.doChange(this, {
caption: this.getCaption(),
open: this.getOpen()
}), !0;
}
});
