"use strict";
// basic layout finished
//todo
/*
    StackPanel
    UniformGrid
*/
class Layouter {
    constructor() {
        this.WindowWidth = 0;
        this.WindowHeight = 0;
    }
    static Refresh() {
        if (Layouter.instance != null)
            Layouter.instance.Window_OnResize(window.innerWidth, window.innerHeight);
    }
    Window_OnResize(width, height) {
        this.WindowWidth = width;
        this.WindowHeight = height;
        var before = performance.now();
        var attr = this.ReadAttributes(document.body);
        this.Recurse(document.body, {
            Width: width,
            Height: height,
            PaddingT: attr.PaddingTop,
            PaddingB: attr.PaddingBottom,
            PaddingR: attr.PaddingRight,
            PaddingL: attr.PaddingLeft,
            Attributes: attr
        });
        const children = document.querySelectorAll("[LayoutChildren]");
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            let attr = this.ReadAttributes(element);
            this.Recurse(element, {
                Width: width,
                Height: height,
                PaddingT: attr.PaddingTop,
                PaddingB: attr.PaddingBottom,
                PaddingR: attr.PaddingRight,
                PaddingL: attr.PaddingLeft,
                Attributes: attr
            });
        }
        var after = performance.now();
        console.log("Calculated Layout in " + (after - before) + "ms");
    }
    Recurse(elm, parent) {
        const attr = this.ReadAttributes(elm);
        const d = {
            Height: 0,
            Width: 0,
            PaddingT: attr.PaddingTop,
            PaddingB: attr.PaddingBottom,
            PaddingR: attr.PaddingRight,
            PaddingL: attr.PaddingLeft,
            OffsetX: 0,
            OffsetY: 0,
            Attributes: attr
        };
        var top = parent.PaddingT;
        var left = parent.PaddingL;
        if (isNaN(attr.Width)) {
            d.Width = parent.Width -
                parent.PaddingL - parent.PaddingR -
                attr.MarginLeft - attr.MarginRight;
        }
        else {
            d.Width = attr.Width;
        }
        if (isNaN(attr.Height)) {
            d.Height = parent.Height -
                parent.PaddingT - parent.PaddingB -
                attr.MarginTop - attr.MarginBottom;
        }
        else {
            d.Height = attr.Height;
        }
        switch (attr.HorizontalAlignment) {
            case "left":
                left += attr.MarginLeft;
                break;
            case "right":
                left += (parent.Width - d.Width - attr.MarginRight);
                break;
            case "center":
                left = parent.Width / 2 - d.Width / 2;
                break;
            case "stretch":
                left += attr.MarginLeft;
                break;
        }
        switch (attr.VerticalAlignment) {
            case "top":
                top += attr.MarginTop;
                break;
            case "bottom":
                top += (parent.Height - d.Height - attr.MarginBottom);
                break;
            case "center":
                top = parent.Height / 2 - d.Height / 2;
                break;
            case "stretch":
                top += attr.MarginTop;
                break;
        }
        switch (parent.Attributes.Stack) {
            case "horizontal":
                if (attr.HorizontalAlignment == "left")
                    left += parent.OffsetX;
                else
                    left -= parent.OffsetX;
                break;
            case "vertical":
                if (attr.VerticalAlignment == "top")
                    top += parent.OffsetY;
                else
                    top -= parent.OffsetY;
                break;
        }
        if (isNaN(parent.Attributes.GridX) == false) {
            var itemWidth = parent.Width / parent.Attributes.GridX;
            var padding = parent.Attributes.GridXPadding;
            d.Width = itemWidth - padding * 2;
            left += parent.OffsetX + padding;
            top += parent.OffsetY + padding;
            parent.OffsetX += itemWidth;
            d.Height -= padding;
            if (parent.OffsetX >= parent.Width) {
                parent.OffsetX = 0;
                parent.OffsetY += d.Height + padding;
            }
        }
        if (isNaN(parent.Attributes.GridY) == false) {
            // aint nobody got time for that
        }
        elm.style.width = d.Width + "px";
        elm.style.height = d.Height + "px";
        elm.style.top = top + "px";
        elm.style.left = left + "px";
        if (parent.Attributes.Stack != "none") {
            parent.OffsetX += d.Width + d.PaddingL + d.PaddingR + attr.MarginLeft + attr.MarginRight;
            parent.OffsetY += d.Height + d.PaddingT + d.PaddingB + attr.MarginBottom + attr.MarginTop;
        }
        var children = elm.children;
        if (attr.IgnoreChildren == false) {
            for (let i = 0; i < children.length; i++) {
                this.Recurse(children[i], d);
            }
        }
    }
    Init() {
        const _this = this;
        Layouter.instance = _this;
        _this.Window_OnResize(window.innerWidth, window.innerHeight);
        window.onresize = function () {
            _this.Window_OnResize(window.innerWidth, window.innerHeight);
        };
    }
    ReadAttributes(elm) {
        var horizontalAlignment = elm.getAttribute("HorizontalAlignment");
        var verticalAlignment = elm.getAttribute("VerticalAlignment");
        if (horizontalAlignment == null)
            horizontalAlignment = "stretch";
        else
            horizontalAlignment = horizontalAlignment.toLowerCase();
        if (verticalAlignment == null)
            verticalAlignment = "stretch";
        else
            verticalAlignment = verticalAlignment.toLowerCase();
        var stack = elm.getAttribute("Stack");
        if (stack == null)
            stack = "none";
        else if (stack == "")
            stack = "vertical";
        else
            stack = stack.toLowerCase();
        var width = parseFloat(elm.getAttribute("Width") || "NaN");
        var height = parseFloat(elm.getAttribute("Height") || "NaN");
        if (isNaN(width) == false && horizontalAlignment == "stretch")
            horizontalAlignment = "center";
        if (isNaN(height) == false && verticalAlignment == "stretch")
            verticalAlignment = "center";
        var marginL = 0;
        var marginR = 0;
        var marginT = 0;
        var marginB = 0;
        var marginLAttr = parseFloat(elm.getAttribute("MarginLeft") || elm.getAttribute("MarginL") || "NaN");
        var marginRAttr = parseFloat(elm.getAttribute("MarginRight") || elm.getAttribute("MarginR") || "NaN");
        var marginTAttr = parseFloat(elm.getAttribute("MarginTop") || elm.getAttribute("MarginT") || "NaN");
        var marginBAttr = parseFloat(elm.getAttribute("MarginBottom") || elm.getAttribute("MarginB") || "NaN");
        var marginH = parseFloat(elm.getAttribute("MarginHorizontal") || elm.getAttribute("MarginH") || "NaN");
        var marginV = parseFloat(elm.getAttribute("MarginVertical") || elm.getAttribute("MarginV") || "NaN");
        var marginAll = parseFloat(elm.getAttribute("Margin") || "0");
        if (isNaN(marginAll) == false) {
            marginT = marginAll;
            marginB = marginAll;
            marginL = marginAll;
            marginR = marginAll;
        }
        if (isNaN(marginH) == false) {
            marginL = marginH;
            marginR = marginH;
        }
        if (isNaN(marginV) == false) {
            marginT = marginV;
            marginB = marginV;
        }
        if (isNaN(marginTAttr) == false)
            marginT = marginTAttr;
        if (isNaN(marginBAttr) == false)
            marginB = marginBAttr;
        if (isNaN(marginLAttr) == false)
            marginL = marginLAttr;
        if (isNaN(marginRAttr) == false)
            marginR = marginRAttr;
        var paddingL = 0;
        var paddingR = 0;
        var paddingT = 0;
        var paddingB = 0;
        var paddingLAttr = parseFloat(elm.getAttribute("PaddingLeft") || elm.getAttribute("PaddingL") || "NaN");
        var paddingRAttr = parseFloat(elm.getAttribute("PaddingRight") || elm.getAttribute("PaddingR") || "NaN");
        var paddingTAttr = parseFloat(elm.getAttribute("PaddingTop") || elm.getAttribute("PaddingT") || "NaN");
        var paddingBAttr = parseFloat(elm.getAttribute("PaddingBottom") || elm.getAttribute("PaddingB") || "NaN");
        var paddingH = parseFloat(elm.getAttribute("PaddingHorizontal") || elm.getAttribute("PaddingH") || "NaN");
        var paddingV = parseFloat(elm.getAttribute("PaddingVertical") || elm.getAttribute("PaddingV") || "NaN");
        var paddingAll = parseFloat(elm.getAttribute("Padding") || "0");
        if (isNaN(paddingAll) == false) {
            paddingT = paddingAll;
            paddingB = paddingAll;
            paddingL = paddingAll;
            paddingR = paddingAll;
        }
        if (isNaN(paddingH) == false) {
            paddingL = paddingH;
            paddingR = paddingH;
        }
        if (isNaN(paddingV) == false) {
            paddingT = paddingV;
            paddingB = paddingV;
        }
        if (isNaN(paddingTAttr) == false)
            paddingT = paddingTAttr;
        if (isNaN(paddingBAttr) == false)
            paddingB = paddingBAttr;
        if (isNaN(paddingLAttr) == false)
            paddingL = paddingLAttr;
        if (isNaN(paddingRAttr) == false)
            paddingR = paddingRAttr;
        const ignoreChildrenAttr = elm.getAttribute("IgnoreChildren");
        var ignoreChildren = false;
        if (ignoreChildrenAttr != null)
            ignoreChildren = ignoreChildrenAttr.toLowerCase() == "true";
        const layoutChildrenAttr = elm.getAttribute("LayoutChildren");
        var layoutChildren = false;
        if (layoutChildrenAttr != null)
            layoutChildren = layoutChildrenAttr.toLowerCase() == "true";
        var gridX = parseInt(elm.getAttribute("GridX") || "NaN");
        var gridY = parseInt(elm.getAttribute("GridY") || "NaN");
        var gridXPadding = parseFloat(elm.getAttribute("GridXPadding") || "0");
        var gridYPadding = parseFloat(elm.getAttribute("GridYPadding") || "0");
        return {
            HorizontalAlignment: horizontalAlignment,
            VerticalAlignment: verticalAlignment,
            Height: height,
            Width: width,
            MarginTop: marginT,
            MarginBottom: marginB,
            MarginLeft: marginL,
            MarginRight: marginR,
            PaddingTop: paddingT,
            PaddingBottom: paddingB,
            PaddingLeft: paddingL,
            PaddingRight: paddingR,
            IgnoreChildren: ignoreChildren,
            LayoutChildren: layoutChildren,
            Stack: stack,
            GridX: gridX,
            GridY: gridY,
            GridXPadding: gridXPadding,
            GridYPadding: gridYPadding,
        };
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var instance = new Layouter();
    instance.Init();
});
//# sourceMappingURL=Layouter.js.map