/*
 Highmaps JS v6.1.0 (2018-04-13)
 Highmaps as a plugin for Highcharts or Highstock.

 (c) 2011-2017 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (x) {
  "object" === typeof module && module.exports ? module.exports = x : x(Highcharts)
})(function (x) {
  (function (a) {
    var l = a.addEvent,
      h = a.Axis,
      k = a.each,
      f = a.pick;
    l(h, "getSeriesExtremes", function () {
      var a = [];
      this.isXAxis && (k(this.series, function (q, f) {
        q.useMapGeometry && (a[f] = q.xData, q.xData = [])
      }), this.seriesXData = a)
    });
    l(h, "afterGetSeriesExtremes", function () {
      var a = this.seriesXData,
        g, h, t;
      this.isXAxis && (g = f(this.dataMin, Number.MAX_VALUE), h = f(this.dataMax, -Number.MAX_VALUE), k(this.series, function (e, b) {
        e.useMapGeometry &&
          (g = Math.min(g, f(e.minX, g)), h = Math.max(h, f(e.maxX, h)), e.xData = a[b], t = !0)
      }), t && (this.dataMin = g, this.dataMax = h), delete this.seriesXData)
    });
    l(h, "afterSetAxisTranslation", function () {
      var a = this.chart,
        g;
      g = a.plotWidth / a.plotHeight;
      var a = a.xAxis[0],
        f;
      "yAxis" === this.coll && void 0 !== a.transA && k(this.series, function (a) {
        a.preserveAspectRatio && (f = !0)
      });
      if (f && (this.transA = a.transA = Math.min(this.transA, a.transA), g /= (a.max - a.min) / (this.max - this.min), g = 1 > g ? this : a, a = (g.max - g.min) * g.transA, g.pixelPadding = g.len - a, g.minPixelPadding =
          g.pixelPadding / 2, a = g.fixTo)) {
        a = a[1] - g.toValue(a[0], !0);
        a *= g.transA;
        if (Math.abs(a) > g.minPixelPadding || g.min === g.dataMin && g.max === g.dataMax) a = 0;
        g.minPixelPadding -= a
      }
    });
    l(h, "render", function () {
      this.fixTo = null
    })
  })(x);
  (function (a) {
    var l = a.addEvent,
      h = a.Axis,
      k = a.Chart,
      f = a.color,
      q, g = a.each,
      u = a.extend,
      t = a.isNumber,
      e = a.Legend,
      b = a.LegendSymbolMixin,
      d = a.noop,
      n = a.merge,
      r = a.pick;
    a.ColorAxis || (q = a.ColorAxis = function () {
      this.init.apply(this, arguments)
    }, u(q.prototype, h.prototype), u(q.prototype, {
      defaultColorAxisOptions: {
        lineWidth: 0,
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 1,
        tickPixelInterval: 72,
        startOnTick: !0,
        endOnTick: !0,
        offset: 0,
        marker: {
          animation: {
            duration: 50
          },
          width: .01,
          color: "#999999"
        },
        labels: {
          overflow: "justify",
          rotation: 0
        },
        minColor: "#e6ebf5",
        maxColor: "#003399",
        tickLength: 5,
        showInLegend: !0
      },
      keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(h.prototype.keepProps),
      init: function (a, b) {
        var c = "vertical" !== a.options.legend.layout,
          m;
        this.coll = "colorAxis";
        m = n(this.defaultColorAxisOptions, {
          side: c ? 2 : 1,
          reversed: !c
        }, b, {
          opposite: !c,
          showEmpty: !1,
          title: null,
          visible: a.options.legend.enabled
        });
        h.prototype.init.call(this, a, m);
        b.dataClasses && this.initDataClasses(b);
        this.initStops();
        this.horiz = c;
        this.zoomEnabled = !1;
        this.defaultLegendLength = 200
      },
      initDataClasses: function (a) {
        var b = this.chart,
          c, m = 0,
          d = b.options.chart.colorCount,
          e = this.options,
          y = a.dataClasses.length;
        this.dataClasses = c = [];
        this.legendItems = [];
        g(a.dataClasses, function (a, p) {
          a = n(a);
          c.push(a);
          a.color || ("category" === e.dataClassColor ? (p = b.options.colors,
            d = p.length, a.color = p[m], a.colorIndex = m, m++, m === d && (m = 0)) : a.color = f(e.minColor).tweenTo(f(e.maxColor), 2 > y ? .5 : p / (y - 1)))
        })
      },
      setTickPositions: function () {
        if (!this.dataClasses) return h.prototype.setTickPositions.call(this)
      },
      initStops: function () {
        this.stops = this.options.stops || [
          [0, this.options.minColor],
          [1, this.options.maxColor]
        ];
        g(this.stops, function (a) {
          a.color = f(a[1])
        })
      },
      setOptions: function (a) {
        h.prototype.setOptions.call(this, a);
        this.options.crosshair = this.options.marker
      },
      setAxisSize: function () {
        var a = this.legendSymbol,
          b = this.chart,
          c = b.options.legend || {},
          p, d;
        a ? (this.left = c = a.attr("x"), this.top = p = a.attr("y"), this.width = d = a.attr("width"), this.height = a = a.attr("height"), this.right = b.chartWidth - c - d, this.bottom = b.chartHeight - p - a, this.len = this.horiz ? d : a, this.pos = this.horiz ? c : p) : this.len = (this.horiz ? c.symbolWidth : c.symbolHeight) || this.defaultLegendLength
      },
      normalizedValue: function (a) {
        this.isLog && (a = this.val2lin(a));
        return 1 - (this.max - a) / (this.max - this.min || 1)
      },
      toColor: function (a, b) {
        var c = this.stops,
          p, m, v = this.dataClasses,
          d, e;
        if (v)
          for (e = v.length; e--;) {
            if (d = v[e], p = d.from, c = d.to, (void 0 === p || a >= p) && (void 0 === c || a <= c)) {
              m = d.color;
              b && (b.dataClass = e, b.colorIndex = d.colorIndex);
              break
            }
          } else {
            a = this.normalizedValue(a);
            for (e = c.length; e-- && !(a > c[e][0]););
            p = c[e] || c[e + 1];
            c = c[e + 1] || p;
            a = 1 - (c[0] - a) / (c[0] - p[0] || 1);
            m = p.color.tweenTo(c.color, a)
          }
        return m
      },
      getOffset: function () {
        var a = this.legendGroup,
          b = this.chart.axisOffset[this.side];
        a && (this.axisParent = a, h.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight =
          this.width), this.chart.axisOffset[this.side] = b)
      },
      setLegendColor: function () {
        var a, b = this.reversed;
        a = b ? 1 : 0;
        b = b ? 0 : 1;
        a = this.horiz ? [a, 0, b, 0] : [0, b, 0, a];
        this.legendColor = {
          linearGradient: {
            x1: a[0],
            y1: a[1],
            x2: a[2],
            y2: a[3]
          },
          stops: this.stops
        }
      },
      drawLegendSymbol: function (a, b) {
        var c = a.padding,
          p = a.options,
          d = this.horiz,
          m = r(p.symbolWidth, d ? this.defaultLegendLength : 12),
          v = r(p.symbolHeight, d ? 12 : this.defaultLegendLength),
          e = r(p.labelPadding, d ? 16 : 30),
          p = r(p.itemDistance, 10);
        this.setLegendColor();
        b.legendSymbol = this.chart.renderer.rect(0,
          a.baseline - 11, m, v).attr({
          zIndex: 1
        }).add(b.legendGroup);
        this.legendItemWidth = m + c + (d ? p : e);
        this.legendItemHeight = v + c + (d ? e : 0)
      },
      setState: function (a) {
        g(this.series, function (b) {
          b.setState(a)
        })
      },
      visible: !0,
      setVisible: d,
      getSeriesExtremes: function () {
        var a = this.series,
          b = a.length;
        this.dataMin = Infinity;
        for (this.dataMax = -Infinity; b--;) void 0 !== a[b].valueMin && (this.dataMin = Math.min(this.dataMin, a[b].valueMin), this.dataMax = Math.max(this.dataMax, a[b].valueMax))
      },
      drawCrosshair: function (a, b) {
        var c = b && b.plotX,
          p = b && b.plotY,
          d, e = this.pos,
          m = this.len;
        b && (d = this.toPixels(b[b.series.colorKey]), d < e ? d = e - 2 : d > e + m && (d = e + m + 2), b.plotX = d, b.plotY = this.len - d, h.prototype.drawCrosshair.call(this, a, b), b.plotX = c, b.plotY = p, this.cross && !this.cross.addedToColorAxis && this.legendGroup && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.addedToColorAxis = !0, this.cross.attr({
          fill: this.crosshair.color
        })))
      },
      getPlotLinePath: function (a, b, c, d, e) {
        return t(e) ? this.horiz ? ["M", e - 4, this.top - 6, "L", e + 4, this.top - 6, e, this.top,
          "Z"
        ] : ["M", this.left, e, "L", this.left - 6, e + 6, this.left - 6, e - 6, "Z"] : h.prototype.getPlotLinePath.call(this, a, b, c, d)
      },
      update: function (a, b) {
        var c = this.chart,
          d = c.legend;
        g(this.series, function (a) {
          a.isDirtyData = !0
        });
        a.dataClasses && d.allItems && (g(d.allItems, function (a) {
          a.isDataClass && a.legendGroup && a.legendGroup.destroy()
        }), c.isDirtyLegend = !0);
        c.options[this.coll] = n(this.userOptions, a);
        h.prototype.update.call(this, a, b);
        this.legendItem && (this.setLegendColor(), d.colorizeItem(this, !0))
      },
      remove: function () {
        this.legendItem &&
          this.chart.legend.destroyItem(this);
        h.prototype.remove.call(this)
      },
      getDataClassLegendSymbols: function () {
        var e = this,
          v = this.chart,
          c = this.legendItems,
          p = v.options.legend,
          n = p.valueDecimals,
          r = p.valueSuffix || "",
          y;
        c.length || g(this.dataClasses, function (p, m) {
          var w = !0,
            f = p.from,
            q = p.to;
          y = "";
          void 0 === f ? y = "\x3c " : void 0 === q && (y = "\x3e ");
          void 0 !== f && (y += a.numberFormat(f, n) + r);
          void 0 !== f && void 0 !== q && (y += " - ");
          void 0 !== q && (y += a.numberFormat(q, n) + r);
          c.push(u({
            chart: v,
            name: y,
            options: {},
            drawLegendSymbol: b.drawRectangle,
            visible: !0,
            setState: d,
            isDataClass: !0,
            setVisible: function () {
              w = this.visible = !w;
              g(e.series, function (a) {
                g(a.points, function (a) {
                  a.dataClass === m && a.setVisible(w)
                })
              });
              v.legend.colorizeItem(this, w)
            }
          }, p))
        });
        return c
      },
      name: ""
    }), g(["fill", "stroke"], function (b) {
      a.Fx.prototype[b + "Setter"] = function () {
        this.elem.attr(b, f(this.start).tweenTo(f(this.end), this.pos), null, !0)
      }
    }), l(k, "afterGetAxes", function () {
      var a = this.options.colorAxis;
      this.colorAxis = [];
      a && new q(this, a)
    }), l(e, "afterGetAllItems", function (b) {
      var d = [],
        c = this.chart.colorAxis[0];
      c && c.options && (c.options.showInLegend && (c.options.dataClasses ? d = c.getDataClassLegendSymbols() : d.push(c)), g(c.series, function (c) {
        a.erase(b.allItems, c)
      }));
      for (; d.length;) b.allItems.unshift(d.pop())
    }), l(e, "afterColorizeItem", function (a) {
      a.visible && a.item.legendColor && a.item.legendSymbol.attr({
        fill: a.item.legendColor
      })
    }), l(e, "afterUpdate", function (a, b, c) {
      this.chart.colorAxis[0] && this.chart.colorAxis[0].update({}, c)
    }))
  })(x);
  (function (a) {
    var l = a.defined,
      h = a.each,
      k = a.noop,
      f = a.seriesTypes;
    a.colorPointMixin = {
      isValid: function () {
        return null !== this.value && Infinity !== this.value && -Infinity !== this.value
      },
      setVisible: function (a) {
        var f = this,
          q = a ? "show" : "hide";
        h(["graphic", "dataLabel"], function (a) {
          if (f[a]) f[a][q]()
        })
      },
      setState: function (f) {
        a.Point.prototype.setState.call(this, f);
        this.graphic && this.graphic.attr({
          zIndex: "hover" === f ? 1 : 0
        })
      }
    };
    a.colorSeriesMixin = {
      pointArrayMap: ["value"],
      axisTypes: ["xAxis", "yAxis", "colorAxis"],
      optionalAxis: "colorAxis",
      trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
      getSymbol: k,
      parallelArrays: ["x", "y", "value"],
      colorKey: "value",
      pointAttribs: f.column.prototype.pointAttribs,
      translateColors: function () {
        var a = this,
          f = this.options.nullColor,
          k = this.colorAxis,
          l = this.colorKey;
        h(this.data, function (e) {
          var b = e[l];
          if (b = e.options.color || (e.isNull ? f : k && void 0 !== b ? k.toColor(b, e) : e.color || a.color)) e.color = b
        })
      },
      colorAttribs: function (a) {
        var f = {};
        l(a.color) && (f[this.colorProp || "fill"] = a.color);
        return f
      }
    }
  })(x);
  (function (a) {
    function l(a) {
      a && (a.preventDefault && a.preventDefault(), a.stopPropagation &&
        a.stopPropagation(), a.cancelBubble = !0)
    }

    function h(a) {
      this.init(a)
    }
    var k = a.addEvent,
      f = a.Chart,
      q = a.doc,
      g = a.each,
      u = a.extend,
      t = a.merge,
      e = a.pick;
    h.prototype.init = function (a) {
      this.chart = a;
      a.mapNavButtons = []
    };
    h.prototype.update = function (b) {
      var d = this.chart,
        n = d.options.mapNavigation,
        f, m, v, c, p, w = function (a) {
          this.handler.call(d, a);
          l(a)
        },
        q = d.mapNavButtons;
      b && (n = d.options.mapNavigation = t(d.options.mapNavigation, b));
      for (; q.length;) q.pop().destroy();
      e(n.enableButtons, n.enabled) && !d.renderer.forExport && a.objectEach(n.buttons,
        function (a, b) {
          f = t(n.buttonOptions, a);
          m = f.theme;
          m.style = t(f.theme.style, f.style);
          c = (v = m.states) && v.hover;
          p = v && v.select;
          a = d.renderer.button(f.text, 0, 0, w, m, c, p, 0, "zoomIn" === b ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation").attr({
            width: f.width,
            height: f.height,
            title: d.options.lang[b],
            padding: f.padding,
            zIndex: 5
          }).add();
          a.handler = f.onclick;
          a.align(u(f, {
            width: a.width,
            height: 2 * a.height
          }), null, f.alignTo);
          k(a.element, "dblclick", l);
          q.push(a)
        });
      this.updateEvents(n)
    };
    h.prototype.updateEvents =
      function (a) {
        var b = this.chart;
        e(a.enableDoubleClickZoom, a.enabled) || a.enableDoubleClickZoomTo ? this.unbindDblClick = this.unbindDblClick || k(b.container, "dblclick", function (a) {
          b.pointer.onContainerDblClick(a)
        }) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
        e(a.enableMouseWheelZoom, a.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || k(b.container, void 0 === q.onmousewheel ? "DOMMouseScroll" : "mousewheel", function (a) {
            b.pointer.onContainerMouseWheel(a);
            l(a);
            return !1
          }) : this.unbindMouseWheel &&
          (this.unbindMouseWheel = this.unbindMouseWheel())
      };
    u(f.prototype, {
      fitToBox: function (a, d) {
        g([
          ["x", "width"],
          ["y", "height"]
        ], function (b) {
          var e = b[0];
          b = b[1];
          a[e] + a[b] > d[e] + d[b] && (a[b] > d[b] ? (a[b] = d[b], a[e] = d[e]) : a[e] = d[e] + d[b] - a[b]);
          a[b] > d[b] && (a[b] = d[b]);
          a[e] < d[e] && (a[e] = d[e])
        });
        return a
      },
      mapZoom: function (a, d, f, q, m) {
        var b = this.xAxis[0],
          c = b.max - b.min,
          p = e(d, b.min + c / 2),
          w = c * a,
          c = this.yAxis[0],
          n = c.max - c.min,
          g = e(f, c.min + n / 2),
          n = n * a,
          p = this.fitToBox({
            x: p - w * (q ? (q - b.pos) / b.len : .5),
            y: g - n * (m ? (m - c.pos) / c.len : .5),
            width: w,
            height: n
          }, {
            x: b.dataMin,
            y: c.dataMin,
            width: b.dataMax - b.dataMin,
            height: c.dataMax - c.dataMin
          }),
          w = p.x <= b.dataMin && p.width >= b.dataMax - b.dataMin && p.y <= c.dataMin && p.height >= c.dataMax - c.dataMin;
        q && (b.fixTo = [q - b.pos, d]);
        m && (c.fixTo = [m - c.pos, f]);
        void 0 === a || w ? (b.setExtremes(void 0, void 0, !1), c.setExtremes(void 0, void 0, !1)) : (b.setExtremes(p.x, p.x + p.width, !1), c.setExtremes(p.y, p.y + p.height, !1));
        this.redraw()
      }
    });
    k(f, "beforeRender", function () {
      this.mapNavigation = new h(this);
      this.mapNavigation.update()
    })
  })(x);
  (function (a) {
    var l =
      a.extend,
      h = a.pick,
      k = a.Pointer;
    a = a.wrap;
    l(k.prototype, {
      onContainerDblClick: function (a) {
        var f = this.chart;
        a = this.normalize(a);
        f.options.mapNavigation.enableDoubleClickZoomTo ? f.pointer.inClass(a.target, "highcharts-tracker") && f.hoverPoint && f.hoverPoint.zoomTo() : f.isInsidePlot(a.chartX - f.plotLeft, a.chartY - f.plotTop) && f.mapZoom(.5, f.xAxis[0].toValue(a.chartX), f.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
      },
      onContainerMouseWheel: function (a) {
        var f = this.chart,
          g;
        a = this.normalize(a);
        g = a.detail || -(a.wheelDelta /
          120);
        f.isInsidePlot(a.chartX - f.plotLeft, a.chartY - f.plotTop) && f.mapZoom(Math.pow(f.options.mapNavigation.mouseWheelSensitivity, g), f.xAxis[0].toValue(a.chartX), f.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
      }
    });
    a(k.prototype, "zoomOption", function (a) {
      var f = this.chart.options.mapNavigation;
      h(f.enableTouchZoom, f.enabled) && (this.chart.options.chart.pinchType = "xy");
      a.apply(this, [].slice.call(arguments, 1))
    });
    a(k.prototype, "pinchTranslate", function (a, h, g, k, l, e, b) {
      a.call(this, h, g, k, l, e, b);
      "map" === this.chart.options.chart.type &&
        this.hasZoom && (a = k.scaleX > k.scaleY, this.pinchTranslateDirection(!a, h, g, k, l, e, b, a ? k.scaleX : k.scaleY))
    })
  })(x);
  (function (a) {
    var l = a.colorPointMixin,
      h = a.each,
      k = a.extend,
      f = a.isNumber,
      q = a.map,
      g = a.merge,
      u = a.noop,
      t = a.pick,
      e = a.isArray,
      b = a.Point,
      d = a.Series,
      n = a.seriesType,
      r = a.seriesTypes,
      m = a.splat,
      v = void 0 !== a.doc.documentElement.style.vectorEffect;
    n("map", "scatter", {
      allAreas: !0,
      animation: !1,
      nullColor: "#f7f7f7",
      borderColor: "#cccccc",
      borderWidth: 1,
      marker: null,
      stickyTracking: !1,
      joinBy: "hc-key",
      dataLabels: {
        formatter: function () {
          return this.point.value
        },
        inside: !0,
        verticalAlign: "middle",
        crop: !1,
        overflow: !1,
        padding: 0
      },
      turboThreshold: 0,
      tooltip: {
        followPointer: !0,
        pointFormat: "{point.name}: {point.value}\x3cbr/\x3e"
      },
      states: {
        normal: {
          animation: !0
        },
        hover: {
          halo: null,
          brightness: .2
        },
        select: {
          color: "#cccccc"
        }
      }
    }, g(a.colorSeriesMixin, {
      type: "map",
      getExtremesFromAll: !0,
      useMapGeometry: !0,
      forceDL: !0,
      searchPoint: u,
      directTouch: !0,
      preserveAspectRatio: !0,
      pointArrayMap: ["value"],
      getBox: function (c) {
        var b = Number.MAX_VALUE,
          d = -b,
          e = b,
          m = -b,
          v = b,
          n = b,
          g = this.xAxis,
          k = this.yAxis,
          q;
        h(c || [], function (c) {
          if (c.path) {
            "string" === typeof c.path && (c.path = a.splitPath(c.path));
            var p = c.path || [],
              w = p.length,
              g = !1,
              h = -b,
              k = b,
              y = -b,
              r = b,
              A = c.properties;
            if (!c._foundBox) {
              for (; w--;) f(p[w]) && (g ? (h = Math.max(h, p[w]), k = Math.min(k, p[w])) : (y = Math.max(y, p[w]), r = Math.min(r, p[w])), g = !g);
              c._midX = k + (h - k) * t(c.middleX, A && A["hc-middle-x"], .5);
              c._midY = r + (y - r) * t(c.middleY, A && A["hc-middle-y"], .5);
              c._maxX = h;
              c._minX = k;
              c._maxY = y;
              c._minY = r;
              c.labelrank = t(c.labelrank, (h - k) * (y - r));
              c._foundBox = !0
            }
            d = Math.max(d, c._maxX);
            e = Math.min(e,
              c._minX);
            m = Math.max(m, c._maxY);
            v = Math.min(v, c._minY);
            n = Math.min(c._maxX - c._minX, c._maxY - c._minY, n);
            q = !0
          }
        });
        q && (this.minY = Math.min(v, t(this.minY, b)), this.maxY = Math.max(m, t(this.maxY, -b)), this.minX = Math.min(e, t(this.minX, b)), this.maxX = Math.max(d, t(this.maxX, -b)), g && void 0 === g.options.minRange && (g.minRange = Math.min(5 * n, (this.maxX - this.minX) / 5, g.minRange || b)), k && void 0 === k.options.minRange && (k.minRange = Math.min(5 * n, (this.maxY - this.minY) / 5, k.minRange || b)))
      },
      getExtremes: function () {
        d.prototype.getExtremes.call(this,
          this.valueData);
        this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;
        this.dataMin = this.minY;
        this.dataMax = this.maxY
      },
      translatePath: function (a) {
        var c = !1,
          b = this.xAxis,
          d = this.yAxis,
          e = b.min,
          m = b.transA,
          b = b.minPixelPadding,
          v = d.min,
          n = d.transA,
          d = d.minPixelPadding,
          g, h = [];
        if (a)
          for (g = a.length; g--;) f(a[g]) ? (h[g] = c ? (a[g] - e) * m + b : (a[g] - v) * n + d, c = !c) : h[g] = a[g];
        return h
      },
      setData: function (c, b, v, n) {
        var p = this.options,
          w = this.chart.options.chart,
          k = w && w.map,
          r = p.mapData,
          l = p.joinBy,
          t = null === l,
          B = p.keys || this.pointArrayMap,
          u = [],
          x = {},
          z = this.chart.mapTransforms;
        !r && k && (r = "string" === typeof k ? a.maps[k] : k);
        t && (l = "_i");
        l = this.joinBy = m(l);
        l[1] || (l[1] = l[0]);
        c && h(c, function (b, d) {
          var m = 0;
          if (f(b)) c[d] = {
            value: b
          };
          else if (e(b)) {
            c[d] = {};
            !p.keys && b.length > B.length && "string" === typeof b[0] && (c[d]["hc-key"] = b[0], ++m);
            for (var v = 0; v < B.length; ++v, ++m) B[v] && void 0 !== b[m] && (0 < B[v].indexOf(".") ? a.Point.prototype.setNestedProperty(c[d], b[m], B[v]) : c[d][B[v]] = b[m])
          }
          t && (c[d]._i =
            d)
        });
        this.getBox(c);
        (this.chart.mapTransforms = z = w && w.mapTransforms || r && r["hc-transform"] || z) && a.objectEach(z, function (a) {
          a.rotation && (a.cosAngle = Math.cos(a.rotation), a.sinAngle = Math.sin(a.rotation))
        });
        if (r) {
          "FeatureCollection" === r.type && (this.mapTitle = r.title, r = a.geojson(r, this.type, this));
          this.mapData = r;
          this.mapMap = {};
          for (z = 0; z < r.length; z++) w = r[z], k = w.properties, w._i = z, l[0] && k && k[l[0]] && (w[l[0]] = k[l[0]]), x[w[l[0]]] = w;
          this.mapMap = x;
          c && l[1] && h(c, function (a) {
            x[a[l[1]]] && u.push(x[a[l[1]]])
          });
          p.allAreas ?
            (this.getBox(r), c = c || [], l[1] && h(c, function (a) {
              u.push(a[l[1]])
            }), u = "|" + q(u, function (a) {
              return a && a[l[0]]
            }).join("|") + "|", h(r, function (a) {
              l[0] && -1 !== u.indexOf("|" + a[l[0]] + "|") || (c.push(g(a, {
                value: null
              })), n = !1)
            })) : this.getBox(u)
        }
        d.prototype.setData.call(this, c, b, v, n)
      },
      drawGraph: u,
      drawDataLabels: u,
      doFullTranslate: function () {
        return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans
      },
      translate: function () {
        var a = this,
          b = a.xAxis,
          d = a.yAxis,
          e = a.doFullTranslate();
        a.generatePoints();
        h(a.data, function (c) {
          c.plotX = b.toPixels(c._midX, !0);
          c.plotY = d.toPixels(c._midY, !0);
          e && (c.shapeType = "path", c.shapeArgs = {
            d: a.translatePath(c.path)
          })
        });
        a.translateColors()
      },
      pointAttribs: function (a, b) {
        a = r.column.prototype.pointAttribs.call(this, a, b);
        v ? a["vector-effect"] = "non-scaling-stroke" : a["stroke-width"] = "inherit";
        return a
      },
      drawPoints: function () {
        var a = this,
          b = a.xAxis,
          d = a.yAxis,
          e = a.group,
          m = a.chart,
          f = m.renderer,
          g, n, k, l, q = this.baseTrans,
          t, u, z, x, G;
        a.transformGroup || (a.transformGroup = f.g().attr({
          scaleX: 1,
          scaleY: 1
        }).add(e), a.transformGroup.survive = !0);
        a.doFullTranslate() ? (m.hasRendered && h(a.points, function (b) {
          b.shapeArgs && (b.shapeArgs.fill = a.pointAttribs(b, b.state).fill)
        }), a.group = a.transformGroup, r.column.prototype.drawPoints.apply(a), a.group = e, h(a.points, function (a) {
          a.graphic && (a.name && a.graphic.addClass("highcharts-name-" + a.name.replace(/ /g, "-").toLowerCase()), a.properties && a.properties["hc-key"] && a.graphic.addClass("highcharts-key-" + a.properties["hc-key"].toLowerCase()))
        }), this.baseTrans = {
          originX: b.min -
            b.minPixelPadding / b.transA,
          originY: d.min - d.minPixelPadding / d.transA + (d.reversed ? 0 : d.len / d.transA),
          transAX: b.transA,
          transAY: d.transA
        }, this.transformGroup.animate({
          translateX: 0,
          translateY: 0,
          scaleX: 1,
          scaleY: 1
        })) : (g = b.transA / q.transAX, n = d.transA / q.transAY, k = b.toPixels(q.originX, !0), l = d.toPixels(q.originY, !0), .99 < g && 1.01 > g && .99 < n && 1.01 > n && (n = g = 1, k = Math.round(k), l = Math.round(l)), t = this.transformGroup, m.renderer.globalAnimation ? (u = t.attr("translateX"), z = t.attr("translateY"), x = t.attr("scaleX"), G = t.attr("scaleY"),
          t.attr({
            animator: 0
          }).animate({
            animator: 1
          }, {
            step: function (a, b) {
              t.attr({
                translateX: u + (k - u) * b.pos,
                translateY: z + (l - z) * b.pos,
                scaleX: x + (g - x) * b.pos,
                scaleY: G + (n - G) * b.pos
              })
            }
          })) : t.attr({
          translateX: k,
          translateY: l,
          scaleX: g,
          scaleY: n
        }));
        v || a.group.element.setAttribute("stroke-width", a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] / (g || 1));
        this.drawMapDataLabels()
      },
      drawMapDataLabels: function () {
        d.prototype.drawDataLabels.call(this);
        this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)
      },
      render: function () {
        var a = this,
          b = d.prototype.render;
        a.chart.renderer.isVML && 3E3 < a.data.length ? setTimeout(function () {
          b.call(a)
        }) : b.call(a)
      },
      animate: function (a) {
        var b = this.options.animation,
          c = this.group,
          d = this.xAxis,
          e = this.yAxis,
          m = d.pos,
          f = e.pos;
        this.chart.renderer.isSVG && (!0 === b && (b = {
          duration: 1E3
        }), a ? c.attr({
          translateX: m + d.len / 2,
          translateY: f + e.len / 2,
          scaleX: .001,
          scaleY: .001
        }) : (c.animate({
          translateX: m,
          translateY: f,
          scaleX: 1,
          scaleY: 1
        }, b), this.animate = null))
      },
      animateDrilldown: function (a) {
        var b = this.chart.plotBox,
          c = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
          d = c.bBox,
          e = this.chart.options.drilldown.animation;
        a || (a = Math.min(d.width / b.width, d.height / b.height), c.shapeArgs = {
          scaleX: a,
          scaleY: a,
          translateX: d.x,
          translateY: d.y
        }, h(this.points, function (a) {
          a.graphic && a.graphic.attr(c.shapeArgs).animate({
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0
          }, e)
        }), this.animate = null)
      },
      drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
      animateDrillupFrom: function (a) {
        r.column.prototype.animateDrillupFrom.call(this,
          a)
      },
      animateDrillupTo: function (a) {
        r.column.prototype.animateDrillupTo.call(this, a)
      }
    }), k({
      applyOptions: function (a, d) {
        a = b.prototype.applyOptions.call(this, a, d);
        d = this.series;
        var c = d.joinBy;
        d.mapData && ((c = void 0 !== a[c[1]] && d.mapMap[a[c[1]]]) ? (d.xyFromShape && (a.x = c._midX, a.y = c._midY), k(a, c)) : a.value = a.value || null);
        return a
      },
      onMouseOver: function (c) {
        a.clearTimeout(this.colorInterval);
        if (null !== this.value || this.series.options.nullInteraction) b.prototype.onMouseOver.call(this, c);
        else this.series.onMouseOut(c)
      },
      zoomTo: function () {
        var a = this.series;
        a.xAxis.setExtremes(this._minX, this._maxX, !1);
        a.yAxis.setExtremes(this._minY, this._maxY, !1);
        a.chart.redraw()
      }
    }, l))
  })(x);
  (function (a) {
    var l = a.seriesType,
      h = a.seriesTypes;
    l("mapline", "map", {
      lineWidth: 1,
      fillColor: "none"
    }, {
      type: "mapline",
      colorProp: "stroke",
      pointAttrToOptions: {
        stroke: "color",
        "stroke-width": "lineWidth"
      },
      pointAttribs: function (a, f) {
        a = h.map.prototype.pointAttribs.call(this, a, f);
        a.fill = this.options.fillColor;
        return a
      },
      drawLegendSymbol: h.line.prototype.drawLegendSymbol
    })
  })(x);
  (function (a) {
    var l = a.merge,
      h = a.Point;
    a = a.seriesType;
    a("mappoint", "scatter", {
      dataLabels: {
        enabled: !0,
        formatter: function () {
          return this.point.name
        },
        crop: !1,
        defer: !1,
        overflow: !1,
        style: {
          color: "#000000"
        }
      }
    }, {
      type: "mappoint",
      forceDL: !0
    }, {
      applyOptions: function (a, f) {
        a = void 0 !== a.lat && void 0 !== a.lon ? l(a, this.series.chart.fromLatLonToPoint(a)) : a;
        return h.prototype.applyOptions.call(this, a, f)
      }
    })
  })(x);
  (function (a) {
    var l = a.arrayMax,
      h = a.arrayMin,
      k = a.Axis,
      f = a.color,
      q = a.each,
      g = a.isNumber,
      u = a.noop,
      t = a.pick,
      e = a.pInt,
      b = a.Point,
      d = a.Series,
      n = a.seriesType,
      r = a.seriesTypes;
    n("bubble", "scatter", {
      dataLabels: {
        formatter: function () {
          return this.point.z
        },
        inside: !0,
        verticalAlign: "middle"
      },
      animationLimit: 250,
      marker: {
        lineColor: null,
        lineWidth: 1,
        fillOpacity: .5,
        radius: null,
        states: {
          hover: {
            radiusPlus: 0
          }
        },
        symbol: "circle"
      },
      minSize: 8,
      maxSize: "20%",
      softThreshold: !1,
      states: {
        hover: {
          halo: {
            size: 5
          }
        }
      },
      tooltip: {
        pointFormat: "({point.x}, {point.y}), Size: {point.z}"
      },
      turboThreshold: 0,
      zThreshold: 0,
      zoneAxis: "z"
    }, {
      pointArrayMap: ["y", "z"],
      parallelArrays: ["x",
        "y", "z"
      ],
      trackerGroups: ["group", "dataLabelsGroup"],
      specialGroup: "group",
      bubblePadding: !0,
      zoneAxis: "z",
      directTouch: !0,
      pointAttribs: function (a, b) {
        var c = this.options.marker.fillOpacity;
        a = d.prototype.pointAttribs.call(this, a, b);
        1 !== c && (a.fill = f(a.fill).setOpacity(c).get("rgba"));
        return a
      },
      getRadii: function (a, b, c, d) {
        var e, m, f, p = this.zData,
          g = [],
          n = this.options,
          v = "width" !== n.sizeBy,
          h = n.zThreshold,
          k = b - a;
        m = 0;
        for (e = p.length; m < e; m++) f = p[m], n.sizeByAbsoluteValue && null !== f && (f = Math.abs(f - h), b = k = Math.max(b - h, Math.abs(a -
          h)), a = 0), null === f ? f = null : f < a ? f = c / 2 - 1 : (f = 0 < k ? (f - a) / k : .5, v && 0 <= f && (f = Math.sqrt(f)), f = Math.ceil(c + f * (d - c)) / 2), g.push(f);
        this.radii = g
      },
      animate: function (a) {
        !a && this.points.length < this.options.animationLimit && (q(this.points, function (a) {
          var b = a.graphic,
            d;
          b && b.width && (d = {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height
          }, b.attr({
            x: a.plotX,
            y: a.plotY,
            width: 1,
            height: 1
          }), b.animate(d, this.options.animation))
        }, this), this.animate = null)
      },
      translate: function () {
        var b, d = this.data,
          c, e, f = this.radii;
        r.scatter.prototype.translate.call(this);
        for (b = d.length; b--;) c = d[b], e = f ? f[b] : 0, g(e) && e >= this.minPxSize / 2 ? (c.marker = a.extend(c.marker, {
          radius: e,
          width: 2 * e,
          height: 2 * e
        }), c.dlBox = {
          x: c.plotX - e,
          y: c.plotY - e,
          width: 2 * e,
          height: 2 * e
        }) : c.shapeArgs = c.plotY = c.dlBox = void 0
      },
      alignDataLabel: r.column.prototype.alignDataLabel,
      buildKDTree: u,
      applyZones: u
    }, {
      haloPath: function (a) {
        return b.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
      },
      ttBelow: !1
    });
    k.prototype.beforePadding = function () {
      var a = this,
        b = this.len,
        c = this.chart,
        d = 0,
        f = b,
        n = this.isXAxis,
        k = n ? "xData" : "yData",
        r = this.min,
        u = {},
        x = Math.min(c.plotWidth, c.plotHeight),
        A = Number.MAX_VALUE,
        D = -Number.MAX_VALUE,
        E = this.max - r,
        C = b / E,
        F = [];
      q(this.series, function (b) {
        var d = b.options;
        !b.bubblePadding || !b.visible && c.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, F.push(b), n && (q(["minSize", "maxSize"], function (a) {
          var b = d[a],
            c = /%$/.test(b),
            b = e(b);
          u[a] = c ? x * b / 100 : b
        }), b.minPxSize = u.minSize, b.maxPxSize = Math.max(u.maxSize, u.minSize), b = b.zData, b.length && (A = t(d.zMin, Math.min(A, Math.max(h(b), !1 === d.displayNegative ?
          d.zThreshold : -Number.MAX_VALUE))), D = t(d.zMax, Math.max(D, l(b))))))
      });
      q(F, function (b) {
        var c = b[k],
          e = c.length,
          m;
        n && b.getRadii(A, D, b.minPxSize, b.maxPxSize);
        if (0 < E)
          for (; e--;) g(c[e]) && a.dataMin <= c[e] && c[e] <= a.dataMax && (m = b.radii[e], d = Math.min((c[e] - r) * C - m, d), f = Math.max((c[e] - r) * C + m, f))
      });
      F.length && 0 < E && !this.isLog && (f -= b, C *= (b + d - f) / b, q([
        ["min", "userMin", d],
        ["max", "userMax", f]
      ], function (b) {
        void 0 === t(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C)
      }))
    }
  })(x);
  (function (a) {
    var l = a.merge,
      h = a.Point,
      k = a.seriesType,
      f = a.seriesTypes;
    f.bubble && k("mapbubble", "bubble", {
      animationLimit: 500,
      tooltip: {
        pointFormat: "{point.name}: {point.z}"
      }
    }, {
      xyFromShape: !0,
      type: "mapbubble",
      pointArrayMap: ["z"],
      getMapData: f.map.prototype.getMapData,
      getBox: f.map.prototype.getBox,
      setData: f.map.prototype.setData
    }, {
      applyOptions: function (a, g) {
        return a && void 0 !== a.lat && void 0 !== a.lon ? h.prototype.applyOptions.call(this, l(a, this.series.chart.fromLatLonToPoint(a)), g) : f.map.prototype.pointClass.prototype.applyOptions.call(this, a, g)
      },
      isValid: function () {
        return "number" ===
          typeof this.z
      },
      ttBelow: !1
    })
  })(x);
  (function (a) {
    var l = a.colorPointMixin,
      h = a.each,
      k = a.merge,
      f = a.noop,
      q = a.pick,
      g = a.Series,
      u = a.seriesType,
      t = a.seriesTypes;
    u("heatmap", "scatter", {
      animation: !1,
      borderWidth: 0,
      nullColor: "#f7f7f7",
      dataLabels: {
        formatter: function () {
          return this.point.value
        },
        inside: !0,
        verticalAlign: "middle",
        crop: !1,
        overflow: !1,
        padding: 0
      },
      marker: null,
      pointRange: null,
      tooltip: {
        pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"
      },
      states: {
        hover: {
          halo: !1,
          brightness: .2
        }
      }
    }, k(a.colorSeriesMixin, {
      pointArrayMap: ["y", "value"],
      hasPointSpecificOptions: !0,
      getExtremesFromAll: !0,
      directTouch: !0,
      init: function () {
        var a;
        t.scatter.prototype.init.apply(this, arguments);
        a = this.options;
        a.pointRange = q(a.pointRange, a.colsize || 1);
        this.yAxis.axisPointRange = a.rowsize || 1
      },
      translate: function () {
        var a = this.options,
          b = this.xAxis,
          d = this.yAxis,
          f = a.pointPadding || 0,
          g = function (a, b, c) {
            return Math.min(Math.max(b, a), c)
          };
        this.generatePoints();
        h(this.points, function (e) {
          var n = (a.colsize || 1) / 2,
            c = (a.rowsize || 1) / 2,
            m = g(Math.round(b.len -
              b.translate(e.x - n, 0, 1, 0, 1)), -b.len, 2 * b.len),
            n = g(Math.round(b.len - b.translate(e.x + n, 0, 1, 0, 1)), -b.len, 2 * b.len),
            h = g(Math.round(d.translate(e.y - c, 0, 1, 0, 1)), -d.len, 2 * d.len),
            c = g(Math.round(d.translate(e.y + c, 0, 1, 0, 1)), -d.len, 2 * d.len),
            k = q(e.pointPadding, f);
          e.plotX = e.clientX = (m + n) / 2;
          e.plotY = (h + c) / 2;
          e.shapeType = "rect";
          e.shapeArgs = {
            x: Math.min(m, n) + k,
            y: Math.min(h, c) + k,
            width: Math.abs(n - m) - 2 * k,
            height: Math.abs(c - h) - 2 * k
          }
        });
        this.translateColors()
      },
      drawPoints: function () {
        t.column.prototype.drawPoints.call(this);
        h(this.points,
          function (a) {
            a.graphic.attr(this.colorAttribs(a))
          }, this)
      },
      animate: f,
      getBox: f,
      drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
      alignDataLabel: t.column.prototype.alignDataLabel,
      getExtremes: function () {
        g.prototype.getExtremes.call(this, this.valueData);
        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;
        g.prototype.getExtremes.call(this)
      }
    }), a.extend({
      haloPath: function (a) {
        if (!a) return [];
        var b = this.shapeArgs;
        return ["M", b.x - a, b.y - a, "L", b.x - a, b.y + b.height + a, b.x + b.width + a, b.y + b.height + a, b.x + b.width + a, b.y -
          a, "Z"
        ]
      }
    }, l))
  })(x);
  (function (a) {
    function l(a, b) {
      var d, e, f, g = !1,
        h = a.x,
        c = a.y;
      a = 0;
      for (d = b.length - 1; a < b.length; d = a++) e = b[a][1] > c, f = b[d][1] > c, e !== f && h < (b[d][0] - b[a][0]) * (c - b[a][1]) / (b[d][1] - b[a][1]) + b[a][0] && (g = !g);
      return g
    }
    var h = a.Chart,
      k = a.each,
      f = a.extend,
      q = a.format,
      g = a.merge,
      u = a.win,
      t = a.wrap;
    h.prototype.transformFromLatLon = function (e, b) {
      if (void 0 === u.proj4) return a.error(21), {
        x: 0,
        y: null
      };
      e = u.proj4(b.crs, [e.lon, e.lat]);
      var d = b.cosAngle || b.rotation && Math.cos(b.rotation),
        f = b.sinAngle || b.rotation && Math.sin(b.rotation);
      e = b.rotation ? [e[0] * d + e[1] * f, -e[0] * f + e[1] * d] : e;
      return {
        x: ((e[0] - (b.xoffset || 0)) * (b.scale || 1) + (b.xpan || 0)) * (b.jsonres || 1) + (b.jsonmarginX || 0),
        y: (((b.yoffset || 0) - e[1]) * (b.scale || 1) + (b.ypan || 0)) * (b.jsonres || 1) - (b.jsonmarginY || 0)
      }
    };
    h.prototype.transformToLatLon = function (e, b) {
      if (void 0 === u.proj4) a.error(21);
      else {
        e = {
          x: ((e.x - (b.jsonmarginX || 0)) / (b.jsonres || 1) - (b.xpan || 0)) / (b.scale || 1) + (b.xoffset || 0),
          y: ((-e.y - (b.jsonmarginY || 0)) / (b.jsonres || 1) + (b.ypan || 0)) / (b.scale || 1) + (b.yoffset || 0)
        };
        var d = b.cosAngle || b.rotation &&
          Math.cos(b.rotation),
          f = b.sinAngle || b.rotation && Math.sin(b.rotation);
        b = u.proj4(b.crs, "WGS84", b.rotation ? {
          x: e.x * d + e.y * -f,
          y: e.x * f + e.y * d
        } : e);
        return {
          lat: b.y,
          lon: b.x
        }
      }
    };
    h.prototype.fromPointToLatLon = function (e) {
      var b = this.mapTransforms,
        d;
      if (b) {
        for (d in b)
          if (b.hasOwnProperty(d) && b[d].hitZone && l({
              x: e.x,
              y: -e.y
            }, b[d].hitZone.coordinates[0])) return this.transformToLatLon(e, b[d]);
        return this.transformToLatLon(e, b["default"])
      }
      a.error(22)
    };
    h.prototype.fromLatLonToPoint = function (e) {
      var b = this.mapTransforms,
        d, f;
      if (!b) return a.error(22), {
        x: 0,
        y: null
      };
      for (d in b)
        if (b.hasOwnProperty(d) && b[d].hitZone && (f = this.transformFromLatLon(e, b[d]), l({
            x: f.x,
            y: -f.y
          }, b[d].hitZone.coordinates[0]))) return f;
      return this.transformFromLatLon(e, b["default"])
    };
    a.geojson = function (a, b, d) {
      var e = [],
        g = [],
        h = function (a) {
          var b, d = a.length;
          g.push("M");
          for (b = 0; b < d; b++) 1 === b && g.push("L"), g.push(a[b][0], -a[b][1])
        };
      b = b || "map";
      k(a.features, function (a) {
        var d = a.geometry,
          n = d.type,
          d = d.coordinates;
        a = a.properties;
        var m;
        g = [];
        "map" === b || "mapbubble" ===
          b ? ("Polygon" === n ? (k(d, h), g.push("Z")) : "MultiPolygon" === n && (k(d, function (a) {
            k(a, h)
          }), g.push("Z")), g.length && (m = {
            path: g
          })) : "mapline" === b ? ("LineString" === n ? h(d) : "MultiLineString" === n && k(d, h), g.length && (m = {
            path: g
          })) : "mappoint" === b && "Point" === n && (m = {
            x: d[0],
            y: -d[1]
          });
        m && e.push(f(m, {
          name: a.name || a.NAME,
          properties: a
        }))
      });
      d && a.copyrightShort && (d.chart.mapCredits = q(d.chart.options.credits.mapText, {
        geojson: a
      }), d.chart.mapCreditsFull = q(d.chart.options.credits.mapTextFull, {
        geojson: a
      }));
      return e
    };
    t(h.prototype,
      "addCredits",
      function (a, b) {
        b = g(!0, this.options.credits, b);
        this.mapCredits && (b.href = null);
        a.call(this, b);
        this.credits && this.mapCreditsFull && this.credits.attr({
          title: this.mapCreditsFull
        })
      })
  })(x);
  (function (a) {
    function l(a, b, e, f, g, c, h, k) {
      return ["M", a + g, b, "L", a + e - c, b, "C", a + e - c / 2, b, a + e, b + c / 2, a + e, b + c, "L", a + e, b + f - h, "C", a + e, b + f - h / 2, a + e - h / 2, b + f, a + e - h, b + f, "L", a + k, b + f, "C", a + k / 2, b + f, a, b + f - k / 2, a, b + f - k, "L", a, b + g, "C", a, b + g / 2, a + g / 2, b, a + g, b, "Z"]
    }
    var h = a.Chart,
      k = a.defaultOptions,
      f = a.each,
      q = a.extend,
      g = a.merge,
      u = a.pick,
      t = a.Renderer,
      e = a.SVGRenderer,
      b = a.VMLRenderer;
    q(k.lang, {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out"
    });
    k.mapNavigation = {
      buttonOptions: {
        alignTo: "plotBox",
        align: "left",
        verticalAlign: "top",
        x: 0,
        width: 18,
        height: 18,
        padding: 5,
        style: {
          fontSize: "15px",
          fontWeight: "bold"
        },
        theme: {
          "stroke-width": 1,
          "text-align": "center"
        }
      },
      buttons: {
        zoomIn: {
          onclick: function () {
            this.mapZoom(.5)
          },
          text: "+",
          y: 0
        },
        zoomOut: {
          onclick: function () {
            this.mapZoom(2)
          },
          text: "-",
          y: 28
        }
      },
      mouseWheelSensitivity: 1.1
    };
    a.splitPath = function (a) {
      var b;
      a = a.replace(/([A-Za-z])/g,
        " $1 ");
      a = a.replace(/^\s*/, "").replace(/\s*$/, "");
      a = a.split(/[ ,]+/);
      for (b = 0; b < a.length; b++) /[a-zA-Z]/.test(a[b]) || (a[b] = parseFloat(a[b]));
      return a
    };
    a.maps = {};
    e.prototype.symbols.topbutton = function (a, b, e, f, g) {
      return l(a - 1, b - 1, e, f, g.r, g.r, 0, 0)
    };
    e.prototype.symbols.bottombutton = function (a, b, e, f, g) {
      return l(a - 1, b - 1, e, f, 0, 0, g.r, g.r)
    };
    t === b && f(["topbutton", "bottombutton"], function (a) {
      b.prototype.symbols[a] = e.prototype.symbols[a]
    });
    a.Map = a.mapChart = function (b, e, f) {
      var d = "string" === typeof b || b.nodeName,
        k = arguments[d ? 1 : 0],
        c = {
          endOnTick: !1,
          visible: !1,
          minPadding: 0,
          maxPadding: 0,
          startOnTick: !1
        },
        l, n = a.getOptions().credits;
      l = k.series;
      k.series = null;
      k = g({
        chart: {
          panning: "xy",
          type: "map"
        },
        credits: {
          mapText: u(n.mapText, ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),
          mapTextFull: u(n.mapTextFull, "{geojson.copyright}")
        },
        tooltip: {
          followTouchMove: !1
        },
        xAxis: c,
        yAxis: g(c, {
          reversed: !0
        })
      }, k, {
        chart: {
          inverted: !1,
          alignTicks: !1
        }
      });
      k.series = l;
      return d ? new h(b, k, f) : new h(k, e)
    }
  })(x)
});


/*
 Highcharts JS v6.1.0 (2018-04-13)
 Exporting module

 (c) 2010-2017 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(h){"object"===typeof module&&module.exports?module.exports=h:h(Highcharts)})(function(h){(function(f){var h=f.defaultOptions,z=f.doc,A=f.Chart,w=f.addEvent,H=f.removeEvent,D=f.fireEvent,q=f.createElement,B=f.discardElement,u=f.css,p=f.merge,r=f.pick,k=f.each,E=f.objectEach,t=f.extend,I=f.isTouchDevice,C=f.win,F=C.navigator.userAgent,J=f.Renderer.prototype.symbols;/Edge\/|Trident\/|MSIE /.test(F);/firefox/i.test(F);t(h.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",
downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});h.navigation={buttonOptions:{theme:{},symbolSize:14,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,verticalAlign:"top",width:24}};p(!0,h.navigation,{menuStyle:{border:"1px solid #999999",background:"#ffffff",padding:"5px 0"},menuItemStyle:{padding:"0.5em 1em",background:"none",color:"#333333",fontSize:I?"14px":"11px",transition:"background 250ms, color 250ms"},menuItemHoverStyle:{background:"#335cad",
color:"#ffffff"},buttonOptions:{symbolFill:"#666666",symbolStroke:"#666666",symbolStrokeWidth:3,theme:{fill:"#ffffff",stroke:"none",padding:5}}});h.exporting={type:"image/png",url:"https://export.highcharts.com/",printMaxWidth:780,scale:2,buttons:{contextButton:{className:"highcharts-contextbutton",menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:"printChart separator downloadPNG downloadJPEG downloadPDF downloadSVG".split(" ")}},menuItemDefinitions:{printChart:{textKey:"printChart",
onclick:function(){this.print()}},separator:{separator:!0},downloadPNG:{textKey:"downloadPNG",onclick:function(){this.exportChart()}},downloadJPEG:{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},downloadPDF:{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},downloadSVG:{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}}};f.post=function(a,b,e){var c=q("form",p({method:"post",action:a,enctype:"multipart/form-data"},
e),{display:"none"},z.body);E(b,function(a,b){q("input",{type:"hidden",name:b,value:a},null,c)});c.submit();B(c)};t(A.prototype,{sanitizeSVG:function(a,b){if(b&&b.exporting&&b.exporting.allowHTML){var e=a.match(/<\/svg>(.*?$)/);e&&e[1]&&(e='\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"'+b.chart.width+'" height\x3d"'+b.chart.height+'"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e'+e[1]+"\x3c/body\x3e\x3c/foreignObject\x3e",a=a.replace("\x3c/svg\x3e",e+"\x3c/svg\x3e"))}a=a.replace(/zIndex="[^"]+"/g,
"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g,"url($2)").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+\:)href=/g," xlink:href\x3d").replace(/\n/," ").replace(/<\/svg>.*?$/,"\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g,
"\u00a0").replace(/&shy;/g,"\u00ad");this.ieSanitizeSVG&&(a=this.ieSanitizeSVG(a));return a},getChartHTML:function(){return this.container.innerHTML},getSVG:function(a){var b,e,c,v,m,g=p(this.options,a);e=q("div",null,{position:"absolute",top:"-9999em",width:this.chartWidth+"px",height:this.chartHeight+"px"},z.body);c=this.renderTo.style.width;m=this.renderTo.style.height;c=g.exporting.sourceWidth||g.chart.width||/px$/.test(c)&&parseInt(c,10)||600;m=g.exporting.sourceHeight||g.chart.height||/px$/.test(m)&&
parseInt(m,10)||400;t(g.chart,{animation:!1,renderTo:e,forExport:!0,renderer:"SVGRenderer",width:c,height:m});g.exporting.enabled=!1;delete g.data;g.series=[];k(this.series,function(a){v=p(a.userOptions,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:a.visible});v.isInternal||g.series.push(v)});k(this.axes,function(a){a.userOptions.internalKey||(a.userOptions.internalKey=f.uniqueKey())});b=new f.Chart(g,this.callback);a&&k(["xAxis","yAxis","series"],function(c){var d={};a[c]&&(d[c]=a[c],
b.update(d))});k(this.axes,function(a){var c=f.find(b.axes,function(b){return b.options.internalKey===a.userOptions.internalKey}),d=a.getExtremes(),e=d.userMin,d=d.userMax;!c||void 0===e&&void 0===d||c.setExtremes(e,d,!0,!1)});c=b.getChartHTML();c=this.sanitizeSVG(c,g);g=null;b.destroy();B(e);return c},getSVGForExport:function(a,b){var e=this.options.exporting;return this.getSVG(p({chart:{borderRadius:0}},e.chartOptions,b,{exporting:{sourceWidth:a&&a.sourceWidth||e.sourceWidth,sourceHeight:a&&a.sourceHeight||
e.sourceHeight}}))},exportChart:function(a,b){b=this.getSVGForExport(a,b);a=p(this.options.exporting,a);f.post(a.url,{filename:a.filename||"chart",type:a.type,width:a.width||0,scale:a.scale,svg:b},a.formAttributes)},print:function(){var a=this,b=a.container,e=[],c=b.parentNode,f=z.body,m=f.childNodes,g=a.options.exporting.printMaxWidth,d,n;if(!a.isPrinting){a.isPrinting=!0;a.pointer.reset(null,0);D(a,"beforePrint");if(n=g&&a.chartWidth>g)d=[a.options.chart.width,void 0,!1],a.setSize(g,void 0,!1);
k(m,function(a,b){1===a.nodeType&&(e[b]=a.style.display,a.style.display="none")});f.appendChild(b);C.focus();C.print();setTimeout(function(){c.appendChild(b);k(m,function(a,b){1===a.nodeType&&(a.style.display=e[b])});a.isPrinting=!1;n&&a.setSize.apply(a,d);D(a,"afterPrint")},1E3)}},contextMenu:function(a,b,e,c,v,m,g){var d=this,n=d.options.navigation,h=d.chartWidth,G=d.chartHeight,p="cache-"+a,l=d[p],x=Math.max(v,m),y,r;l||(d[p]=l=q("div",{className:a},{position:"absolute",zIndex:1E3,padding:x+"px"},
d.container),y=q("div",{className:"highcharts-menu"},null,l),u(y,t({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},n.menuStyle)),r=function(){u(l,{display:"none"});g&&g.setState(0);d.openMenu=!1},d.exportEvents.push(w(l,"mouseleave",function(){l.hideTimer=setTimeout(r,500)}),w(l,"mouseenter",function(){f.clearTimeout(l.hideTimer)}),w(z,"mouseup",function(b){d.pointer.inClass(b.target,a)||r()})),k(b,function(a){"string"===typeof a&&(a=d.options.exporting.menuItemDefinitions[a]);
if(f.isObject(a,!0)){var b;a.separator?b=q("hr",null,null,y):(b=q("div",{className:"highcharts-menu-item",onclick:function(b){b&&b.stopPropagation();r();a.onclick&&a.onclick.apply(d,arguments)},innerHTML:a.text||d.options.lang[a.textKey]},null,y),b.onmouseover=function(){u(this,n.menuItemHoverStyle)},b.onmouseout=function(){u(this,n.menuItemStyle)},u(b,t({cursor:"pointer"},n.menuItemStyle)));d.exportDivElements.push(b)}}),d.exportDivElements.push(y,l),d.exportMenuWidth=l.offsetWidth,d.exportMenuHeight=
l.offsetHeight);b={display:"block"};e+d.exportMenuWidth>h?b.right=h-e-v-x+"px":b.left=e-x+"px";c+m+d.exportMenuHeight>G&&"top"!==g.alignOptions.verticalAlign?b.bottom=G-c-x+"px":b.top=c+m-x+"px";u(l,b);d.openMenu=!0},addButton:function(a){var b=this,e=b.renderer,c=p(b.options.navigation.buttonOptions,a),f=c.onclick,m=c.menuItems,g,d,n=c.symbolSize||12;b.btnCount||(b.btnCount=0);b.exportDivElements||(b.exportDivElements=[],b.exportSVGElements=[]);if(!1!==c.enabled){var h=c.theme,k=h.states,q=k&&k.hover,
k=k&&k.select,l;delete h.states;f?l=function(a){a.stopPropagation();f.call(b,a)}:m&&(l=function(){b.contextMenu(d.menuClassName,m,d.translateX,d.translateY,d.width,d.height,d);d.setState(2)});c.text&&c.symbol?h.paddingLeft=r(h.paddingLeft,25):c.text||t(h,{width:c.width,height:c.height,padding:0});d=e.button(c.text,0,0,l,h,q,k).addClass(a.className).attr({"stroke-linecap":"round",title:r(b.options.lang[c._titleKey],""),zIndex:3});d.menuClassName=a.menuClassName||"highcharts-menu-"+b.btnCount++;c.symbol&&
(g=e.symbol(c.symbol,c.symbolX-n/2,c.symbolY-n/2,n,n,{width:n,height:n}).addClass("highcharts-button-symbol").attr({zIndex:1}).add(d),g.attr({stroke:c.symbolStroke,fill:c.symbolFill,"stroke-width":c.symbolStrokeWidth||1}));d.add().align(t(c,{width:d.width,x:r(c.x,b.buttonOffset)}),!0,"spacingBox");b.buttonOffset+=(d.width+c.buttonSpacing)*("right"===c.align?-1:1);b.exportSVGElements.push(d,g)}},destroyExport:function(a){var b=a?a.target:this;a=b.exportSVGElements;var e=b.exportDivElements,c=b.exportEvents,
h;a&&(k(a,function(a,c){a&&(a.onclick=a.ontouchstart=null,h="cache-"+a.menuClassName,b[h]&&delete b[h],b.exportSVGElements[c]=a.destroy())}),a.length=0);e&&(k(e,function(a,c){f.clearTimeout(a.hideTimer);H(a,"mouseleave");b.exportDivElements[c]=a.onmouseout=a.onmouseover=a.ontouchstart=a.onclick=null;B(a)}),e.length=0);c&&(k(c,function(a){a()}),c.length=0)}});J.menu=function(a,b,e,c){return["M",a,b+2.5,"L",a+e,b+2.5,"M",a,b+c/2+.5,"L",a+e,b+c/2+.5,"M",a,b+c-1.5,"L",a+e,b+c-1.5]};A.prototype.renderExporting=
function(){var a=this,b=a.options.exporting,e=b.buttons,c=a.isDirtyExporting||!a.exportSVGElements;a.buttonOffset=0;a.isDirtyExporting&&a.destroyExport();c&&!1!==b.enabled&&(a.exportEvents=[],E(e,function(b){a.addButton(b)}),a.isDirtyExporting=!1);w(a,"destroy",a.destroyExport)};A.prototype.callbacks.push(function(a){a.renderExporting();w(a,"redraw",a.renderExporting);k(["exporting","navigation"],function(b){a[b]={update:function(e,c){a.isDirtyExporting=!0;p(!0,a.options[b],e);r(c,!0)&&a.redraw()}}})})})(h)});


Highcharts.maps["custom/world"] = {"title":"World, Miller projection, medium resolution","version":"1.1.2","type":"FeatureCollection","copyright":"Copyright (c) 2015 Highsoft AS, Based on data from Natural Earth","copyrightShort":"Natural Earth","copyrightUrl":"http://www.naturalearthdata.com","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:54003"}},"hc-transform":{"default":{"crs":"+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R_A +datum=WGS84 +units=m +no_defs","scale":1.72182781654e-05,"jsonres":15.5,"jsonmarginX":-999,"jsonmarginY":9851.0,"xoffset":-19495356.3693,"yoffset":12635908.1982}},
"features":[{"type":"Feature","id":"FO","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.54,"hc-key":"fo","hc-a2":"FO","name":"Faroe Islands","labelrank":"6","country-abbrev":"Faeroe Is.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"FRO","iso-a2":"FO","woe-id":"23424816","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[3991,8611],[4005,8598],[4004,8594],[3989,8605],[3991,8611]]]}},{"type":"Feature","id":"UM","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.58,"hc-key":"um","hc-a2":"UM","name":"United States Minor Outlying Islands","labelrank":"5","country-abbrev":"U.S. MOI","subregion":"Seven seas (open ocean)","region-wb":"East Asia & Pacific","iso-a3":"UMI","iso-a2":"UM","woe-id":"28289407","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[-605,6652],[-606,6652],[-606,6652],[-606,6652],[-605,6652]]]}},{"type":"Feature","id":"US","properties":{"hc-group":"admin0","hc-middle-x":0.68,"hc-middle-y":0.68,"hc-key":"us","hc-a2":"US","name":"United States of America","labelrank":"2","country-abbrev":"U.S.A.","subregion":"Northern America","region-wb":"North America","iso-a3":"USA","iso-a2":"US","woe-id":"23424977","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[556,8034],[559,8032],[549,8036],[550,8040],[556,8034]]],[[[558,8043],[561,8042],[558,8039],[553,8040],[558,8043]]],[[[265,8289],[268,8289],[267,8283],[263,8288],[265,8289]]],[[[263,8300],[267,8295],[264,8292],[261,8294],[263,8300]]],[[[255,8300],[267,8279],[253,8290],[251,8302],[255,8300]]],[[[306,8298],[305,8293],[298,8293],[300,8304],[306,8298]]],[[[249,8306],[250,8302],[245,8301],[244,8305],[249,8306]]],[[[292,8310],[298,8305],[294,8298],[291,8308],[292,8310]]],[[[238,8311],[244,8313],[244,8308],[238,8304],[238,8311]]],[[[249,8311],[248,8310],[244,8314],[249,8314],[249,8311]]],[[[232,8330],[237,8337],[249,8340],[245,8335],[232,8330]]],[[[272,8342],[284,8338],[278,8330],[268,8336],[272,8342]]],[[[268,8353],[268,8346],[255,8348],[259,8353],[268,8353]]],[[[282,8349],[285,8339],[276,8346],[276,8355],[282,8349]]],[[[261,8368],[271,8358],[264,8355],[259,8356],[261,8368]]],[[[234,8379],[258,8373],[253,8353],[237,8353],[234,8379]]],[[[181,8386],[179,8377],[173,8376],[177,8383],[181,8386]]],[[[158,8420],[155,8412],[152,8416],[154,8423],[158,8420]]],[[[1578,8023],[1574,8018],[1559,8010],[1556,8013],[1578,8023]]],[[[1623,7918],[1621,7909],[1614,7899],[1610,7903],[1623,7918]]],[[[1667,7934],[1667,7928],[1663,7927],[1665,7933],[1667,7934]]],[[[1724,7944],[1726,7939],[1717,7939],[1721,7943],[1724,7944]]],[[[224,8331],[215,8369],[227,8371],[236,8359],[224,8331]]],[[[-726,8256],[-740,8233],[-777,8227],[-811,8206],[-792,8230],[-757,8230],[-757,8246],[-726,8256]]],[[[193,8378],[186,8400],[202,8387],[208,8341],[193,8378]]],[[[183,8412],[177,8392],[156,8412],[174,8431],[183,8412]]],[[[199,8431],[221,8424],[229,8389],[214,8393],[199,8431]]],[[[-826,8660],[-803,8657],[-834,8641],[-862,8661],[-896,8667],[-850,8675],[-826,8660]]],[[[553,8054],[551,8053],[551,8054],[553,8054]]],[[[1261,7281],[1260,7293],[1252,7296],[1228,7335],[1206,7373],[1202,7375],[1200,7378],[1167,7387],[1143,7358],[1102,7380],[1091,7409],[1043,7449],[993,7449],[993,7434],[908,7434],[797,7472],[799,7479],[728,7473],[722,7492],[686,7523],[648,7524],[624,7541],[571,7629],[568,7651],[532,7689],[528,7720],[512,7742],[522,7777],[507,7826],[520,7864],[527,7925],[507,8030],[563,8020],[563,8024],[573,8014],[562,8025],[562,8026],[566,8031],[562,8027],[561,8054],[1379,8054],[1455,8037],[1491,8018],[1546,8016],[1503,7997],[1471,7971],[1510,7975],[1520,7963],[1574,7988],[1575,7986],[1575,7988],[1591,7997],[1601,7995],[1583,7981],[1612,7961],[1683,7971],[1697,7959],[1708,7961],[1708,7954],[1689,7936],[1622,7938],[1592,7889],[1612,7898],[1595,7842],[1598,7806],[1614,7783],[1632,7792],[1645,7831],[1636,7855],[1644,7893],[1694,7935],[1726,7918],[1730,7880],[1715,7868],[1750,7865],[1758,7833],[1755,7820],[1751,7816],[1746,7820],[1739,7807],[1727,7787],[1756,7775],[1780,7780],[1855,7817],[1862,7830],[1858,7836],[1858,7842],[1927,7844],[1955,7886],[1970,7900],[1987,7905],[1987,7905],[2082,7905],[2118,7937],[2126,7968],[2149,7996],[2192,7982],[2192,7933],[2196,7927],[2203,7927],[2202,7914],[2210,7911],[2216,7898],[2179,7882],[2181,7881],[2174,7874],[2173,7879],[2173,7879],[2164,7875],[2168,7876],[2168,7870],[2163,7871],[2161,7874],[2155,7872],[2110,7843],[2108,7787],[2041,7770],[2006,7747],[2005,7718],[1959,7656],[1937,7700],[1941,7654],[1934,7620],[1948,7620],[1956,7577],[1933,7542],[1915,7545],[1890,7517],[1854,7495],[1795,7447],[1786,7414],[1814,7342],[1829,7289],[1819,7237],[1797,7235],[1766,7277],[1746,7323],[1752,7355],[1710,7394],[1682,7378],[1650,7401],[1567,7404],[1544,7395],[1558,7358],[1533,7373],[1514,7361],[1485,7382],[1464,7376],[1411,7380],[1340,7337],[1309,7290],[1321,7262],[1289,7265],[1261,7281]]],[[[247,8324],[243,8322],[239,8327],[247,8327],[248,8327],[252,8348],[288,8301],[287,8280],[261,8307],[246,8319],[247,8324]]],[[[-425,7092],[-433,7100],[-433,7100],[-426,7097],[-425,7092],[-425,7092],[-425,7092]]],[[[-425,7092],[-390,7060],[-422,7047],[-425,7092],[-425,7092],[-425,7092]]],[[[308,8292],[307,8287],[302,8290],[308,8292],[308,8292],[308,8292]]],[[[217,8430],[220,8427],[210,8429],[210,8433],[205,8435],[148,8429],[100,8466],[54,8486],[-34,8511],[-77,8513],[-132,8528],[-131,8544],[-185,8544],[-179,8506],[-229,8506],[-240,8492],[-304,8469],[-282,8489],[-303,8495],[-289,8538],[-261,8553],[-264,8566],[-317,8528],[-328,8503],[-369,8479],[-346,8459],[-377,8422],[-432,8396],[-465,8356],[-478,8363],[-510,8328],[-540,8328],[-589,8308],[-615,8286],[-687,8268],[-679,8288],[-643,8297],[-585,8332],[-551,8327],[-555,8346],[-513,8369],[-478,8400],[-458,8457],[-516,8437],[-555,8465],[-597,8443],[-595,8484],[-613,8511],[-651,8497],[-693,8522],[-709,8506],[-741,8500],[-765,8515],[-713,8520],[-680,8544],[-726,8574],[-715,8598],[-667,8655],[-644,8644],[-615,8663],[-568,8678],[-587,8710],[-579,8735],[-637,8709],[-728,8718],[-784,8772],[-702,8808],[-655,8816],[-653,8790],[-599,8787],[-594,8837],[-655,8842],[-667,8867],[-741,8904],[-729,8932],[-673,8934],[-637,8959],[-638,8973],[-601,9009],[-570,9009],[-534,9034],[-486,9036],[-450,9061],[-399,9052],[-370,9033],[-317,9037],[-306,9015],[-225,9020],[-162,9000],[-87,8990],[-49,8997],[19,8972],[20,8520],[74,8510],[120,8473],[126,8458],[158,8488],[183,8497],[199,8475],[245,8436],[292,8359],[346,8330],[346,8304],[346,8304],[319,8284],[320,8322],[316,8323],[310,8332],[305,8326],[295,8329],[287,8349],[254,8380],[220,8428],[217,8430]]],[[[-373,8372],[-390,8391],[-344,8421],[-318,8446],[-311,8403],[-356,8377],[-413,8325],[-373,8372]]],[[[-433,7100],[-479,7115],[-446,7112],[-433,7100],[-433,7100]]],[[[308,8292],[309,8295],[309,8292],[308,8292],[308,8292],[308,8292]]]]}},{"type":"Feature","id":"JP","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.66,"hc-key":"jp","hc-a2":"JP","name":"Japan","labelrank":"2","country-abbrev":"Japan","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"JPN","iso-a2":"JP","woe-id":"23424856","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[8389,7914],[8390,7917],[8398,7911],[8394,7909],[8389,7914]]],[[[8149,7526],[8129,7515],[8097,7520],[8140,7570],[8197,7578],[8232,7572],[8278,7641],[8269,7618],[8307,7629],[8314,7654],[8342,7662],[8359,7703],[8352,7721],[8369,7771],[8380,7756],[8400,7767],[8419,7706],[8391,7670],[8390,7636],[8375,7598],[8384,7580],[8357,7553],[8353,7573],[8306,7546],[8256,7542],[8267,7531],[8239,7508],[8212,7518],[8222,7544],[8172,7539],[8149,7527],[8166,7521],[8186,7539],[8200,7532],[8186,7497],[8173,7507],[8138,7480],[8130,7504],[8149,7526]]],[[[8044,7495],[8037,7525],[8057,7499],[8076,7517],[8113,7508],[8122,7487],[8101,7435],[8068,7431],[8067,7482],[8044,7495]]],[[[8380,7790],[8365,7775],[8355,7820],[8373,7846],[8401,7845],[8416,7924],[8472,7874],[8509,7860],[8522,7839],[8483,7831],[8455,7794],[8413,7818],[8367,7806],[8380,7790]]]]}},{"type":"Feature","id":"SC","properties":{"hc-group":"admin0","hc-middle-x":0.58,"hc-middle-y":0.41,"hc-key":"sc","hc-a2":"SC","name":"Seychelles","labelrank":"6","country-abbrev":"Syc.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SYC","iso-a2":"SC","woe-id":"23424941","continent":"Seven seas (open ocean)"},"geometry":{"type":"Polygon","coordinates":[[[5849,6344],[5852,6341],[5851,6337],[5843,6348],[5849,6344]]]}},{"type":"Feature","id":"IN","properties":{"hc-group":"admin0","hc-middle-x":0.34,"hc-middle-y":0.43,"hc-key":"in","hc-a2":"IN","name":"India","labelrank":"2","country-abbrev":"India","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"IND","iso-a2":"IN","woe-id":"23424848","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[6818,7133],[6820,7134],[6820,7126],[6817,7128],[6818,7133]]],[[[6819,7322],[6840,7326],[6842,7305],[6869,7285],[6937,7293],[6923,7319],[6953,7324],[7012,7369],[7032,7360],[7057,7370],[7092,7333],[7074,7306],[7024,7278],[7023,7255],[6996,7195],[6973,7200],[6969,7150],[6951,7137],[6939,7192],[6922,7167],[6909,7188],[6949,7229],[6935,7237],[6886,7236],[6870,7262],[6829,7277],[6818,7260],[6843,7237],[6816,7220],[6837,7209],[6832,7189],[6847,7142],[6823,7124],[6820,7141],[6792,7124],[6767,7075],[6740,7073],[6699,7023],[6646,6986],[6647,6972],[6586,6945],[6580,6925],[6588,6875],[6574,6835],[6574,6783],[6504,6717],[6476,6742],[6454,6807],[6424,6859],[6410,6911],[6384,6956],[6360,7072],[6367,7093],[6351,7149],[6344,7113],[6310,7098],[6291,7105],[6258,7137],[6287,7155],[6241,7174],[6227,7195],[6247,7208],[6280,7205],[6313,7222],[6265,7289],[6295,7328],[6337,7325],[6368,7360],[6381,7388],[6416,7427],[6415,7446],[6438,7461],[6400,7495],[6393,7534],[6410,7548],[6453,7539],[6490,7559],[6513,7572],[6527,7544],[6546,7534],[6542,7507],[6563,7480],[6530,7473],[6541,7434],[6608,7397],[6589,7383],[6579,7353],[6660,7310],[6714,7305],[6751,7281],[6795,7274],[6820,7286],[6819,7322]]]]}},{"type":"Feature","id":"FR","properties":{"hc-group":"admin0","hc-middle-x":0.28,"hc-middle-y":0.04,"hc-key":"fr","hc-a2":"FR","name":"France","labelrank":"2","country-abbrev":"Fr.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"FRA","iso-a2":"FR","woe-id":"-90","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2537,7972],[2531,7971],[2530,7983],[2533,7975],[2537,7972]]],[[[4485,7820],[4477,7774],[4465,7781],[4462,7817],[4485,7820]]],[[[9164,5848],[9155,5806],[9109,5833],[9082,5858],[9076,5879],[9141,5830],[9164,5848]]],[[[6256,4904],[6297,4899],[6285,4876],[6245,4876],[6256,4904]]],[[[2331,7017],[2334,7019],[2334,7016],[2331,7017]]],[[[4427,7861],[4426,7860],[4425,7859],[4424,7860],[4423,7858],[4385,7835],[4321,7852],[4294,7830],[4298,7812],[4279,7808],[4263,7812],[4262,7812],[4262,7812],[4255,7814],[4255,7818],[4246,7818],[4203,7821],[4151,7846],[4160,7853],[4173,7943],[4145,7980],[4120,7997],[4065,8019],[4064,8038],[4112,8049],[4124,8036],[4163,8041],[4147,8082],[4197,8065],[4210,8081],[4250,8101],[4251,8127],[4279,8135],[4327,8092],[4376,8075],[4381,8071],[4392,8072],[4447,8053],[4429,8001],[4386,7963],[4389,7952],[4391,7955],[4393,7956],[4405,7957],[4405,7947],[4412,7939],[4400,7909],[4427,7861]]],[[[2596,6636],[2603,6648],[2632,6639],[2670,6598],[2632,6543],[2583,6547],[2601,6581],[2587,6623],[2596,6636]]]]}},{"type":"Feature","id":"FM","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.52,"hc-key":"fm","hc-a2":"FM","name":"Federated States of Micronesia","labelrank":"6","country-abbrev":"F.S.M.","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"FSM","iso-a2":"FM","woe-id":"23424815","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[8899,6684],[8902,6683],[8902,6679],[8899,6679],[8899,6684]]]}},{"type":"Feature","id":"CN","properties":{"hc-group":"admin0","hc-middle-x":0.41,"hc-middle-y":0.56,"hc-key":"cn","hc-a2":"CN","name":"China","labelrank":"2","country-abbrev":"China","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"CHN","iso-a2":"CN","woe-id":"23424781","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7429,7050],[7456,7076],[7488,7081],[7498,7067],[7481,7036],[7459,7021],[7429,7031],[7429,7050]]],[[[6842,7305],[6840,7326],[6819,7322],[6773,7330],[6756,7323],[6729,7336],[6699,7367],[6683,7364],[6640,7401],[6608,7397],[6541,7434],[6530,7473],[6563,7480],[6542,7507],[6546,7534],[6527,7544],[6513,7572],[6500,7571],[6482,7577],[6459,7605],[6416,7624],[6411,7627],[6426,7631],[6423,7675],[6395,7677],[6389,7707],[6399,7728],[6446,7748],[6450,7736],[6482,7759],[6521,7763],[6529,7774],[6584,7803],[6602,7838],[6581,7906],[6646,7924],[6668,7986],[6719,7972],[6741,7981],[6750,8032],[6795,8058],[6801,8059],[6810,8061],[6814,8039],[6847,8016],[6885,8003],[6906,7963],[6901,7912],[6979,7903],[7034,7879],[7064,7822],[7220,7815],[7232,7803],[7282,7788],[7326,7787],[7372,7807],[7453,7813],[7526,7857],[7511,7885],[7528,7908],[7575,7895],[7603,7919],[7637,7921],[7664,7953],[7714,7968],[7756,7963],[7762,7975],[7722,8015],[7698,8015],[7696,8015],[7691,8008],[7642,8005],[7632,8021],[7667,8086],[7699,8074],[7742,8093],[7740,8107],[7768,8158],[7788,8176],[7766,8201],[7790,8222],[7862,8234],[7935,8210],[8005,8075],[8043,8071],[8086,8027],[8093,8004],[8135,8005],[8192,8031],[8204,8005],[8185,7988],[8178,7951],[8146,7907],[8138,7916],[8121,7913],[8090,7899],[8099,7870],[8091,7827],[8078,7815],[8057,7831],[8053,7812],[8004,7796],[8007,7774],[7962,7785],[7943,7758],[7895,7730],[7838,7706],[7799,7682],[7804,7705],[7833,7744],[7800,7758],[7778,7733],[7751,7722],[7736,7698],[7699,7695],[7708,7662],[7731,7662],[7749,7627],[7787,7651],[7812,7637],[7845,7637],[7787,7604],[7742,7557],[7773,7532],[7791,7478],[7819,7454],[7824,7420],[7794,7408],[7836,7385],[7812,7368],[7814,7337],[7794,7326],[7749,7262],[7758,7244],[7731,7235],[7661,7167],[7610,7163],[7593,7144],[7576,7170],[7574,7142],[7489,7118],[7466,7084],[7461,7122],[7422,7134],[7409,7122],[7366,7149],[7372,7161],[7329,7180],[7289,7154],[7245,7162],[7234,7150],[7217,7146],[7222,7111],[7206,7124],[7177,7120],[7170,7139],[7146,7143],[7157,7171],[7138,7175],[7130,7203],[7101,7195],[7103,7234],[7133,7260],[7132,7313],[7098,7343],[7092,7333],[7057,7370],[7032,7360],[7012,7369],[6953,7324],[6923,7319],[6882,7338],[6842,7305]]]]}},{"type":"Feature","id":"PT","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.50,"hc-key":"pt","hc-a2":"PT","name":"Portugal","labelrank":"2","country-abbrev":"Port.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"PRT","iso-a2":"PT","woe-id":"23424925","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[3984,7629],[3937,7624],[3944,7663],[3922,7681],[3946,7754],[3944,7795],[4009,7795],[4020,7781],[3998,7762],[3997,7692],[3984,7629]]]}},{"type":"Feature","id":"SW","properties":{"hc-group":"admin0","hc-middle-x":0.86,"hc-middle-y":0.57,"hc-key":"sw","hc-a2":"SW","name":"Serranilla Bank","labelrank":"5","country-abbrev":"S.B.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"-99","iso-a2":"SW","woe-id":"-99","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1870,6950],[1870,6950],[1870,6950],[1870,6950]]]}},{"type":"Feature","id":"SH","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.51,"hc-key":"sh","hc-a2":"SH","name":"Scarborough Reef","labelrank":"6","country-abbrev":"S.R.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"-99","iso-a2":"SH","woe-id":"-99","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7699,6929],[7698,6929],[7698,6929],[7698,6929],[7699,6929]]]}},{"type":"Feature","id":"BR","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.34,"hc-key":"br","hc-a2":"BR","name":"Brazil","labelrank":"2","country-abbrev":"Brazil","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"BRA","iso-a2":"BR","woe-id":"23424768","continent":"South America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2729,6474],[2767,6471],[2755,6436],[2702,6426],[2696,6461],[2729,6474]]],[[[2615,5450],[2627,5475],[2626,5480],[2554,5539],[2542,5531],[2517,5563],[2494,5561],[2549,5623],[2606,5658],[2604,5706],[2584,5708],[2584,5709],[2583,5712],[2594,5736],[2594,5755],[2559,5759],[2553,5800],[2530,5817],[2483,5817],[2488,5852],[2478,5876],[2496,5937],[2471,5965],[2469,5993],[2419,5995],[2409,6069],[2369,6077],[2332,6104],[2293,6110],[2263,6149],[2262,6192],[2226,6186],[2177,6154],[2139,6155],[2108,6153],[2111,6200],[2091,6185],[2061,6183],[2007,6256],[2034,6290],[2040,6327],[2103,6356],[2128,6354],[2143,6437],[2125,6474],[2131,6529],[2181,6529],[2206,6540],[2219,6515],[2258,6498],[2301,6525],[2324,6550],[2303,6552],[2286,6596],[2377,6604],[2401,6632],[2424,6629],[2437,6595],[2423,6558],[2431,6534],[2459,6514],[2509,6538],[2528,6536],[2543,6553],[2583,6547],[2632,6543],[2670,6598],[2688,6593],[2700,6543],[2723,6528],[2725,6479],[2679,6465],[2701,6426],[2743,6421],[2788,6463],[2869,6439],[2879,6399],[2908,6412],[2969,6393],[3017,6395],[3062,6370],[3101,6334],[3149,6327],[3171,6267],[3156,6207],[3109,6160],[3075,6104],[3048,6086],[3051,6007],[3043,5952],[3028,5936],[3026,5900],[2985,5834],[2988,5821],[2956,5790],[2888,5790],[2811,5749],[2785,5728],[2761,5693],[2767,5650],[2757,5614],[2726,5585],[2711,5552],[2684,5560],[2677,5531],[2654,5510],[2642,5465],[2620,5444],[2615,5447],[2615,5450]]]]}},{"type":"Feature","id":"KI","properties":{"hc-group":"admin0","hc-middle-x":0.28,"hc-middle-y":0.65,"hc-key":"ki","hc-a2":"KI","name":"Kiribati","labelrank":"6","country-abbrev":"Kir.","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"KIR","iso-a2":"KI","woe-id":"23424867","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[-468,6538],[-465,6533],[-460,6529],[-467,6531],[-468,6538]]]}},{"type":"Feature","id":"PH","properties":{"hc-group":"admin0","hc-middle-x":0.40,"hc-middle-y":0.19,"hc-key":"ph","hc-a2":"PH","name":"Philippines","labelrank":"2","country-abbrev":"Phil.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"PHL","iso-a2":"PH","woe-id":"23424934","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7894,6825],[7915,6827],[7892,6850],[7919,6851],[7934,6808],[7915,6812],[7907,6784],[7894,6825]]],[[[7758,6817],[7762,6844],[7775,6837],[7758,6817],[7758,6817]]],[[[7753,6809],[7752,6810],[7758,6817],[7758,6817],[7758,6816],[7753,6809],[7753,6809]]],[[[7823,6787],[7825,6841],[7859,6818],[7853,6800],[7886,6812],[7884,6786],[7855,6746],[7836,6770],[7842,6795],[7823,6787]]],[[[7891,6697],[7867,6709],[7840,6706],[7823,6668],[7827,6707],[7866,6736],[7880,6720],[7907,6747],[7929,6745],[7929,6776],[7953,6740],[7962,6694],[7951,6678],[7937,6696],[7925,6676],[7925,6643],[7891,6661],[7891,6697]]],[[[7896,6884],[7885,6826],[7867,6840],[7859,6878],[7840,6893],[7842,6869],[7816,6893],[7801,6877],[7817,6862],[7802,6841],[7776,6880],[7796,6881],[7767,6918],[7760,6966],[7777,6959],[7775,7002],[7801,7048],[7798,7035],[7834,7023],[7840,6987],[7831,6962],[7812,6952],[7817,6900],[7839,6905],[7896,6884]]],[[[7753,6809],[7757,6790],[7686,6729],[7752,6809],[7753,6809]]]]}},{"type":"Feature","id":"MX","properties":{"hc-group":"admin0","hc-middle-x":0.51,"hc-middle-y":0.49,"hc-key":"mx","hc-a2":"MX","name":"Mexico","labelrank":"2","country-abbrev":"Mex.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"MEX","iso-a2":"MX","woe-id":"23424900","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[1630,7094],[1622,7084],[1622,7088],[1624,7093],[1630,7094]]],[[[1038,7129],[1042,7127],[1052,7116],[1044,7121],[1038,7129]]],[[[881,7216],[885,7216],[889,7212],[889,7210],[881,7216]]],[[[875,7231],[874,7226],[871,7225],[874,7232],[875,7231]]],[[[786,7330],[784,7328],[781,7330],[786,7338],[786,7330]]],[[[696,7356],[694,7355],[692,7363],[695,7361],[696,7356]]],[[[864,7349],[866,7364],[874,7359],[871,7350],[864,7349]]],[[[836,7376],[845,7368],[847,7358],[833,7372],[836,7376]]],[[[1200,7378],[1199,7374],[1206,7373],[1228,7335],[1252,7296],[1259,7288],[1261,7281],[1289,7265],[1321,7262],[1306,7216],[1300,7155],[1321,7096],[1361,7038],[1401,7020],[1478,7034],[1505,7051],[1523,7108],[1589,7126],[1630,7115],[1609,7083],[1597,7023],[1583,7030],[1567,7012],[1558,7009],[1504,7009],[1491,6992],[1522,6966],[1482,6956],[1466,6911],[1417,6957],[1389,6967],[1339,6944],[1273,6971],[1205,6993],[1183,7012],[1133,7025],[1088,7056],[1067,7089],[1083,7121],[1064,7158],[989,7239],[956,7256],[956,7286],[923,7307],[876,7358],[847,7417],[849,7428],[804,7448],[801,7397],[832,7368],[924,7228],[922,7208],[946,7205],[956,7176],[943,7165],[930,7186],[876,7228],[873,7264],[834,7285],[790,7321],[816,7325],[820,7341],[771,7383],[760,7417],[728,7473],[799,7479],[797,7472],[908,7434],[993,7434],[993,7449],[1043,7449],[1091,7409],[1102,7380],[1143,7358],[1167,7387],[1200,7378]],[[1309,7246],[1303,7231],[1306,7218],[1313,7245],[1309,7246]]]]}},{"type":"Feature","id":"ES","properties":{"hc-group":"admin0","hc-middle-x":0.76,"hc-middle-y":0.27,"hc-key":"es","hc-a2":"ES","name":"Spain","labelrank":"2","country-abbrev":"Sp.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"ESP","iso-a2":"ES","woe-id":"23424950","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[3748,7322],[3716,7331],[3697,7330],[3726,7345],[3748,7322]]],[[[4117,7566],[4118,7565],[4117,7564],[4116,7566],[4117,7566]]],[[[4044,7586],[4046,7586],[4045,7584],[4044,7585],[4044,7586]]],[[[4045,7594],[4021,7599],[4011,7621],[3984,7629],[3997,7692],[3998,7762],[4020,7781],[4009,7795],[3944,7795],[3930,7838],[3969,7860],[3988,7852],[4098,7851],[4151,7846],[4203,7821],[4246,7818],[4249,7812],[4255,7814],[4262,7812],[4262,7813],[4262,7814],[4263,7812],[4263,7812],[4279,7808],[4298,7812],[4300,7795],[4265,7771],[4233,7763],[4194,7709],[4211,7683],[4189,7669],[4183,7644],[4154,7635],[4143,7615],[4072,7613],[4046,7594],[4045,7594]]]]}},{"type":"Feature","id":"BU","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.73,"hc-key":"bu","hc-a2":"BU","name":"Bajo Nuevo Bank (Petrel Is.)","labelrank":"8","country-abbrev":null,"subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"-99","iso-a2":"BU","woe-id":"-99","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1830,6948],[1830,6948],[1830,6948],[1830,6948],[1830,6948]]]}},{"type":"Feature","id":"MV","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.53,"hc-key":"mv","hc-a2":"MV","name":"Maldives","labelrank":"5","country-abbrev":"Mald.","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"MDV","iso-a2":"MV","woe-id":"23424899","continent":"Seven seas (open ocean)"},"geometry":{"type":"Polygon","coordinates":[[[6382,6647],[6390,6636],[6380,6637],[6384,6642],[6382,6647]]]}},{"type":"Feature","id":"SP","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"sp","hc-a2":"SP","name":"Spratly Islands","labelrank":"6","country-abbrev":"Spratly Is.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"SPI","iso-a2":"SP","woe-id":"23424921","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7642,6799],[7641,6799],[7641,6799],[7642,6799],[7642,6799]]]}},{"type":"Feature","id":"GB","properties":{"hc-group":"admin0","hc-middle-x":0.69,"hc-middle-y":0.09,"hc-key":"gb","hc-a2":"GB","name":"United Kingdom","labelrank":"2","country-abbrev":"U.K.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"GBR","iso-a2":"GB","woe-id":"-90","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4108,8458],[4110,8454],[4106,8453],[4102,8457],[4108,8458]]],[[[4112,8469],[4111,8462],[4116,8461],[4104,8463],[4112,8469]]],[[[4118,8472],[4113,8477],[4125,8471],[4121,8468],[4118,8472]]],[[[4173,8521],[4166,8500],[4165,8515],[4155,8520],[4173,8521]]],[[[4176,8534],[4182,8533],[4169,8530],[4171,8539],[4176,8534]]],[[[4181,8542],[4179,8536],[4175,8537],[4176,8542],[4181,8542]]],[[[1789,7055],[1792,7057],[1798,7055],[1792,7054],[1789,7055]]],[[[2080,7131],[2072,7131],[2072,7133],[2077,7133],[2080,7131]]],[[[2065,7134],[2063,7131],[2058,7131],[2062,7132],[2065,7134]]],[[[3994,8404],[3993,8427],[4018,8441],[4015,8421],[3994,8404]]],[[[2433,4774],[2454,4816],[2486,4811],[2491,4798],[2433,4774]]],[[[5210,7554],[5209,7553],[5207,7555],[5206,7555],[5206,7555],[5206,7554],[5204,7554],[5204,7555],[5205,7555],[5203,7556],[5206,7556],[5210,7558],[5210,7557],[5207,7557],[5210,7554]],[[5205,7555],[5206,7556],[5205,7556],[5205,7555]]],[[[4046,7594],[4045,7593],[4045,7594],[4046,7594]]],[[[5184,7543],[5181,7544],[5176,7544],[5178,7545],[5184,7543]]],[[[3989,8295],[4018,8305],[4040,8278],[4018,8256],[3987,8256],[3961,8270],[3989,8295]]],[[[4024,8390],[4056,8446],[4114,8447],[4083,8416],[4100,8407],[4147,8405],[4152,8396],[4110,8337],[4156,8317],[4168,8277],[4202,8256],[4214,8215],[4204,8207],[4254,8201],[4251,8174],[4225,8151],[4244,8137],[4212,8122],[4102,8117],[4043,8100],[4081,8140],[4113,8140],[4074,8163],[4046,8166],[4079,8182],[4080,8220],[4109,8227],[4119,8259],[4096,8272],[4103,8288],[4073,8289],[4075,8268],[4052,8286],[4067,8313],[4036,8351],[4008,8361],[4032,8367],[4003,8396],[4024,8390]]]]}},{"type":"Feature","id":"GR","properties":{"hc-group":"admin0","hc-middle-x":0.30,"hc-middle-y":0.43,"hc-key":"gr","hc-a2":"GR","name":"Greece","labelrank":"3","country-abbrev":"Greece","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"GRC","iso-a2":"GR","woe-id":"23424833","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4984,7560],[4938,7553],[4902,7565],[4922,7573],[4984,7560]]],[[[5023,7596],[5041,7604],[5037,7593],[5028,7585],[5023,7596]]],[[[5011,7610],[5003,7612],[5010,7619],[5009,7615],[5011,7610]]],[[[5002,7626],[5006,7623],[5003,7621],[5004,7624],[5002,7626]]],[[[4952,7622],[4962,7630],[4963,7623],[4957,7611],[4952,7622]]],[[[4985,7644],[4977,7640],[4975,7641],[4978,7645],[4985,7644]]],[[[5004,7649],[5007,7647],[4999,7645],[4993,7649],[5004,7649]]],[[[4978,7677],[4980,7667],[4975,7669],[4971,7677],[4978,7677]]],[[[4959,7727],[4953,7726],[4959,7743],[4966,7743],[4959,7727]]],[[[4828,7750],[4831,7753],[4828,7750],[4826,7753],[4826,7754],[4828,7756],[4831,7756],[4854,7765],[4884,7773],[4931,7781],[4953,7770],[4985,7786],[4994,7775],[4977,7752],[4947,7761],[4907,7750],[4928,7732],[4876,7743],[4874,7728],[4958,7637],[4915,7667],[4918,7646],[4893,7656],[4878,7642],[4892,7604],[4853,7613],[4838,7665],[4798,7715],[4809,7720],[4828,7750]]],[[[4989,7700],[4994,7693],[4988,7690],[4971,7698],[4986,7702],[4988,7702],[4989,7700]]]]}},{"type":"Feature","id":"AS","properties":{"hc-group":"admin0","hc-middle-x":0.56,"hc-middle-y":0.57,"hc-key":"as","hc-a2":"AS","name":"American Samoa","labelrank":"4","country-abbrev":"Am. Samoa","subregion":"Polynesia","region-wb":"East Asia & Pacific","iso-a3":"ASM","iso-a2":"AS","woe-id":"23424746","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[-859,6056],[-861,6055],[-863,6052],[-866,6054],[-859,6056]]]}},{"type":"Feature","id":"DK","properties":{"hc-group":"admin0","hc-middle-x":0.35,"hc-middle-y":0.49,"hc-key":"dk","hc-a2":"DK","name":"Denmark","labelrank":"4","country-abbrev":"Den.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"DNK","iso-a2":"DK","woe-id":"23424796","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4538,8291],[4553,8278],[4544,8277],[4531,8283],[4538,8291]]],[[[4511,8288],[4516,8286],[4512,8286],[4506,8292],[4511,8288]]],[[[4576,8293],[4566,8288],[4565,8292],[4570,8294],[4576,8293]]],[[[4495,8296],[4502,8291],[4500,8287],[4494,8289],[4495,8296]]],[[[4526,8290],[4523,8282],[4520,8286],[4529,8299],[4526,8290]]],[[[4578,8322],[4559,8280],[4533,8320],[4567,8339],[4578,8322]]],[[[4484,8285],[4466,8289],[4461,8288],[4445,8357],[4495,8381],[4519,8408],[4509,8372],[4529,8353],[4516,8338],[4525,8302],[4488,8310],[4484,8285]]]]}},{"type":"Feature","id":"GL","properties":{"hc-group":"admin0","hc-middle-x":0.55,"hc-middle-y":0.43,"hc-key":"gl","hc-a2":"GL","name":"Greenland","labelrank":"3","country-abbrev":"Grlnd.","subregion":"Northern America","region-wb":"Europe & Central Asia","iso-a3":"GRL","iso-a2":"GL","woe-id":"23424828","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2633,8910],[2635,8908],[2628,8905],[2624,8909],[2633,8910]]],[[[2656,8923],[2628,8916],[2630,8920],[2642,8923],[2656,8923]]],[[[2582,9011],[2574,9011],[2571,9017],[2578,9015],[2582,9011]]],[[[2616,9047],[2602,9051],[2613,9062],[2620,9051],[2616,9047]]],[[[2570,9117],[2557,9108],[2553,9113],[2571,9121],[2570,9117]]],[[[2552,9143],[2545,9137],[2535,9139],[2543,9143],[2552,9143]]],[[[2572,9145],[2556,9131],[2554,9142],[2564,9145],[2572,9145]]],[[[2544,9188],[2558,9180],[2554,9179],[2539,9188],[2544,9188]]],[[[2534,9206],[2543,9205],[2524,9203],[2524,9209],[2534,9206]]],[[[2528,9242],[2510,9242],[2496,9242],[2521,9246],[2528,9242]]],[[[2139,9366],[2126,9367],[2127,9369],[2140,9370],[2139,9366]]],[[[2061,9422],[2086,9417],[2076,9414],[2052,9419],[2061,9422]]],[[[2100,9424],[2119,9418],[2095,9418],[2088,9423],[2100,9424]]],[[[3690,9588],[3655,9569],[3628,9580],[3678,9596],[3690,9588]]],[[[2218,9636],[2228,9632],[2222,9631],[2218,9632],[2218,9636]]],[[[2683,9729],[2658,9730],[2626,9738],[2637,9753],[2683,9729]]],[[[2610,8952],[2619,8961],[2572,8975],[2577,9002],[2623,9002],[2661,8980],[2657,8963],[2610,8952]]],[[[2631,8765],[2626,8765],[2626,8768],[2627,8768],[2624,8771],[2612,8811],[2652,8832],[2603,8840],[2627,8897],[2686,8916],[2696,8975],[2677,8989],[2606,9011],[2584,9029],[2647,9028],[2701,9008],[2677,9040],[2647,9058],[2641,9054],[2628,9056],[2632,9066],[2636,9065],[2631,9068],[2667,9078],[2637,9080],[2624,9074],[2617,9080],[2629,9081],[2633,9081],[2599,9084],[2603,9068],[2563,9065],[2545,9082],[2553,9091],[2548,9094],[2555,9096],[2557,9095],[2575,9114],[2584,9146],[2568,9153],[2570,9153],[2556,9159],[2555,9158],[2552,9159],[2564,9178],[2541,9192],[2552,9207],[2530,9217],[2538,9235],[2510,9267],[2478,9276],[2463,9295],[2469,9316],[2398,9342],[2320,9355],[2304,9341],[2239,9349],[2231,9329],[2173,9337],[2137,9356],[2186,9374],[2115,9382],[2087,9394],[2100,9406],[2175,9418],[2222,9417],[2237,9433],[2150,9423],[2141,9438],[2088,9443],[2041,9468],[2050,9491],[2146,9510],[2185,9528],[2246,9530],[2279,9557],[2274,9591],[2214,9594],[2202,9613],[2271,9643],[2281,9658],[2335,9675],[2378,9663],[2400,9695],[2380,9712],[2465,9738],[2588,9757],[2615,9738],[2608,9698],[2633,9733],[2679,9723],[2736,9726],[2703,9741],[2687,9767],[2750,9763],[2839,9733],[2864,9715],[2891,9719],[2870,9733],[2876,9737],[2813,9756],[2770,9788],[2788,9777],[2829,9779],[2885,9759],[2877,9738],[2906,9760],[2846,9787],[2988,9787],[2850,9794],[2814,9801],[2838,9810],[2865,9802],[2879,9816],[2954,9821],[3022,9818],[3052,9816],[3056,9835],[3114,9844],[3240,9851],[3294,9849],[3443,9826],[3430,9819],[3292,9814],[3167,9796],[3259,9803],[3311,9813],[3391,9808],[3456,9816],[3478,9796],[3532,9789],[3571,9776],[3538,9755],[3318,9740],[3231,9719],[3264,9718],[3380,9734],[3473,9729],[3471,9714],[3423,9702],[3421,9689],[3499,9712],[3516,9732],[3569,9736],[3573,9695],[3518,9653],[3552,9660],[3651,9717],[3698,9699],[3735,9718],[3791,9716],[3847,9704],[3866,9691],[3808,9660],[3772,9658],[3780,9644],[3746,9634],[3698,9635],[3735,9618],[3716,9605],[3647,9598],[3600,9582],[3634,9570],[3623,9548],[3641,9533],[3613,9524],[3628,9503],[3597,9514],[3572,9475],[3569,9450],[3634,9453],[3630,9441],[3674,9435],[3630,9427],[3586,9435],[3597,9418],[3660,9407],[3648,9365],[3653,9329],[3637,9361],[3647,9379],[3595,9391],[3559,9373],[3560,9348],[3612,9348],[3630,9296],[3689,9274],[3657,9271],[3629,9229],[3573,9218],[3594,9181],[3565,9184],[3542,9170],[3492,9190],[3428,9169],[3444,9165],[3441,9166],[3478,9180],[3514,9160],[3554,9151],[3554,9138],[3524,9143],[3553,9127],[3532,9126],[3545,9106],[3481,9133],[3477,9146],[3501,9146],[3476,9150],[3457,9159],[3441,9150],[3476,9123],[3536,9094],[3520,9084],[3557,9059],[3567,9020],[3511,9014],[3484,9049],[3437,9076],[3445,9055],[3375,9038],[3366,9011],[3394,9014],[3371,9014],[3383,9030],[3452,9049],[3453,9026],[3427,9015],[3407,9015],[3376,8996],[3394,8990],[3453,9013],[3505,8997],[3540,8997],[3514,8972],[3489,8966],[3424,8922],[3372,8915],[3332,8897],[3254,8889],[3215,8864],[3216,8851],[3176,8805],[3124,8778],[3080,8766],[3076,8798],[3061,8771],[3013,8760],[3032,8753],[3009,8738],[2992,8708],[3002,8677],[2953,8623],[2939,8546],[2915,8528],[2921,8504],[2888,8501],[2857,8515],[2855,8534],[2781,8544],[2749,8569],[2741,8603],[2711,8619],[2716,8640],[2679,8665],[2683,8709],[2658,8696],[2660,8737],[2631,8765]]]]}},{"type":"Feature","id":"GU","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.44,"hc-key":"gu","hc-a2":"GU","name":"Guam","labelrank":"6","country-abbrev":"Guam","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"GUM","iso-a2":"GU","woe-id":"23424832","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[8501,6877],[8498,6871],[8496,6877],[8503,6884],[8501,6877]]]}},{"type":"Feature","id":"MP","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.49,"hc-key":"mp","hc-a2":"MP","name":"Northern Mariana Islands","labelrank":"6","country-abbrev":"N.M.I.","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"MNP","iso-a2":"MP","woe-id":"23424788","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[8526,6925],[8528,6930],[8531,6932],[8529,6927],[8526,6925]]]}},{"type":"Feature","id":"PR","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.65,"hc-key":"pr","hc-a2":"PR","name":"Puerto Rico","labelrank":"5","country-abbrev":"P.R.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"PRI","iso-a2":"PR","woe-id":"23424935","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2267,7024],[2239,7013],[2212,7014],[2213,7031],[2267,7024]]]}},{"type":"Feature","id":"VI","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.19,"hc-key":"vi","hc-a2":"VI","name":"United States Virgin Islands","labelrank":"6","country-abbrev":"V.I. (U.S.)","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"VIR","iso-a2":"VI","woe-id":"23424985","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2283,7008],[2288,7008],[2278,7005],[2279,7008],[2283,7008]]]}},{"type":"Feature","id":"CA","properties":{"hc-group":"admin0","hc-middle-x":0.29,"hc-middle-y":0.64,"hc-key":"ca","hc-a2":"CA","name":"Canada","labelrank":"2","country-abbrev":"Can.","subregion":"Northern America","region-wb":"North America","iso-a3":"CAN","iso-a2":"CA","woe-id":"23424775","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[1713,9425],[1665,9428],[1680,9462],[1643,9470],[1608,9466],[1608,9487],[1634,9510],[1674,9517],[1735,9510],[1777,9514],[1703,9520],[1681,9564],[1638,9573],[1639,9612],[1717,9607],[1765,9581],[1781,9562],[1787,9587],[1735,9612],[1889,9631],[1831,9632],[1931,9652],[1841,9647],[1743,9627],[1715,9642],[1699,9625],[1630,9631],[1649,9658],[1614,9633],[1551,9650],[1631,9659],[1637,9668],[1538,9660],[1523,9671],[1581,9700],[1519,9685],[1545,9704],[1475,9704],[1503,9719],[1590,9738],[1689,9729],[1630,9740],[1671,9751],[1659,9764],[1742,9752],[1829,9728],[1749,9758],[1768,9779],[1812,9771],[1783,9788],[1833,9786],[1825,9799],[1915,9793],[1945,9807],[2002,9803],[2013,9793],[2038,9809],[2136,9812],[2138,9803],[2235,9795],[2168,9776],[2203,9778],[2284,9797],[2337,9767],[2377,9766],[2384,9744],[2294,9710],[2264,9713],[2226,9694],[2125,9670],[2289,9698],[2178,9642],[2107,9600],[2083,9572],[2026,9575],[2032,9559],[1951,9546],[1907,9553],[1909,9541],[1994,9538],[1993,9525],[1945,9531],[1892,9527],[1955,9522],[1989,9509],[1984,9496],[1934,9493],[1975,9482],[1961,9465],[1901,9446],[1881,9418],[1807,9415],[1859,9401],[1848,9390],[1892,9392],[1896,9373],[1852,9352],[1863,9324],[1837,9325],[1849,9351],[1798,9340],[1807,9358],[1714,9361],[1699,9351],[1610,9360],[1531,9362],[1516,9376],[1584,9403],[1602,9416],[1587,9445],[1616,9451],[1653,9439],[1658,9421],[1713,9425]],[[1713,9425],[1714,9425],[1714,9425],[1714,9425],[1714,9425],[1714,9425],[1729,9427],[1747,9459],[1714,9425],[1714,9425],[1714,9425],[1714,9425],[1713,9425]]],[[[1858,7836],[1858,7833],[1862,7830],[1790,7820],[1752,7798],[1739,7807],[1758,7809],[1751,7816],[1755,7820],[1758,7833],[1778,7845],[1791,7914],[1827,7886],[1838,7897],[1808,7939],[1708,7954],[1708,7961],[1697,7959],[1686,8013],[1656,8016],[1639,8046],[1591,8054],[1546,8016],[1491,8018],[1455,8037],[1379,8054],[561,8054],[555,8058],[553,8054],[551,8054],[545,8069],[502,8091],[506,8102],[499,8104],[501,8103],[504,8100],[499,8097],[497,8104],[488,8106],[489,8108],[486,8110],[485,8107],[476,8108],[474,8109],[464,8111],[472,8108],[471,8108],[468,8109],[472,8107],[474,8108],[480,8106],[485,8099],[485,8098],[490,8093],[490,8093],[508,8069],[539,8044],[537,8052],[544,8047],[553,8046],[540,8044],[545,8040],[537,8028],[504,8038],[448,8070],[445,8079],[446,8079],[443,8087],[443,8087],[442,8091],[411,8096],[393,8123],[409,8127],[448,8116],[450,8117],[447,8118],[456,8118],[459,8122],[456,8125],[447,8118],[412,8138],[406,8174],[401,8161],[398,8166],[401,8173],[406,8174],[406,8175],[407,8175],[409,8178],[406,8178],[405,8179],[408,8179],[407,8183],[405,8181],[402,8201],[387,8216],[379,8197],[370,8211],[371,8215],[366,8216],[366,8220],[371,8223],[371,8217],[373,8223],[384,8218],[380,8222],[387,8253],[374,8237],[381,8240],[379,8235],[373,8232],[372,8234],[366,8227],[332,8264],[346,8293],[346,8304],[346,8330],[292,8359],[245,8436],[199,8475],[183,8497],[158,8488],[126,8458],[120,8473],[74,8510],[20,8520],[19,8972],[75,8965],[132,8936],[172,8933],[173,8954],[234,8964],[250,8959],[335,9000],[361,8992],[287,8966],[261,8941],[310,8969],[318,8952],[336,8974],[431,9004],[446,8976],[481,8955],[509,8996],[512,8957],[549,8964],[555,8982],[600,8978],[635,8959],[701,8939],[762,8928],[763,8938],[815,8916],[820,8899],[792,8901],[776,8883],[825,8871],[894,8872],[929,8885],[965,8875],[975,8854],[999,8850],[1012,8813],[1023,8842],[999,8872],[1069,8919],[1010,8895],[975,8901],[991,8919],[1064,8932],[1078,8905],[1103,8888],[1137,8887],[1191,8870],[1215,8879],[1285,8876],[1309,8866],[1275,8905],[1318,8911],[1331,8888],[1358,8902],[1341,8860],[1375,8831],[1371,8890],[1389,8888],[1427,8930],[1396,8925],[1405,8962],[1349,8984],[1339,9009],[1342,9061],[1378,9097],[1396,9099],[1380,9098],[1381,9125],[1363,9145],[1363,9192],[1377,9214],[1424,9223],[1466,9213],[1527,9207],[1478,9147],[1462,9139],[1410,9143],[1430,9125],[1411,9101],[1398,9100],[1438,9070],[1443,9037],[1487,8999],[1448,8975],[1480,8964],[1520,8932],[1525,8899],[1543,8940],[1565,8950],[1594,8924],[1580,8901],[1607,8842],[1655,8889],[1662,8924],[1690,8940],[1667,8953],[1666,8979],[1701,8983],[1715,8980],[1715,8982],[1725,8979],[1723,8978],[1752,8972],[1790,8948],[1776,8934],[1792,8919],[1751,8910],[1793,8859],[1785,8836],[1730,8804],[1700,8835],[1720,8796],[1674,8800],[1668,8815],[1628,8808],[1656,8794],[1611,8754],[1595,8754],[1542,8784],[1562,8753],[1621,8749],[1593,8699],[1561,8687],[1534,8698],[1528,8674],[1504,8670],[1505,8669],[1514,8666],[1512,8664],[1511,8666],[1505,8669],[1514,8645],[1453,8618],[1404,8545],[1390,8504],[1401,8450],[1439,8451],[1460,8395],[1454,8374],[1503,8387],[1566,8370],[1605,8336],[1693,8303],[1761,8295],[1767,8244],[1762,8210],[1837,8137],[1874,8185],[1860,8212],[1855,8257],[1837,8278],[1896,8304],[1928,8336],[1934,8367],[1917,8417],[1872,8446],[1910,8497],[1884,8545],[1903,8573],[1885,8610],[1905,8624],[1985,8603],[2018,8619],[2077,8581],[2073,8567],[2145,8542],[2132,8530],[2143,8458],[2163,8459],[2196,8424],[2251,8456],[2259,8494],[2279,8522],[2293,8517],[2299,8495],[2302,8500],[2305,8496],[2301,8493],[2299,8495],[2303,8480],[2323,8475],[2336,8445],[2383,8381],[2366,8360],[2429,8297],[2504,8272],[2482,8261],[2509,8241],[2548,8229],[2554,8180],[2513,8148],[2465,8139],[2429,8106],[2372,8097],[2354,8104],[2232,8103],[2205,8067],[2155,8046],[2129,8008],[2086,7969],[2038,7949],[1987,7905],[1970,7900],[1955,7886],[1860,7863],[1837,7844],[1858,7842],[1858,7838],[1858,7836]],[[456,8113],[455,8114],[454,8114],[456,8113]],[[544,8070],[543,8075],[540,8074],[540,8071],[544,8070]],[[424,8181],[428,8188],[413,8181],[409,8169],[424,8181]],[[1315,8873],[1309,8871],[1310,8867],[1315,8870],[1315,8873]],[[466,8061],[471,8060],[471,8063],[469,8063],[466,8061]],[[463,8065],[462,8069],[458,8069],[458,8065],[463,8065]]],[[[2286,8678],[2286,8639],[2268,8632],[2229,8643],[2201,8663],[2198,8647],[2247,8606],[2237,8590],[2170,8608],[2139,8627],[2076,8651],[2080,8670],[2048,8683],[2024,8719],[1988,8708],[1954,8719],[1928,8699],[1894,8707],[1885,8735],[1906,8760],[1956,8748],[2002,8763],[2024,8760],[1994,8794],[2039,8823],[2062,8850],[2038,8899],[2013,8904],[1964,8939],[1930,8922],[1930,8939],[1961,8950],[1899,8982],[1899,9001],[1861,9008],[1866,8984],[1778,8998],[1766,8979],[1644,8997],[1572,9016],[1546,9050],[1612,9042],[1590,9056],[1539,9063],[1530,9095],[1546,9144],[1564,9172],[1599,9197],[1631,9204],[1678,9202],[1631,9145],[1640,9100],[1686,9060],[1667,9114],[1696,9106],[1661,9135],[1676,9169],[1746,9198],[1785,9197],[1822,9141],[1805,9098],[1835,9128],[1862,9100],[1876,9132],[1901,9142],[1972,9127],[1970,9106],[2001,9104],[2000,9085],[2036,9059],[2053,9080],[2094,9059],[2066,9049],[2064,9043],[2072,9048],[2082,9041],[2103,9051],[2091,9022],[2129,9038],[2175,9022],[2212,8976],[2191,8974],[2194,8971],[2188,8967],[2194,8966],[2201,8970],[2207,8967],[2198,8965],[2209,8962],[2222,8945],[2194,8940],[2183,8927],[2180,8928],[2174,8928],[2182,8926],[2175,8917],[2219,8908],[2228,8897],[2231,8899],[2238,8899],[2237,8895],[2228,8896],[2237,8885],[2276,8889],[2307,8851],[2310,8851],[2317,8853],[2324,8851],[2323,8851],[2334,8850],[2324,8830],[2364,8838],[2380,8805],[2348,8798],[2346,8770],[2315,8760],[2319,8733],[2288,8742],[2220,8813],[2190,8809],[2212,8787],[2187,8765],[2258,8726],[2254,8713],[2286,8689],[2286,8685],[2286,8685],[2287,8680],[2292,8674],[2286,8678]],[[2063,9038],[2061,9032],[2070,9036],[2065,9034],[2063,9038]],[[2187,8974],[2164,8972],[2177,8969],[2187,8974]]],[[[2096,7974],[2093,7974],[2100,7980],[2101,7977],[2096,7974]]],[[[533,8059],[538,8053],[544,8051],[538,8052],[533,8059]]],[[[2301,8091],[2368,8068],[2357,8057],[2317,8069],[2301,8091]]],[[[495,8094],[493,8097],[495,8100],[498,8096],[495,8094]]],[[[409,8150],[403,8151],[401,8156],[405,8160],[409,8150]]],[[[1857,8175],[1850,8170],[1841,8168],[1841,8172],[1857,8175]]],[[[316,8175],[314,8174],[313,8171],[313,8177],[316,8175]]],[[[399,8172],[397,8175],[398,8179],[401,8179],[399,8172]]],[[[397,8181],[396,8177],[390,8177],[392,8181],[397,8181]]],[[[385,8190],[387,8184],[385,8182],[383,8189],[385,8190]]],[[[390,8195],[391,8191],[390,8189],[384,8195],[390,8195]]],[[[297,8200],[302,8200],[303,8197],[299,8195],[297,8200]]],[[[394,8186],[392,8196],[394,8203],[397,8191],[394,8186]]],[[[366,8203],[377,8196],[378,8191],[372,8194],[366,8203]]],[[[398,8196],[397,8198],[396,8202],[400,8203],[398,8196]]],[[[359,8213],[360,8209],[357,8209],[354,8216],[359,8213]]],[[[363,8217],[367,8211],[364,8211],[361,8219],[363,8217]]],[[[1788,8220],[1797,8219],[1809,8199],[1769,8212],[1788,8220]]],[[[1834,8218],[1836,8216],[1832,8215],[1833,8218],[1834,8218]]],[[[378,8225],[372,8224],[371,8226],[376,8233],[378,8225]]],[[[329,8230],[331,8237],[350,8227],[348,8218],[329,8230]]],[[[343,8235],[336,8236],[334,8239],[340,8242],[343,8235]]],[[[353,8238],[366,8226],[359,8220],[337,8245],[353,8238]]],[[[327,8256],[336,8254],[339,8250],[328,8243],[327,8256]]],[[[314,8276],[324,8276],[326,8266],[318,8270],[314,8276]]],[[[1852,8288],[1842,8285],[1840,8286],[1859,8290],[1852,8288]]],[[[333,8283],[332,8285],[341,8294],[338,8286],[333,8283]]],[[[1861,8337],[1867,8352],[1869,8353],[1869,8342],[1861,8337]]],[[[1843,8360],[1842,8352],[1831,8342],[1841,8352],[1843,8360]]],[[[1834,8370],[1832,8369],[1834,8374],[1838,8369],[1834,8370]]],[[[2200,8432],[2196,8433],[2197,8436],[2199,8437],[2200,8432]]],[[[2155,8463],[2146,8461],[2146,8468],[2153,8468],[2155,8463]]],[[[1818,8492],[1823,8494],[1825,8492],[1822,8490],[1818,8492]]],[[[1830,8501],[1833,8500],[1829,8496],[1825,8495],[1830,8501]]],[[[2284,8532],[2292,8519],[2283,8523],[2280,8528],[2284,8532]]],[[[2184,8533],[2191,8527],[2187,8519],[2174,8520],[2184,8533]]],[[[1883,8544],[1879,8541],[1869,8538],[1871,8541],[1883,8544]]],[[[2281,8579],[2279,8566],[2261,8578],[2274,8583],[2281,8579]]],[[[2252,8589],[2255,8585],[2247,8587],[2252,8591],[2252,8589]]],[[[1449,8594],[1442,8589],[1438,8593],[1443,8593],[1449,8594]]],[[[2273,8593],[2280,8586],[2271,8587],[2267,8591],[2273,8593]]],[[[1847,8614],[1850,8596],[1837,8578],[1824,8603],[1847,8614]]],[[[1463,8614],[1464,8616],[1470,8615],[1467,8613],[1463,8614]]],[[[2284,8621],[2293,8621],[2287,8613],[2277,8616],[2284,8621]]],[[[1894,8622],[1887,8624],[1901,8624],[1897,8621],[1894,8622]]],[[[2278,8622],[2272,8621],[2274,8624],[2278,8624],[2278,8622]]],[[[1995,8630],[2007,8628],[2009,8625],[1997,8626],[1995,8630]]],[[[2103,8635],[2121,8624],[2105,8622],[2090,8637],[2103,8635]]],[[[1767,8641],[1772,8629],[1737,8605],[1714,8619],[1732,8640],[1767,8641]]],[[[2222,8640],[2222,8639],[2213,8647],[2218,8646],[2222,8640]]],[[[1877,8666],[1899,8663],[1902,8651],[1891,8647],[1877,8666]]],[[[2300,8671],[2296,8665],[2297,8658],[2290,8672],[2300,8671]]],[[[1914,8674],[1932,8665],[1919,8662],[1906,8671],[1914,8674]]],[[[2297,8678],[2295,8679],[2295,8682],[2300,8681],[2297,8678]]],[[[1903,8691],[1897,8687],[1890,8688],[1891,8690],[1903,8691]]],[[[2277,8700],[2275,8699],[2274,8705],[2278,8702],[2277,8700]]],[[[2022,8713],[2021,8705],[2018,8705],[2017,8715],[2022,8713]]],[[[2266,8724],[2269,8720],[2255,8714],[2261,8722],[2266,8724]]],[[[2351,8774],[2357,8774],[2360,8769],[2350,8770],[2351,8774]]],[[[1732,8779],[1726,8777],[1725,8780],[1730,8780],[1732,8779]]],[[[1679,8789],[1689,8780],[1691,8765],[1678,8775],[1679,8789]]],[[[1701,8792],[1719,8784],[1729,8768],[1707,8775],[1701,8792]]],[[[1737,8802],[1744,8800],[1741,8796],[1732,8800],[1737,8802]]],[[[2352,8845],[2353,8844],[2340,8837],[2345,8845],[2352,8845]]],[[[1017,8840],[1013,8840],[1010,8844],[1011,8846],[1017,8840]]],[[[1002,8856],[1000,8852],[995,8857],[1002,8860],[1002,8856]]],[[[987,8864],[990,8864],[988,8859],[984,8863],[987,8864]]],[[[2311,8862],[2304,8863],[2306,8869],[2311,8864],[2311,8862]]],[[[1001,8864],[995,8864],[996,8870],[999,8869],[1001,8864]]],[[[843,8882],[837,8883],[852,8884],[852,8882],[843,8882]]],[[[997,8881],[992,8881],[993,8884],[996,8885],[997,8881]]],[[[964,8886],[973,8884],[971,8880],[965,8883],[964,8886]]],[[[959,8889],[960,8886],[955,8889],[955,8892],[959,8889]]],[[[944,8895],[952,8898],[942,8891],[932,8889],[944,8895]]],[[[2000,8891],[2025,8885],[2025,8875],[1996,8875],[2000,8891]]],[[[1641,8883],[1634,8873],[1624,8883],[1631,8902],[1641,8883]]],[[[890,8898],[887,8898],[889,8902],[894,8903],[890,8898]]],[[[1961,8903],[1974,8899],[1976,8864],[1952,8849],[1919,8848],[1909,8872],[1928,8900],[1961,8903]]],[[[1859,8896],[1854,8898],[1855,8904],[1865,8901],[1859,8896]]],[[[1767,8905],[1771,8904],[1768,8902],[1763,8905],[1767,8905]]],[[[2003,8899],[1996,8909],[2001,8909],[2005,8904],[2003,8899]]],[[[917,8916],[917,8914],[919,8912],[907,8911],[917,8916]]],[[[1102,8907],[1086,8915],[1097,8916],[1104,8913],[1102,8907]]],[[[1872,8919],[1870,8911],[1860,8911],[1869,8917],[1872,8919]]],[[[1993,8916],[1985,8915],[1981,8919],[1984,8921],[1993,8916]]],[[[1981,8915],[1984,8904],[1966,8913],[1971,8924],[1981,8915]]],[[[1184,8927],[1182,8916],[1167,8922],[1176,8929],[1184,8927]]],[[[1232,8934],[1224,8924],[1218,8926],[1218,8938],[1232,8934]]],[[[1236,8935],[1230,8938],[1232,8946],[1235,8943],[1236,8935]]],[[[166,8945],[168,8943],[161,8944],[162,8948],[166,8945]]],[[[1187,8943],[1188,8950],[1191,8949],[1190,8944],[1187,8943]]],[[[1516,8957],[1520,8950],[1516,8949],[1513,8957],[1516,8957]]],[[[1876,8959],[1876,8950],[1864,8933],[1847,8934],[1876,8959]]],[[[181,8968],[186,8972],[180,8962],[173,8964],[181,8968]]],[[[1779,8961],[1785,8959],[1786,8956],[1774,8960],[1779,8961]]],[[[1528,8959],[1523,8951],[1518,8955],[1523,8961],[1528,8959]]],[[[1918,8960],[1929,8958],[1914,8944],[1907,8952],[1918,8960]]],[[[1199,8967],[1208,8963],[1201,8958],[1198,8962],[1199,8967]]],[[[1336,8968],[1351,8968],[1351,8957],[1339,8963],[1336,8968]]],[[[1365,8970],[1373,8966],[1364,8955],[1363,8967],[1365,8970]]],[[[83,8969],[76,8966],[71,8969],[76,8972],[83,8969]]],[[[1890,8974],[1874,8964],[1864,8965],[1881,8977],[1890,8974]]],[[[1840,8981],[1844,8971],[1807,8973],[1823,8980],[1840,8981]]],[[[1756,8978],[1754,8977],[1746,8979],[1751,8982],[1756,8978]]],[[[1479,8982],[1481,8985],[1489,8981],[1487,8976],[1479,8982]]],[[[1315,8986],[1312,8986],[1311,8988],[1315,8988],[1315,8986]]],[[[1622,8997],[1634,8997],[1629,8989],[1611,8996],[1622,8997]]],[[[890,9007],[877,9007],[872,9011],[884,9008],[890,9007]]],[[[748,9020],[758,9020],[744,9016],[738,9020],[748,9020]]],[[[735,9020],[725,9020],[723,9021],[725,9023],[735,9020]]],[[[403,9024],[398,9023],[395,9020],[398,9026],[403,9024]]],[[[1216,9028],[1222,9027],[1230,9016],[1217,9020],[1216,9028]]],[[[2033,9068],[2043,9069],[2038,9062],[2030,9064],[2033,9068]]],[[[2046,9075],[2038,9075],[2040,9080],[2045,9081],[2046,9075]]],[[[1100,9174],[1080,9147],[1043,9179],[1041,9196],[1083,9199],[1100,9174]]],[[[1106,9352],[1117,9374],[1155,9352],[1166,9333],[1127,9326],[1106,9352]]],[[[1524,9434],[1544,9415],[1530,9407],[1498,9420],[1524,9434]]],[[[1088,9420],[1104,9404],[1081,9404],[1056,9441],[1088,9420]]],[[[1664,8007],[1660,8006],[1654,8006],[1656,8009],[1664,8007]]],[[[1600,8048],[1604,8045],[1593,8045],[1594,8049],[1600,8048]]],[[[1763,7943],[1772,7941],[1776,7924],[1734,7937],[1763,7943]]],[[[1732,7940],[1731,7937],[1726,7938],[1728,7941],[1732,7940]]],[[[1710,7953],[1718,7950],[1713,7944],[1709,7949],[1710,7953]]],[[[1938,7875],[1934,7873],[1936,7876],[1943,7877],[1938,7875]]],[[[1366,9443],[1437,9441],[1429,9423],[1355,9424],[1366,9443]]],[[[2430,7942],[2394,7922],[2378,7943],[2406,7980],[2411,7952],[2430,7942]]],[[[2364,7988],[2365,7958],[2348,7940],[2327,7957],[2361,7959],[2364,7988]]],[[[277,8210],[270,8217],[293,8221],[295,8199],[277,8210]]],[[[257,8259],[297,8258],[287,8221],[261,8230],[257,8259]]],[[[1844,8337],[1829,8330],[1851,8362],[1858,8352],[1844,8337]]],[[[1395,9317],[1429,9288],[1426,9252],[1382,9254],[1337,9272],[1349,9299],[1395,9317]]],[[[957,9478],[905,9483],[849,9475],[844,9483],[927,9507],[955,9496],[957,9478]]],[[[1358,9489],[1390,9481],[1388,9465],[1330,9444],[1302,9460],[1284,9490],[1291,9511],[1350,9498],[1358,9489]]],[[[2210,7911],[2202,7914],[2203,7927],[2195,7929],[2192,7933],[2192,7982],[2149,7996],[2126,7968],[2118,7937],[2082,7905],[1987,7905],[2022,7920],[2033,7943],[2111,7979],[2155,8025],[2239,8062],[2276,8063],[2298,8050],[2295,8032],[2262,8016],[2230,8020],[2256,8004],[2290,8010],[2271,7986],[2302,7943],[2350,7927],[2367,7937],[2394,7917],[2333,7893],[2308,7894],[2257,7848],[2239,7871],[2245,7889],[2279,7910],[2289,7938],[2249,7913],[2210,7911]]],[[[2018,7927],[2024,7931],[2021,7924],[2020,7921],[2009,7921],[2015,7925],[2012,7925],[2016,7930],[2021,7930],[2018,7927]]],[[[518,8075],[504,8083],[514,8081],[518,8075],[518,8075],[518,8075]]],[[[629,9322],[617,9345],[604,9327],[571,9328],[559,9347],[597,9359],[678,9417],[749,9430],[780,9414],[754,9406],[765,9375],[730,9364],[718,9338],[684,9302],[660,9308],[712,9340],[710,9380],[687,9377],[670,9338],[629,9322]]],[[[2606,8006],[2634,8020],[2643,7998],[2633,7971],[2596,7976],[2607,7995],[2574,7990],[2550,7973],[2552,8004],[2449,8000],[2441,8012],[2462,8038],[2521,8144],[2553,8130],[2521,8094],[2558,8090],[2552,8069],[2599,8083],[2618,8064],[2604,8038],[2629,8033],[2606,8006]]],[[[1663,8674],[1617,8670],[1645,8694],[1639,8718],[1654,8775],[1667,8783],[1687,8748],[1694,8761],[1761,8726],[1784,8700],[1824,8681],[1800,8664],[1725,8695],[1722,8679],[1673,8648],[1663,8674]]],[[[1295,8985],[1330,8964],[1360,8932],[1379,8931],[1340,8910],[1312,8914],[1248,8940],[1284,8957],[1295,8985]]],[[[1118,9032],[1191,8997],[1210,8979],[1165,8981],[1152,8958],[1175,8964],[1181,8940],[1135,8927],[1046,8948],[1043,8964],[1019,8939],[971,8925],[843,8910],[830,8948],[762,8954],[719,8990],[733,8998],[815,9008],[894,9005],[875,9018],[821,9029],[760,9020],[715,9023],[691,9046],[758,9065],[767,9075],[697,9065],[700,9081],[671,9079],[670,9095],[698,9112],[685,9123],[721,9151],[804,9178],[822,9164],[829,9134],[850,9157],[903,9140],[890,9116],[922,9133],[946,9128],[919,9156],[937,9155],[980,9131],[1007,9079],[1021,9094],[1006,9107],[996,9142],[999,9187],[1024,9167],[1044,9168],[1077,9144],[1079,9125],[1107,9076],[1100,9049],[1118,9032]]],[[[1885,9194],[1941,9161],[1939,9145],[1830,9148],[1807,9172],[1804,9199],[1885,9194]]],[[[1340,9095],[1291,9080],[1274,9059],[1217,9110],[1182,9118],[1155,9145],[1179,9161],[1198,9140],[1223,9141],[1230,9163],[1188,9184],[1204,9198],[1291,9219],[1302,9241],[1296,9210],[1318,9205],[1321,9178],[1285,9158],[1318,9154],[1331,9167],[1346,9123],[1340,9095]]],[[[596,9246],[638,9229],[700,9230],[736,9218],[782,9183],[668,9135],[638,9108],[624,9071],[551,9049],[522,9083],[467,9098],[499,9159],[531,9200],[502,9234],[596,9246]]],[[[1227,9273],[1215,9298],[1242,9311],[1158,9302],[1138,9317],[1171,9332],[1183,9360],[1242,9329],[1202,9368],[1208,9378],[1306,9362],[1313,9300],[1295,9274],[1227,9273]]],[[[938,9326],[960,9339],[928,9351],[976,9386],[984,9335],[1027,9326],[1040,9336],[1073,9326],[1073,9306],[1130,9283],[1100,9275],[1068,9293],[1058,9276],[987,9267],[975,9276],[890,9242],[830,9239],[808,9254],[857,9271],[887,9271],[912,9287],[822,9276],[820,9294],[792,9270],[717,9284],[764,9354],[794,9364],[795,9380],[808,9377],[822,9344],[851,9349],[896,9323],[902,9303],[972,9302],[974,9314],[938,9326]]],[[[1848,9265],[1825,9250],[1777,9240],[1726,9247],[1603,9240],[1567,9252],[1535,9244],[1473,9259],[1459,9285],[1470,9325],[1440,9355],[1412,9348],[1360,9357],[1331,9393],[1362,9399],[1423,9389],[1442,9371],[1490,9375],[1552,9344],[1528,9336],[1587,9303],[1652,9304],[1719,9322],[1797,9319],[1840,9300],[1841,9283],[1817,9274],[1848,9265]]],[[[933,9426],[877,9415],[845,9427],[833,9446],[816,9439],[788,9455],[811,9463],[843,9452],[918,9464],[949,9456],[933,9426]]],[[[1126,9547],[1165,9524],[1187,9528],[1249,9496],[1240,9486],[1266,9450],[1200,9447],[1205,9471],[1154,9471],[1155,9482],[1104,9475],[1087,9490],[1131,9490],[1115,9522],[1071,9525],[1076,9545],[1126,9547]]],[[[1511,9629],[1553,9627],[1562,9603],[1579,9620],[1601,9618],[1623,9584],[1617,9561],[1665,9561],[1684,9542],[1637,9527],[1563,9469],[1474,9471],[1406,9521],[1437,9534],[1477,9534],[1456,9553],[1417,9540],[1362,9550],[1334,9600],[1389,9593],[1338,9609],[1354,9630],[1379,9632],[1370,9645],[1389,9663],[1439,9666],[1403,9677],[1436,9685],[1480,9670],[1511,9629]]],[[[518,8075],[519,8073],[519,8072],[518,8075],[518,8075],[518,8075]]]]}},{"type":"Feature","id":"ST","properties":{"hc-group":"admin0","hc-middle-x":0.55,"hc-middle-y":0.50,"hc-key":"st","hc-a2":"ST","name":"Sao Tome and Principe","labelrank":"6","country-abbrev":"S.T.P.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"STP","iso-a2":"ST","woe-id":"23424966","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4400,6481],[4396,6485],[4401,6491],[4405,6487],[4400,6481]]]}},{"type":"Feature","id":"CV","properties":{"hc-group":"admin0","hc-middle-x":0.56,"hc-middle-y":0.50,"hc-key":"cv","hc-a2":"CV","name":"Cape Verde","labelrank":"4","country-abbrev":"C.Vd.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"CPV","iso-a2":"CV","woe-id":"23424794","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3499,6934],[3506,6928],[3507,6922],[3499,6925],[3499,6934]]]}},{"type":"Feature","id":"DM","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.47,"hc-key":"dm","hc-a2":"DM","name":"Dominica","labelrank":"6","country-abbrev":"D'inca","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"DMA","iso-a2":"DM","woe-id":"23424798","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2382,6942],[2386,6936],[2383,6930],[2380,6939],[2382,6942]]]}},{"type":"Feature","id":"NL","properties":{"hc-group":"admin0","hc-middle-x":0.99,"hc-middle-y":0.01,"hc-key":"nl","hc-a2":"NL","name":"Netherlands","labelrank":"5","country-abbrev":"Neth.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"NLD","iso-a2":"NL","woe-id":"-90","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4369,8229],[4359,8225],[4360,8227],[4372,8230],[4369,8229]]],[[[2334,7016],[2331,7016],[2331,7017],[2334,7016]]],[[[4303,8146],[4315,8146],[4329,8146],[4317,8140],[4303,8146]]],[[[4417,8221],[4412,8180],[4393,8164],[4382,8122],[4353,8150],[4330,8146],[4318,8156],[4355,8209],[4396,8234],[4417,8221]]]]}},{"type":"Feature","id":"JM","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.52,"hc-key":"jm","hc-a2":"JM","name":"Jamaica","labelrank":"4","country-abbrev":"Jam.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"JAM","iso-a2":"JM","woe-id":"23424858","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1906,7029],[1943,7013],[1913,7006],[1878,7023],[1906,7029]]]}},{"type":"Feature","id":"WS","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.54,"hc-key":"ws","hc-a2":"WS","name":"Samoa","labelrank":"4","country-abbrev":"Samoa","subregion":"Polynesia","region-wb":"East Asia & Pacific","iso-a3":"WSM","iso-a2":"WS","woe-id":"23424992","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[-909,6078],[-907,6069],[-916,6069],[-924,6078],[-909,6078]]]}},{"type":"Feature","id":"OM","properties":{"hc-group":"admin0","hc-middle-x":0.88,"hc-middle-y":0.44,"hc-key":"om","hc-a2":"OM","name":"Oman","labelrank":"4","country-abbrev":"Oman","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"OMN","iso-a2":"OM","woe-id":"23424898","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5874,7239],[5873,7238],[5873,7241],[5876,7241],[5874,7239]]],[[[5868,7265],[5877,7275],[5874,7251],[5870,7253],[5868,7265]]],[[[5747,7045],[5836,7076],[5855,7137],[5842,7160],[5860,7228],[5877,7231],[5900,7199],[5948,7186],[5979,7145],[5916,7068],[5920,7047],[5885,7033],[5876,7013],[5849,7010],[5837,6985],[5780,6974],[5769,6994],[5747,7045]]]]}},{"type":"Feature","id":"VC","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"vc","hc-a2":"VC","name":"Saint Vincent and the Grenadines","labelrank":"6","country-abbrev":"St.V.G.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"VCT","iso-a2":"VC","woe-id":"23424981","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2388,6865],[2385,6871],[2389,6875],[2390,6870],[2388,6865]]]}},{"type":"Feature","id":"TR","properties":{"hc-group":"admin0","hc-middle-x":0.34,"hc-middle-y":0.49,"hc-key":"tr","hc-a2":"TR","name":"Turkey","labelrank":"2","country-abbrev":"Tur.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"TUR","iso-a2":"TR","woe-id":"23424969","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4974,7732],[4969,7730],[4966,7731],[4973,7735],[4974,7732]]],[[[5035,7796],[5068,7769],[5021,7761],[5011,7748],[4977,7752],[4994,7775],[4985,7786],[5007,7799],[5035,7796]]],[[[5534,7714],[5510,7704],[5516,7656],[5532,7628],[5472,7635],[5461,7627],[5457,7634],[5384,7614],[5338,7620],[5291,7617],[5270,7586],[5272,7620],[5252,7608],[5229,7615],[5177,7590],[5154,7607],[5115,7619],[5106,7597],[5085,7593],[5044,7625],[5011,7635],[5012,7657],[4983,7666],[5007,7687],[4989,7700],[4986,7702],[4979,7707],[4997,7740],[5069,7741],[5071,7770],[5131,7764],[5193,7797],[5271,7787],[5318,7762],[5374,7765],[5395,7758],[5436,7779],[5474,7782],[5493,7765],[5500,7730],[5533,7716],[5534,7714]]]]}},{"type":"Feature","id":"BD","properties":{"hc-group":"admin0","hc-middle-x":0.85,"hc-middle-y":0.61,"hc-key":"bd","hc-a2":"BD","name":"Bangladesh","labelrank":"3","country-abbrev":"Bang.","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"BGD","iso-a2":"BD","woe-id":"23424759","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6942,7109],[6918,7163],[6880,7132],[6847,7142],[6832,7189],[6837,7209],[6816,7220],[6843,7237],[6818,7260],[6829,7277],[6870,7262],[6886,7236],[6935,7237],[6949,7229],[6909,7188],[6922,7167],[6939,7192],[6951,7137],[6953,7116],[6942,7109]]]}},{"type":"Feature","id":"LC","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.47,"hc-key":"lc","hc-a2":"LC","name":"Saint Lucia","labelrank":"6","country-abbrev":"S.L.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"LCA","iso-a2":"LC","woe-id":"23424951","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2395,6886],[2391,6890],[2396,6897],[2397,6893],[2395,6886]]]}},{"type":"Feature","id":"NR","properties":{"hc-group":"admin0","hc-middle-x":0.53,"hc-middle-y":0.50,"hc-key":"nr","hc-a2":"NR","name":"Nauru","labelrank":"6","country-abbrev":"Nauru","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"NRU","iso-a2":"NR","woe-id":"23424912","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[9158,6463],[9157,6463],[9157,6464],[9159,6464],[9158,6463]]]}},{"type":"Feature","id":"NO","properties":{"hc-group":"admin0","hc-middle-x":0.10,"hc-middle-y":0.93,"hc-key":"no","hc-a2":"NO","name":"Norway","labelrank":"3","country-abbrev":"Nor.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"NOR","iso-a2":"NO","woe-id":"-90","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4821,8997],[4815,8993],[4809,8996],[4815,9003],[4821,8997]]],[[[4797,8992],[4790,8995],[4784,9004],[4802,8997],[4797,8992]]],[[[4877,9011],[4887,9004],[4870,9006],[4871,9011],[4877,9011]]],[[[4901,9024],[4906,9016],[4890,9006],[4882,9013],[4901,9024]]],[[[4911,9029],[4920,9024],[4909,9019],[4905,9028],[4911,9029]]],[[[4898,9036],[4889,9022],[4861,9017],[4873,9029],[4898,9036]]],[[[4918,9045],[4919,9040],[4914,9042],[4915,9046],[4918,9045]]],[[[4966,9053],[4974,9045],[4962,9041],[4955,9047],[4966,9053]]],[[[4841,9496],[4865,9475],[4829,9471],[4803,9490],[4841,9496]]],[[[4998,9499],[4989,9504],[4994,9510],[5000,9504],[4998,9499]]],[[[5066,9517],[5038,9511],[5030,9512],[5047,9521],[5066,9517]]],[[[4804,9531],[4822,9526],[4810,9523],[4799,9526],[4804,9531]]],[[[4802,9547],[4789,9545],[4786,9549],[4789,9550],[4802,9547]]],[[[5202,9605],[5178,9599],[5142,9595],[5139,9598],[5202,9605]]],[[[4928,9617],[4921,9616],[4921,9620],[4923,9621],[4928,9617]]],[[[4921,9625],[4925,9623],[4923,9622],[4917,9623],[4921,9625]]],[[[4797,9623],[4793,9624],[4796,9627],[4801,9625],[4797,9623]]],[[[4837,9638],[4831,9635],[4828,9638],[4834,9639],[4837,9638]]],[[[4821,9634],[4821,9638],[4813,9643],[4826,9639],[4821,9634]]],[[[4748,8967],[4767,8968],[4802,8988],[4813,8979],[4815,8980],[4817,8980],[4818,8983],[4823,8988],[4820,8990],[4826,8992],[4827,8992],[4845,9007],[4847,9007],[4847,9006],[4849,9005],[4850,9007],[4886,9002],[4934,9033],[4973,9037],[4948,9018],[4950,8995],[4996,9042],[4991,9010],[5022,9050],[5094,9029],[5126,9006],[5099,8995],[5057,9000],[5119,8981],[5093,8957],[5063,8940],[5075,8962],[5032,8995],[4976,8974],[4965,8932],[4942,8915],[4914,8929],[4869,8923],[4847,8952],[4816,8940],[4797,8905],[4743,8914],[4735,8885],[4718,8892],[4683,8857],[4691,8839],[4635,8792],[4635,8753],[4609,8718],[4618,8690],[4580,8688],[4560,8656],[4569,8610],[4565,8584],[4586,8568],[4568,8551],[4575,8512],[4556,8501],[4543,8462],[4515,8473],[4456,8430],[4429,8420],[4398,8424],[4359,8468],[4372,8509],[4342,8554],[4363,8576],[4347,8589],[4369,8612],[4411,8630],[4409,8639],[4464,8659],[4435,8662],[4465,8681],[4504,8658],[4544,8680],[4498,8667],[4487,8679],[4537,8729],[4562,8742],[4566,8761],[4607,8833],[4667,8874],[4643,8878],[4692,8898],[4682,8907],[4716,8924],[4703,8941],[4719,8966],[4748,8967],[4769,8982],[4768,8999],[4781,8983],[4748,8967]],[[5095,8982],[5091,8986],[5086,8978],[5097,8981],[5095,8982]]],[[[4948,9363],[4949,9366],[4963,9376],[4948,9363],[4948,9363],[4948,9363]]],[[[4630,8922],[4662,8932],[4682,8955],[4696,8923],[4668,8902],[4602,8890],[4605,8899],[4657,8910],[4630,8922]]],[[[4893,9411],[4874,9424],[4825,9422],[4847,9452],[4824,9463],[4886,9474],[4905,9449],[4929,9446],[4893,9411]]],[[[4669,9570],[4695,9593],[4764,9552],[4766,9533],[4843,9513],[4768,9488],[4744,9425],[4730,9424],[4703,9367],[4631,9407],[4617,9428],[4702,9450],[4611,9443],[4607,9461],[4650,9465],[4673,9480],[4644,9505],[4641,9483],[4590,9471],[4561,9497],[4565,9471],[4533,9487],[4515,9516],[4540,9521],[4522,9560],[4531,9569],[4564,9568],[4613,9582],[4616,9559],[4636,9577],[4658,9563],[4689,9517],[4669,9570]]],[[[4909,9611],[5000,9602],[5010,9580],[4975,9557],[4918,9535],[4884,9538],[4883,9551],[4822,9548],[4787,9564],[4852,9570],[4854,9578],[4761,9571],[4763,9592],[4732,9599],[4742,9610],[4778,9596],[4809,9619],[4824,9604],[4852,9608],[4868,9590],[4879,9624],[4887,9601],[4909,9611]]],[[[4948,9363],[4946,9359],[4947,9363],[4948,9363],[4948,9363],[4948,9363]]]]}},{"type":"Feature","id":"KN","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.49,"hc-key":"kn","hc-a2":"KN","name":"Saint Kitts and Nevis","labelrank":"6","country-abbrev":"St.K.N.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"KNA","iso-a2":"KN","woe-id":"23424940","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2346,6991],[2339,6996],[2340,6997],[2343,6995],[2346,6991]]]}},{"type":"Feature","id":"BH","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.50,"hc-key":"bh","hc-a2":"BH","name":"Bahrain","labelrank":"4","country-abbrev":"Bahr.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"BHR","iso-a2":"BH","woe-id":"23424753","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5702,7271],[5706,7269],[5705,7256],[5701,7263],[5702,7271]]]}},{"type":"Feature","id":"TO","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.34,"hc-key":"to","hc-a2":"TO","name":"Tonga","labelrank":"4","country-abbrev":"Tongo","subregion":"Polynesia","region-wb":"East Asia & Pacific","iso-a3":"TON","iso-a2":"TO","woe-id":"23424964","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[-987,5842],[-988,5840],[-999,5845],[-992,5847],[-987,5842]]]}},{"type":"Feature","id":"FI","properties":{"hc-group":"admin0","hc-middle-x":0.63,"hc-middle-y":0.54,"hc-key":"fi","hc-a2":"FI","name":"Finland","labelrank":"3","country-abbrev":"Fin.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"FIN","iso-a2":"FI","woe-id":"23424812","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4816,8512],[4815,8507],[4806,8505],[4810,8509],[4816,8512]]],[[[4803,8510],[4806,8512],[4803,8505],[4798,8508],[4803,8510]]],[[[4808,8518],[4799,8510],[4785,8518],[4800,8522],[4808,8518]]],[[[4844,8516],[4844,8514],[4855,8514],[4842,8511],[4844,8516]]],[[[4870,8506],[4870,8515],[4882,8511],[4872,8501],[4870,8506]]],[[[4836,8532],[4837,8528],[4836,8523],[4835,8528],[4836,8532]]],[[[4835,8657],[4838,8652],[4834,8650],[4830,8654],[4835,8657]]],[[[4942,8741],[4935,8736],[4933,8739],[4936,8741],[4942,8741]]],[[[4851,8526],[4845,8528],[4834,8596],[4842,8652],[4868,8658],[4939,8731],[4954,8729],[4955,8762],[4921,8778],[4906,8808],[4916,8826],[4899,8860],[4906,8885],[4816,8940],[4847,8952],[4869,8923],[4914,8929],[4942,8915],[4965,8932],[4976,8974],[5032,8995],[5075,8962],[5063,8940],[5048,8914],[5055,8897],[5095,8871],[5067,8828],[5091,8792],[5082,8737],[5111,8691],[5094,8678],[5141,8638],[5131,8620],[5071,8562],[5029,8531],[4909,8505],[4869,8520],[4871,8521],[4866,8521],[4866,8521],[4854,8525],[4857,8523],[4856,8520],[4851,8524],[4851,8526]]]]}},{"type":"Feature","id":"ID","properties":{"hc-group":"admin0","hc-middle-x":0.38,"hc-middle-y":0.41,"hc-key":"id","hc-a2":"ID","name":"Indonesia","labelrank":"2","country-abbrev":"Indo.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"IDN","iso-a2":"ID","woe-id":"23424846","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[8188,6311],[8203,6311],[8186,6274],[8184,6299],[8156,6320],[8188,6311]]],[[[7394,6396],[7365,6387],[7343,6415],[7351,6432],[7368,6393],[7394,6396]]],[[[7693,6231],[7736,6235],[7737,6224],[7676,6209],[7642,6218],[7658,6236],[7693,6231]]],[[[8007,6546],[8003,6517],[8028,6486],[8001,6493],[7995,6439],[7976,6470],[7993,6473],[7985,6514],[8007,6546]]],[[[7885,6203],[7891,6198],[7897,6207],[7902,6208],[7911,6214],[7912,6206],[7915,6198],[7897,6179],[7868,6172],[7885,6203]]],[[[7703,6601],[7696,6596],[7697,6601],[7703,6601]]],[[[8388,6402],[8388,6275],[8388,6210],[8360,6240],[8289,6230],[8299,6253],[8325,6262],[8294,6324],[8238,6346],[8216,6347],[8170,6376],[8148,6358],[8127,6400],[8181,6408],[8142,6411],[8087,6439],[8070,6476],[8099,6455],[8142,6468],[8180,6457],[8185,6415],[8210,6380],[8248,6403],[8246,6430],[8295,6435],[8355,6409],[8388,6402]]],[[[7779,6174],[7734,6196],[7755,6202],[7771,6234],[7833,6224],[7852,6236],[7936,6242],[7886,6226],[7878,6234],[7818,6216],[7763,6218],[7789,6183],[7779,6174]]],[[[7419,6248],[7365,6260],[7335,6278],[7351,6305],[7419,6294],[7427,6279],[7483,6274],[7496,6290],[7530,6275],[7624,6277],[7624,6218],[7565,6234],[7548,6229],[7490,6237],[7450,6251],[7419,6248]]],[[[8007,6388],[7965,6365],[7943,6380],[7942,6408],[7946,6387],[7976,6380],[8002,6393],[8048,6397],[8079,6386],[8086,6365],[8007,6388]]],[[[7849,6311],[7824,6317],[7851,6347],[7809,6341],[7813,6358],[7778,6383],[7775,6316],[7746,6321],[7754,6351],[7730,6401],[7746,6421],[7766,6500],[7792,6519],[7814,6510],[7882,6503],[7917,6531],[7898,6492],[7774,6491],[7765,6473],[7785,6438],[7815,6465],[7866,6460],[7862,6427],[7846,6446],[7811,6422],[7839,6386],[7855,6349],[7849,6311]]],[[[7693,6601],[7687,6576],[7709,6546],[7702,6535],[7736,6509],[7698,6501],[7689,6463],[7663,6436],[7664,6414],[7646,6373],[7606,6356],[7594,6380],[7558,6385],[7522,6375],[7519,6397],[7476,6390],[7466,6446],[7452,6441],[7434,6503],[7458,6540],[7485,6504],[7557,6525],[7602,6521],[7631,6568],[7642,6608],[7693,6601]]],[[[7120,6602],[7164,6572],[7200,6534],[7221,6541],[7283,6486],[7272,6457],[7301,6448],[7311,6409],[7338,6408],[7352,6382],[7345,6312],[7312,6304],[7219,6384],[7196,6415],[7181,6455],[7152,6486],[7124,6478],[7149,6426],[7139,6429],[7121,6478],[7145,6496],[7128,6536],[7092,6539],[7110,6508],[7103,6496],[7087,6540],[7065,6548],[7092,6543],[7100,6563],[7036,6621],[7032,6650],[7065,6633],[7097,6634],[7120,6602]]]]}},{"type":"Feature","id":"MU","properties":{"hc-group":"admin0","hc-middle-x":0.63,"hc-middle-y":0.58,"hc-key":"mu","hc-a2":"MU","name":"Mauritius","labelrank":"5","country-abbrev":"Mus.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MUS","iso-a2":"MU","woe-id":"23424894","continent":"Seven seas (open ocean)"},"geometry":{"type":"Polygon","coordinates":[[[5917,5878],[5916,5867],[5907,5866],[5911,5880],[5917,5878]]]}},{"type":"Feature","id":"SE","properties":{"hc-group":"admin0","hc-middle-x":0.40,"hc-middle-y":0.48,"hc-key":"se","hc-a2":"SE","name":"Sweden","labelrank":"3","country-abbrev":"Swe.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"SWE","iso-a2":"SE","woe-id":"23424954","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4749,8461],[4749,8461],[4749,8466],[4753,8466],[4749,8461]]],[[[4864,8758],[4864,8764],[4868,8762],[4868,8758],[4864,8758]]],[[[4921,8778],[4853,8764],[4831,8722],[4845,8711],[4821,8684],[4769,8651],[4733,8619],[4712,8569],[4718,8540],[4736,8533],[4770,8495],[4751,8469],[4701,8445],[4691,8414],[4700,8372],[4711,8391],[4741,8387],[4760,8415],[4759,8386],[4710,8386],[4693,8344],[4640,8340],[4625,8309],[4589,8309],[4571,8373],[4546,8417],[4550,8417],[4552,8421],[4545,8421],[4546,8418],[4537,8434],[4543,8462],[4556,8501],[4575,8512],[4568,8551],[4586,8568],[4565,8584],[4569,8610],[4560,8656],[4580,8688],[4618,8690],[4609,8718],[4635,8753],[4635,8792],[4691,8839],[4683,8857],[4718,8892],[4735,8885],[4743,8914],[4797,8905],[4816,8940],[4906,8885],[4899,8860],[4916,8826],[4906,8808],[4921,8778]],[[4554,8430],[4543,8426],[4546,8423],[4554,8424],[4554,8430]]]]}},{"type":"Feature","id":"TT","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.44,"hc-key":"tt","hc-a2":"TT","name":"Trinidad and Tobago","labelrank":"5","country-abbrev":"Tr.T.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"TTO","iso-a2":"TT","woe-id":"23424958","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2396,6799],[2394,6779],[2380,6783],[2374,6796],[2396,6799]]]}},{"type":"Feature","id":"MY","properties":{"hc-group":"admin0","hc-middle-x":0.90,"hc-middle-y":0.26,"hc-key":"my","hc-a2":"MY","name":"Malaysia","labelrank":"3","country-abbrev":"Malay.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"MYS","iso-a2":"MY","woe-id":"23424901","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7181,6640],[7180,6634],[7177,6634],[7177,6640],[7181,6640]]],[[[7703,6601],[7697,6601],[7698,6602],[7693,6601],[7642,6608],[7631,6568],[7602,6521],[7557,6525],[7485,6504],[7458,6540],[7498,6525],[7508,6550],[7510,6549],[7510,6554],[7511,6558],[7558,6572],[7587,6614],[7606,6597],[7616,6623],[7617,6624],[7618,6621],[7627,6606],[7621,6623],[7650,6660],[7685,6675],[7743,6632],[7710,6623],[7722,6607],[7701,6603],[7703,6601]]],[[[7175,6669],[7204,6663],[7205,6645],[7233,6663],[7274,6620],[7274,6565],[7299,6519],[7272,6524],[7210,6563],[7193,6593],[7175,6669]]]]}},{"type":"Feature","id":"PA","properties":{"hc-group":"admin0","hc-middle-x":0.22,"hc-middle-y":0.50,"hc-key":"pa","hc-a2":"PA","name":"Panama","labelrank":"4","country-abbrev":"Pan.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"PAN","iso-a2":"PA","woe-id":"23424924","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1892,6692],[1873,6732],[1843,6744],[1816,6717],[1829,6699],[1776,6692],[1778,6721],[1744,6716],[1739,6725],[1740,6725],[1740,6725],[1740,6726],[1740,6726],[1754,6762],[1768,6743],[1798,6739],[1841,6763],[1876,6757],[1908,6735],[1914,6713],[1892,6692]]]}},{"type":"Feature","id":"PW","properties":{"hc-group":"admin0","hc-middle-x":0.38,"hc-middle-y":0.44,"hc-key":"pw","hc-a2":"PW","name":"Palau","labelrank":"6","country-abbrev":"Palau","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"PLW","iso-a2":"PW","woe-id":"23424927","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[8196,6695],[8195,6699],[8197,6703],[8200,6703],[8196,6695]]]}},{"type":"Feature","id":"TV","properties":{"hc-group":"admin0","hc-middle-x":0.25,"hc-middle-y":0.50,"hc-key":"tv","hc-a2":"TV","name":"Tuvalu","labelrank":"6","country-abbrev":"Tuv.","subregion":"Polynesia","region-wb":"East Asia & Pacific","iso-a3":"TUV","iso-a2":"TV","woe-id":"23424970","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[9522,6227],[9522,6227],[9522,6229],[9522,6227],[9522,6227]]]}},{"type":"Feature","id":"MH","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.60,"hc-key":"mh","hc-a2":"MH","name":"Marshall Islands","labelrank":"6","country-abbrev":"M. Is.","subregion":"Micronesia","region-wb":"East Asia & Pacific","iso-a3":"MHL","iso-a2":"MH","woe-id":"23424932","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[9280,6690],[9285,6688],[9286,6687],[9285,6688],[9280,6690]]]}},{"type":"Feature","id":"CL","properties":{"hc-group":"admin0","hc-middle-x":0.51,"hc-middle-y":0.90,"hc-key":"cl","hc-a2":"CL","name":"Chile","labelrank":"2","country-abbrev":"Chile","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"CHL","iso-a2":"CL","woe-id":"23424782","continent":"South America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2028,4732],[2063,4714],[2042,4700],[2014,4729],[2028,4732]]],[[[1977,4948],[1993,4916],[1994,4867],[1960,4879],[1981,4893],[1959,4908],[1961,4938],[1977,4948]]],[[[2022,5147],[2016,5111],[1985,5101],[2001,5124],[2006,5163],[2022,5147]]],[[[2167,4761],[2167,4674],[2165,4674],[2167,4673],[2167,4670],[2128,4674],[2110,4657],[2088,4695],[2113,4723],[2117,4693],[2157,4688],[2125,4702],[2114,4746],[2144,4768],[2167,4761]]],[[[2115,5932],[2128,5935],[2141,5957],[2157,5913],[2173,5898],[2163,5868],[2180,5842],[2189,5794],[2210,5794],[2206,5757],[2169,5733],[2177,5666],[2162,5659],[2137,5618],[2109,5516],[2133,5456],[2115,5397],[2115,5366],[2096,5352],[2091,5311],[2101,5277],[2085,5269],[2069,5206],[2075,5158],[2063,5125],[2077,5092],[2066,5062],[2088,5042],[2070,4970],[2051,4944],[2059,4928],[2020,4882],[2032,4835],[2058,4839],[2054,4804],[2070,4787],[2128,4786],[2173,4772],[2152,4778],[2105,4757],[2096,4714],[2032,4737],[2038,4753],[2004,4758],[1996,4781],[2017,4777],[2012,4815],[1976,4834],[2000,4847],[1996,4918],[1986,4952],[2000,4987],[1966,4992],[1995,5037],[2008,5015],[2031,5042],[2026,5058],[1996,5060],[2012,5097],[2020,5062],[2053,5159],[2039,5179],[2015,5170],[2010,5197],[2030,5249],[2018,5310],[2031,5329],[2048,5383],[2060,5398],[2085,5489],[2078,5559],[2088,5569],[2081,5601],[2100,5643],[2113,5714],[2109,5785],[2125,5837],[2115,5932]]],[[[2209,4666],[2230,4654],[2168,4659],[2214,4627],[2192,4628],[2162,4657],[2133,4648],[2129,4663],[2202,4668],[2207,4668],[2209,4666]]]]}},{"type":"Feature","id":"TH","properties":{"hc-group":"admin0","hc-middle-x":0.25,"hc-middle-y":0.49,"hc-key":"th","hc-a2":"TH","name":"Thailand","labelrank":"3","country-abbrev":"Thai.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"THA","iso-a2":"TH","woe-id":"23424960","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7239,6839],[7241,6837],[7244,6834],[7240,6833],[7239,6839]]],[[[7233,6663],[7205,6645],[7204,6663],[7175,6669],[7151,6704],[7118,6732],[7134,6785],[7161,6829],[7146,6886],[7119,6918],[7137,6959],[7095,7030],[7113,7070],[7128,7066],[7175,7086],[7186,7062],[7209,7061],[7205,6999],[7233,7022],[7249,7010],[7272,7029],[7290,7025],[7315,6996],[7313,6970],[7338,6946],[7325,6904],[7280,6907],[7241,6881],[7258,6824],[7226,6854],[7201,6852],[7200,6878],[7173,6876],[7172,6840],[7151,6793],[7149,6752],[7167,6753],[7185,6690],[7218,6681],[7233,6663]]]]}},{"type":"Feature","id":"GD","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"gd","hc-a2":"GD","name":"Grenada","labelrank":"6","country-abbrev":"Gren.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"GRD","iso-a2":"GD","woe-id":"23424826","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2375,6835],[2372,6835],[2372,6839],[2376,6841],[2375,6835]]]}},{"type":"Feature","id":"EE","properties":{"hc-group":"admin0","hc-middle-x":0.35,"hc-middle-y":0.41,"hc-key":"ee","hc-a2":"EE","name":"Estonia","labelrank":"6","country-abbrev":"Est.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"EST","iso-a2":"EE","woe-id":"23424805","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4876,8444],[4887,8435],[4863,8425],[4852,8441],[4876,8444]]],[[[4897,8446],[4893,8442],[4888,8445],[4892,8448],[4897,8446]]],[[[4893,8464],[4897,8464],[4898,8461],[4891,8461],[4893,8464]]],[[[4878,8463],[4888,8455],[4872,8449],[4858,8459],[4878,8463]]],[[[5026,8462],[5004,8453],[5024,8419],[5021,8411],[5016,8399],[4990,8398],[4954,8422],[4925,8413],[4902,8443],[4901,8472],[4975,8490],[5035,8483],[5038,8482],[5040,8478],[5038,8477],[5035,8477],[5035,8477],[5037,8476],[5037,8476],[5038,8476],[5037,8476],[5034,8476],[5030,8469],[5026,8462]]]]}},{"type":"Feature","id":"AG","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.48,"hc-key":"ag","hc-a2":"AG","name":"Antigua and Barbuda","labelrank":"6","country-abbrev":"Ant.B.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"ATG","iso-a2":"AG","woe-id":"23424737","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2371,6989],[2373,6986],[2369,6985],[2367,6988],[2371,6989]]]}},{"type":"Feature","id":"TW","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.41,"hc-key":"tw","hc-a2":"TW","name":"Taiwan","labelrank":"3","country-abbrev":"Taiwan","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"TWN","iso-a2":"TW","woe-id":"23424971","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7752,7185],[7768,7185],[7797,7233],[7821,7235],[7807,7173],[7790,7136],[7752,7185]]]}},{"type":"Feature","id":"BB","properties":{"hc-group":"admin0","hc-middle-x":0.31,"hc-middle-y":0.56,"hc-key":"bb","hc-a2":"BB","name":"Barbados","labelrank":"5","country-abbrev":"Barb.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"BRB","iso-a2":"BB","woe-id":"23424754","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2438,6866],[2434,6868],[2435,6874],[2440,6869],[2438,6866]]]}},{"type":"Feature","id":"IT","properties":{"hc-group":"admin0","hc-middle-x":0.79,"hc-middle-y":0.71,"hc-key":"it","hc-a2":"IT","name":"Italy","labelrank":"2","country-abbrev":"Italy","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"ITA","iso-a2":"IT","woe-id":"23424853","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4571,7654],[4668,7666],[4655,7649],[4652,7611],[4634,7616],[4571,7654]]],[[[4484,7768],[4496,7744],[4488,7697],[4454,7690],[4456,7736],[4448,7757],[4484,7768]]],[[[4427,7861],[4400,7909],[4412,7939],[4444,7951],[4466,7944],[4500,7955],[4514,7974],[4566,7982],[4572,7967],[4611,7961],[4601,7952],[4611,7927],[4596,7933],[4565,7916],[4572,7876],[4608,7851],[4622,7818],[4654,7794],[4680,7795],[4677,7778],[4738,7749],[4753,7731],[4710,7744],[4694,7715],[4713,7705],[4681,7655],[4685,7684],[4668,7729],[4611,7770],[4591,7769],[4536,7815],[4504,7869],[4464,7884],[4427,7861]],[[4574,7793],[4574,7793],[4574,7793],[4574,7793],[4574,7793]],[[4574,7865],[4574,7868],[4573,7867],[4572,7866],[4574,7865]]]]}},{"type":"Feature","id":"MT","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.53,"hc-key":"mt","hc-a2":"MT","name":"Malta","labelrank":"5","country-abbrev":"Malta","subregion":"Southern Europe","region-wb":"Middle East & North Africa","iso-a3":"MLT","iso-a2":"MT","woe-id":"23424897","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4628,7589],[4635,7586],[4635,7582],[4631,7584],[4628,7589]]]}},{"type":"Feature","id":"VU","properties":{"hc-group":"admin0","hc-middle-x":0.60,"hc-middle-y":0.53,"hc-key":"vu","hc-a2":"VU","name":"Vanuatu","labelrank":"4","country-abbrev":"Van.","subregion":"Melanesia","region-wb":"East Asia & Pacific","iso-a3":"VUT","iso-a2":"VU","woe-id":"23424907","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[9172,6054],[9194,6034],[9205,5976],[9178,5988],[9154,6029],[9172,6054]]]}},{"type":"Feature","id":"SG","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.57,"hc-key":"sg","hc-a2":"SG","name":"Singapore","labelrank":"6","country-abbrev":"Sing.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"SGP","iso-a2":"SG","woe-id":"23424948","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7286,6521],[7290,6519],[7286,6516],[7280,6517],[7286,6521]]]}},{"type":"Feature","id":"CY","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.51,"hc-key":"cy","hc-a2":"CY","name":"Cyprus","labelrank":"5","country-abbrev":"Cyp.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"CYP","iso-a2":"CY","woe-id":"-90","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5205,7555],[5205,7556],[5206,7556],[5205,7555]]],[[[5214,7557],[5216,7554],[5210,7554],[5207,7557],[5210,7557],[5213,7557],[5214,7557]]],[[[5206,7555],[5206,7555],[5207,7555],[5207,7554],[5206,7555]]],[[[5204,7554],[5201,7549],[5184,7543],[5178,7545],[5176,7544],[5162,7557],[5171,7561],[5172,7560],[5173,7562],[5174,7561],[5175,7561],[5175,7561],[5175,7561],[5175,7561],[5175,7561],[5196,7561],[5204,7555],[5204,7554]]]]}},{"type":"Feature","id":"LK","properties":{"hc-group":"admin0","hc-middle-x":0.62,"hc-middle-y":0.91,"hc-key":"lk","hc-a2":"LK","name":"Sri Lanka","labelrank":"3","country-abbrev":"Sri L.","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"LKA","iso-a2":"LK","woe-id":"23424778","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6576,6765],[6600,6755],[6632,6703],[6631,6674],[6596,6654],[6581,6660],[6572,6717],[6584,6759],[6576,6765]]]}},{"type":"Feature","id":"KM","properties":{"hc-group":"admin0","hc-middle-x":0.41,"hc-middle-y":0.51,"hc-key":"km","hc-a2":"KM","name":"Comoros","labelrank":"6","country-abbrev":"Com.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"COM","iso-a2":"KM","woe-id":"23424786","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5494,6125],[5487,6131],[5488,6142],[5492,6141],[5494,6125]]]}},{"type":"Feature","id":"FJ","properties":{"hc-group":"admin0","hc-middle-x":0.44,"hc-middle-y":0.33,"hc-key":"fj","hc-a2":"FJ","name":"Fiji","labelrank":"6","country-abbrev":"Fiji","subregion":"Melanesia","region-wb":"East Asia & Pacific","iso-a3":"FJI","iso-a2":"FJ","woe-id":"23424813","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[9460,5963],[9494,5962],[9495,5978],[9543,5996],[9494,5959],[9507,5951],[9500,5915],[9490,5934],[9467,5939],[9460,5963]]]}},{"type":"Feature","id":"RU","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.56,"hc-key":"ru","hc-a2":"RU","name":"Russia","labelrank":"2","country-abbrev":"Rus.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"RUS","iso-a2":"RU","woe-id":"23424936","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[8620,7917],[8587,7905],[8565,7884],[8519,7862],[8540,7887],[8614,7923],[8620,7917]]],[[[5691,8936],[5646,8924],[5637,8953],[5666,8965],[5693,8952],[5691,8936]]],[[[5965,9010],[5999,8987],[5972,8976],[5942,8995],[5965,9010]]],[[[6315,9176],[6331,9169],[6278,9157],[6280,9178],[6315,9176]]],[[[7568,9234],[7551,9218],[7512,9233],[7528,9245],[7568,9234]]],[[[5900,9603],[5857,9597],[5866,9613],[5939,9622],[5950,9582],[5900,9603]]],[[[5825,9623],[5819,9605],[5766,9602],[5774,9618],[5819,9609],[5825,9623]]],[[[5870,9665],[5945,9662],[5893,9635],[5861,9633],[5807,9645],[5870,9665]]],[[[6124,9673],[6147,9654],[6077,9637],[6060,9648],[6104,9658],[6124,9673]]],[[[5922,9709],[5937,9692],[5916,9668],[5861,9672],[5922,9709]]],[[[5391,7846],[5361,7874],[5289,7912],[5317,7918],[5327,7959],[5370,7979],[5338,7983],[5356,8011],[5384,8010],[5382,8045],[5395,8064],[5367,8087],[5315,8109],[5262,8106],[5245,8140],[5218,8142],[5225,8161],[5207,8185],[5147,8175],[5131,8212],[5175,8229],[5146,8243],[5121,8317],[5039,8340],[5024,8370],[5016,8399],[5021,8411],[5024,8419],[5030,8439],[5026,8462],[5030,8469],[5033,8474],[5037,8476],[5037,8476],[5035,8477],[5035,8477],[5035,8477],[5037,8476],[5040,8478],[5038,8482],[5035,8483],[5037,8497],[5090,8514],[5029,8531],[5071,8562],[5131,8620],[5141,8638],[5094,8678],[5111,8691],[5082,8737],[5091,8792],[5067,8828],[5095,8871],[5055,8897],[5048,8914],[5063,8940],[5093,8957],[5119,8981],[5155,8989],[5187,8976],[5154,8968],[5271,8947],[5422,8870],[5431,8846],[5404,8806],[5372,8793],[5330,8791],[5199,8822],[5161,8842],[5242,8773],[5227,8755],[5241,8731],[5264,8746],[5302,8746],[5378,8716],[5404,8728],[5386,8767],[5431,8789],[5468,8824],[5515,8780],[5524,8820],[5504,8845],[5517,8900],[5490,8918],[5567,8909],[5591,8879],[5550,8873],[5538,8852],[5564,8831],[5620,8836],[5629,8869],[5652,8873],[5723,8912],[5790,8934],[5806,8904],[5827,8896],[5866,8921],[5905,8916],[5951,8938],[5975,8904],[6011,8945],[5989,8968],[6007,8983],[6107,8967],[6153,8943],[6199,8929],[6230,8904],[6255,8935],[6236,8937],[6223,8964],[6186,8969],[6202,9029],[6176,9027],[6190,9061],[6236,9090],[6251,9138],[6269,9149],[6328,9151],[6366,9139],[6367,9115],[6336,9074],[6361,9051],[6354,9006],[6358,8935],[6389,8913],[6375,8873],[6358,8867],[6328,8819],[6292,8803],[6343,8798],[6385,8827],[6422,8871],[6414,8922],[6471,8938],[6499,8913],[6493,8875],[6522,8899],[6509,8932],[6445,8952],[6393,8949],[6386,8977],[6409,9019],[6371,9068],[6386,9090],[6428,9105],[6421,9150],[6448,9187],[6481,9183],[6445,9141],[6451,9113],[6436,9067],[6512,9052],[6527,9059],[6469,9075],[6459,9094],[6487,9102],[6506,9090],[6515,9116],[6553,9161],[6560,9121],[6630,9083],[6675,9084],[6646,9060],[6663,9044],[6673,9007],[6690,9016],[6671,9058],[6685,9079],[6643,9115],[6599,9130],[6588,9167],[6594,9189],[6788,9206],[6780,9224],[6737,9257],[6785,9249],[6777,9269],[6809,9274],[6873,9307],[6980,9323],[6962,9336],[7011,9336],[7047,9351],[7033,9373],[7059,9393],[7066,9353],[7049,9341],[7067,9325],[7108,9332],[7138,9364],[7197,9366],[7207,9400],[7268,9436],[7313,9439],[7346,9430],[7326,9407],[7393,9388],[7362,9364],[7404,9365],[7407,9378],[7502,9378],[7543,9370],[7546,9346],[7568,9345],[7578,9308],[7544,9323],[7575,9289],[7467,9233],[7411,9192],[7384,9191],[7360,9167],[7401,9165],[7495,9195],[7457,9196],[7469,9214],[7539,9196],[7561,9206],[7571,9185],[7629,9196],[7719,9189],[7716,9172],[7772,9155],[7853,9150],[7870,9168],[7862,9188],[7901,9208],[7905,9196],[7955,9179],[7974,9187],[8045,9157],[8030,9104],[7998,9123],[8055,9053],[8088,9032],[8108,9038],[8137,9093],[8170,9068],[8195,9065],[8239,9079],[8270,9074],[8322,9080],[8360,9070],[8335,9109],[8345,9127],[8405,9143],[8519,9131],[8564,9117],[8534,9111],[8541,9090],[8572,9118],[8644,9108],[8657,9095],[8626,9083],[8700,9063],[8721,9038],[8764,9037],[8832,9050],[8908,9043],[8943,9027],[8955,9004],[8943,8985],[8984,8961],[9072,8979],[9096,8968],[9158,8964],[9197,8992],[9232,8984],[9225,8968],[9192,8975],[9201,8950],[9238,8927],[9278,8941],[9267,8997],[9413,8983],[9467,8971],[9580,8925],[9584,8914],[9685,8870],[9711,8813],[9723,8834],[9791,8834],[9851,8793],[9826,8768],[9778,8763],[9764,8722],[9776,8709],[9742,8703],[9702,8728],[9668,8738],[9667,8757],[9635,8767],[9589,8762],[9555,8796],[9567,8768],[9556,8744],[9493,8721],[9439,8731],[9486,8700],[9495,8707],[9534,8629],[9519,8610],[9488,8621],[9448,8619],[9352,8576],[9308,8545],[9266,8526],[9261,8505],[9227,8532],[9158,8520],[9133,8499],[9142,8528],[9095,8497],[9060,8508],[9046,8484],[9064,8458],[9090,8456],[9056,8438],[9043,8461],[9011,8423],[9051,8406],[9035,8366],[9052,8342],[9016,8339],[9005,8318],[9016,8287],[8954,8259],[8941,8221],[8912,8207],[8886,8153],[8827,8100],[8811,8101],[8856,8131],[8837,8208],[8820,8304],[8835,8366],[8877,8410],[8923,8437],[8948,8468],[9008,8515],[9010,8525],[9072,8567],[9075,8609],[9107,8615],[9089,8628],[9049,8621],[9040,8587],[8957,8532],[8946,8548],[8962,8594],[8877,8587],[8802,8523],[8776,8485],[8810,8470],[8755,8473],[8696,8456],[8678,8483],[8643,8496],[8619,8473],[8474,8481],[8435,8472],[8385,8435],[8373,8412],[8319,8375],[8287,8339],[8217,8288],[8256,8276],[8261,8291],[8303,8293],[8279,8254],[8297,8235],[8321,8264],[8353,8263],[8401,8217],[8372,8113],[8375,8076],[8364,8034],[8337,8008],[8302,7950],[8237,7883],[8214,7850],[8156,7821],[8116,7844],[8083,7807],[8081,7811],[8078,7815],[8091,7827],[8099,7870],[8090,7899],[8121,7913],[8132,7887],[8146,7907],[8178,7951],[8185,7988],[8204,8005],[8192,8031],[8135,8005],[8093,8004],[8086,8027],[8043,8071],[8005,8075],[7935,8210],[7862,8234],[7790,8222],[7766,8201],[7788,8176],[7768,8158],[7740,8107],[7742,8093],[7699,8074],[7667,8086],[7628,8089],[7596,8104],[7559,8077],[7490,8060],[7425,8067],[7407,8090],[7330,8111],[7280,8098],[7239,8117],[7237,8144],[7139,8176],[7106,8132],[7121,8113],[7093,8083],[7011,8094],[7001,8115],[6945,8127],[6810,8061],[6801,8059],[6795,8058],[6774,8077],[6734,8077],[6680,8131],[6621,8121],[6598,8144],[6577,8124],[6515,8222],[6475,8250],[6479,8269],[6407,8235],[6385,8249],[6316,8256],[6306,8305],[6230,8300],[6227,8291],[6139,8266],[6014,8247],[6020,8222],[6045,8216],[6005,8198],[6015,8184],[5989,8167],[6028,8148],[6025,8123],[5983,8125],[5978,8114],[5943,8133],[5881,8134],[5856,8113],[5821,8126],[5787,8152],[5705,8157],[5648,8115],[5641,8085],[5615,8110],[5596,8086],[5600,8062],[5583,8032],[5602,8009],[5630,8008],[5665,7954],[5617,7931],[5591,7892],[5617,7860],[5612,7833],[5646,7791],[5621,7768],[5582,7793],[5534,7823],[5508,7816],[5475,7838],[5391,7846]]],[[[9599,9071],[9621,9058],[9607,9047],[9546,9044],[9510,9034],[9513,9057],[9553,9077],[9599,9071]]],[[[8377,9210],[8419,9208],[8460,9187],[8453,9166],[8373,9183],[8377,9210]]],[[[6937,9577],[6908,9593],[6985,9585],[6953,9568],[6937,9577]]],[[[5596,9641],[5637,9647],[5572,9620],[5542,9634],[5596,9641]]],[[[5995,9655],[6034,9667],[6052,9644],[6016,9618],[5975,9619],[5961,9635],[5995,9655]]],[[[4790,8269],[4810,8280],[4786,8270],[4786,8270],[4795,8288],[4825,8304],[4827,8304],[4814,8290],[4835,8303],[4881,8288],[4880,8266],[4878,8266],[4790,8269]]],[[[7022,9596],[7001,9593],[6984,9590],[6920,9610],[6957,9625],[6965,9659],[7046,9679],[7111,9638],[7088,9634],[7088,9606],[7033,9597],[7100,9602],[7123,9582],[7148,9593],[7170,9569],[7154,9511],[7105,9510],[7077,9522],[7024,9525],[6986,9559],[7022,9596]]],[[[8455,8069],[8434,8017],[8459,7961],[8432,7965],[8421,7938],[8413,7964],[8424,8015],[8417,8049],[8426,8138],[8409,8161],[8411,8226],[8442,8239],[8434,8264],[8456,8217],[8461,8152],[8486,8064],[8455,8069]]],[[[5879,9169],[5847,9116],[5869,9059],[5914,9030],[5900,9017],[5849,9031],[5841,9020],[5786,9037],[5794,9055],[5774,9065],[5778,9046],[5733,9076],[5731,9096],[5759,9104],[5780,9161],[5834,9180],[5879,9169]]],[[[8571,9292],[8608,9297],[8629,9288],[8681,9280],[8673,9266],[8601,9260],[8539,9286],[8548,9307],[8571,9292]]],[[[8399,9343],[8434,9324],[8476,9322],[8518,9303],[8477,9274],[8433,9294],[8437,9278],[8468,9268],[8429,9262],[8413,9272],[8329,9252],[8296,9263],[8266,9294],[8241,9299],[8224,9294],[8230,9324],[8269,9309],[8282,9329],[8326,9346],[8388,9309],[8399,9343]]],[[[6210,9395],[6246,9386],[6250,9367],[6197,9339],[6025,9292],[5959,9239],[5931,9247],[5933,9224],[5888,9170],[5837,9181],[5814,9174],[5796,9199],[5830,9212],[5852,9252],[5897,9296],[5931,9307],[5947,9326],[6017,9337],[6017,9349],[6055,9344],[6104,9352],[6210,9395]]],[[[7197,9509],[7203,9532],[7240,9552],[7265,9544],[7257,9526],[7285,9533],[7322,9512],[7352,9475],[7326,9488],[7282,9474],[7207,9470],[7173,9455],[7150,9460],[7197,9509]]],[[[5588,9611],[5677,9634],[5658,9643],[5699,9660],[5738,9636],[5680,9624],[5695,9590],[5674,9601],[5588,9611]]]]}},{"type":"Feature","id":"VA","properties":{"hc-group":"admin0","hc-middle-x":0.61,"hc-middle-y":0.44,"hc-key":"va","hc-a2":"VA","name":"Vatican","labelrank":"6","country-abbrev":"Vat.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"VAT","iso-a2":"VA","woe-id":"23424986","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4574,7793],[4574,7793],[4574,7793],[4574,7793],[4574,7793]]]}},{"type":"Feature","id":"SM","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.42,"hc-key":"sm","hc-a2":"SM","name":"San Marino","labelrank":"6","country-abbrev":"S.M.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"SMR","iso-a2":"SM","woe-id":"23424947","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4574,7865],[4572,7866],[4573,7867],[4574,7868],[4574,7865]]]}},{"type":"Feature","id":"KZ","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.46,"hc-key":"kz","hc-a2":"KZ","name":"Kazakhstan","labelrank":"3","country-abbrev":"Kaz.","subregion":"Central Asia","region-wb":"Europe & Central Asia","iso-a3":"KAZ","iso-a2":"KZ","woe-id":"-90","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5991,7941],[5960,7930],[5968,7910],[5947,7922],[5952,7928],[5943,7925],[5865,7905],[5865,7773],[5851,7770],[5812,7808],[5792,7800],[5792,7800],[5792,7800],[5792,7800],[5780,7795],[5780,7795],[5780,7795],[5780,7795],[5760,7788],[5768,7823],[5745,7826],[5697,7892],[5729,7917],[5763,7920],[5779,7942],[5779,7975],[5750,7972],[5724,7983],[5665,7954],[5630,8008],[5602,8009],[5583,8032],[5600,8062],[5596,8086],[5615,8110],[5641,8085],[5648,8115],[5705,8157],[5787,8152],[5821,8126],[5856,8113],[5881,8134],[5943,8133],[5978,8114],[5983,8125],[6025,8123],[6028,8148],[5989,8167],[6015,8184],[6005,8198],[6045,8216],[6020,8222],[6014,8247],[6139,8266],[6227,8291],[6230,8300],[6306,8305],[6316,8256],[6385,8249],[6407,8235],[6479,8269],[6475,8250],[6515,8222],[6577,8124],[6598,8144],[6621,8121],[6680,8131],[6734,8077],[6774,8077],[6795,8058],[6750,8032],[6741,7981],[6719,7972],[6668,7986],[6646,7924],[6581,7906],[6602,7838],[6584,7803],[6531,7828],[6435,7827],[6405,7842],[6385,7812],[6336,7826],[6309,7805],[6253,7774],[6240,7747],[6220,7768],[6183,7768],[6178,7796],[6163,7797],[6157,7828],[6131,7858],[6045,7850],[6015,7882],[5986,7899],[5977,7930],[5996,7939],[5991,7941]],[[5995,7942],[5997,7942],[5997,7940],[6021,7950],[5995,7942]]],[[[5693,7900],[5687,7903],[5689,7907],[5698,7908],[5693,7900]]]]}},{"type":"Feature","id":"AZ","properties":{"hc-group":"admin0","hc-middle-x":0.83,"hc-middle-y":0.51,"hc-key":"az","hc-a2":"AZ","name":"Azerbaijan","labelrank":"5","country-abbrev":"Aze.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"AZE","iso-a2":"AZ","woe-id":"23424741","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5540,7763],[5539,7762],[5538,7764],[5540,7764],[5540,7763]]],[[[5546,7760],[5545,7760],[5545,7761],[5545,7761],[5546,7760]]],[[[5554,7747],[5554,7749],[5556,7749],[5555,7747],[5554,7747]]],[[[5534,7714],[5533,7716],[5563,7710],[5573,7687],[5552,7692],[5534,7714]]],[[[5582,7793],[5621,7768],[5646,7791],[5676,7748],[5654,7672],[5629,7685],[5627,7716],[5584,7687],[5558,7727],[5568,7734],[5539,7771],[5584,7763],[5582,7793]]]]}},{"type":"Feature","id":"TJ","properties":{"hc-group":"admin0","hc-middle-x":0.28,"hc-middle-y":0.56,"hc-key":"tj","hc-a2":"TJ","name":"Tajikistan","labelrank":"4","country-abbrev":"Tjk.","subregion":"Central Asia","region-wb":"Europe & Central Asia","iso-a3":"TJK","iso-a2":"TJ","woe-id":"23424961","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[6300,7759],[6300,7759],[6298,7762],[6299,7761],[6300,7759]]],[[[6300,7721],[6302,7720],[6299,7718],[6296,7722],[6300,7721]]],[[[6389,7707],[6395,7677],[6423,7675],[6426,7631],[6379,7639],[6329,7613],[6329,7653],[6299,7669],[6285,7641],[6259,7626],[6215,7629],[6232,7665],[6225,7691],[6203,7699],[6235,7710],[6264,7754],[6295,7762],[6310,7734],[6280,7734],[6261,7709],[6325,7713],[6348,7698],[6389,7707]]]]}},{"type":"Feature","id":"LS","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.45,"hc-key":"ls","hc-a2":"LS","name":"Lesotho","labelrank":"6","country-abbrev":"Les.","subregion":"Southern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"LSO","iso-a2":"LS","woe-id":"23424880","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5040,5608],[5054,5613],[5078,5588],[5037,5545],[5006,5579],[5040,5608]]]}},{"type":"Feature","id":"UZ","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.53,"hc-key":"uz","hc-a2":"UZ","name":"Uzbekistan","labelrank":"3","country-abbrev":"Uzb.","subregion":"Central Asia","region-wb":"Europe & Central Asia","iso-a3":"UZB","iso-a2":"UZ","woe-id":"23424980","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[6333,7723],[6332,7723],[6331,7724],[6334,7726],[6333,7723]]],[[[6316,7728],[6317,7722],[6312,7722],[6310,7729],[6316,7728]]],[[[5968,7910],[5961,7895],[5982,7876],[5986,7899],[6015,7882],[6045,7850],[6131,7858],[6157,7828],[6163,7797],[6178,7796],[6183,7768],[6220,7768],[6240,7747],[6253,7774],[6309,7805],[6286,7782],[6323,7766],[6333,7777],[6374,7754],[6331,7731],[6310,7734],[6295,7762],[6264,7754],[6235,7710],[6203,7699],[6225,7691],[6232,7665],[6215,7629],[6200,7629],[6178,7635],[6179,7658],[6151,7665],[6057,7726],[6043,7761],[5987,7775],[5981,7807],[5943,7825],[5915,7802],[5908,7809],[5898,7794],[5896,7770],[5865,7773],[5865,7905],[5943,7925],[5934,7884],[5947,7922],[5968,7910]],[[6300,7759],[6299,7761],[6298,7762],[6300,7759],[6300,7759]]]]}},{"type":"Feature","id":"MA","properties":{"hc-group":"admin0","hc-middle-x":0.60,"hc-middle-y":0.21,"hc-key":"ma","hc-a2":"MA","name":"Morocco","labelrank":"3","country-abbrev":"Mor.","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"MAR","iso-a2":"MA","woe-id":"23424893","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4117,7564],[4118,7565],[4119,7560],[4138,7558],[4151,7547],[4154,7497],[4173,7473],[4167,7459],[4129,7460],[4095,7444],[4096,7414],[4033,7378],[3977,7371],[3946,7348],[3946,7316],[3943,7298],[3915,7290],[3866,7291],[3847,7264],[3835,7226],[3788,7182],[3782,7148],[3764,7121],[3699,7120],[3740,7201],[3762,7222],[3774,7267],[3800,7285],[3820,7324],[3863,7337],[3890,7358],[3919,7404],[3912,7436],[3929,7475],[3951,7498],[4002,7523],[4028,7582],[4044,7586],[4044,7585],[4045,7584],[4074,7560],[4116,7566],[4117,7566],[4117,7564]]]}},{"type":"Feature","id":"CO","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.54,"hc-key":"co","hc-a2":"CO","name":"Colombia","labelrank":"2","country-abbrev":"Col.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"COL","iso-a2":"CO","woe-id":"23424787","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[1865,6521],[1868,6543],[1894,6559],[1916,6592],[1909,6611],[1909,6673],[1892,6692],[1914,6713],[1908,6735],[1920,6731],[1960,6758],[1963,6791],[2005,6815],[2029,6813],[2082,6847],[2087,6830],[2068,6824],[2040,6787],[2037,6753],[2056,6726],[2064,6688],[2123,6685],[2143,6659],[2201,6662],[2190,6612],[2207,6580],[2191,6564],[2210,6549],[2219,6515],[2206,6540],[2181,6529],[2131,6529],[2125,6474],[2143,6437],[2128,6354],[2105,6367],[2125,6399],[2096,6414],[2056,6406],[2032,6413],[2019,6442],[1970,6476],[1940,6492],[1905,6498],[1865,6521]]]}},{"type":"Feature","id":"TL","properties":{"hc-group":"admin0","hc-middle-x":0.65,"hc-middle-y":0.36,"hc-key":"tl","hc-a2":"TL","name":"East Timor","labelrank":"5","country-abbrev":"T.L.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"TLS","iso-a2":"TL","woe-id":"23424968","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7885,6203],[7890,6206],[7897,6207],[7891,6198],[7885,6203]]],[[[7911,6214],[7918,6224],[7972,6233],[7957,6214],[7915,6198],[7912,6206],[7911,6214]]]]}},{"type":"Feature","id":"TZ","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"tz","hc-a2":"TZ","name":"United Republic of Tanzania","labelrank":"3","country-abbrev":"Tanz.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"TZA","iso-a2":"TZ","woe-id":"23424973","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5242,6136],[5241,6138],[5240,6141],[5240,6141],[5236,6143],[5235,6145],[5235,6145],[5234,6146],[5227,6185],[5222,6192],[5219,6195],[5219,6195],[5216,6197],[5215,6197],[5215,6198],[5211,6196],[5210,6191],[5195,6195],[5181,6201],[5153,6211],[5129,6225],[5093,6304],[5084,6347],[5118,6383],[5111,6408],[5119,6432],[5108,6447],[5119,6449],[5147,6449],[5147,6448],[5148,6449],[5149,6449],[5151,6407],[5189,6405],[5215,6448],[5321,6389],[5325,6371],[5367,6341],[5387,6324],[5371,6310],[5378,6289],[5372,6221],[5404,6169],[5316,6132],[5242,6136]]]}},{"type":"Feature","id":"AR","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.27,"hc-key":"ar","hc-a2":"AR","name":"Argentina","labelrank":"2","country-abbrev":"Arg.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"ARG","iso-a2":"AR","woe-id":"23424747","continent":"South America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2167,4673],[2169,4670],[2167,4670],[2167,4673]]],[[[2584,5708],[2604,5706],[2606,5658],[2549,5623],[2494,5561],[2477,5505],[2477,5487],[2466,5426],[2509,5387],[2501,5373],[2522,5338],[2495,5295],[2451,5277],[2398,5267],[2362,5269],[2354,5201],[2310,5191],[2278,5207],[2273,5163],[2287,5146],[2312,5158],[2316,5134],[2292,5143],[2292,5126],[2265,5101],[2257,5052],[2239,5053],[2206,5030],[2197,5010],[2222,4978],[2246,4976],[2246,4939],[2199,4902],[2189,4865],[2160,4852],[2151,4826],[2173,4772],[2128,4786],[2070,4787],[2054,4804],[2058,4839],[2032,4835],[2020,4882],[2059,4928],[2051,4944],[2070,4970],[2088,5042],[2066,5062],[2077,5092],[2063,5125],[2075,5158],[2069,5206],[2085,5269],[2101,5277],[2091,5311],[2096,5352],[2115,5366],[2115,5397],[2133,5456],[2109,5516],[2137,5618],[2162,5659],[2177,5666],[2169,5733],[2206,5757],[2210,5794],[2238,5826],[2287,5813],[2295,5792],[2307,5819],[2345,5812],[2394,5763],[2422,5757],[2496,5712],[2465,5653],[2549,5649],[2578,5674],[2584,5708]]],[[[2167,4674],[2167,4761],[2173,4734],[2207,4704],[2250,4679],[2287,4669],[2229,4663],[2209,4666],[2202,4668],[2167,4674]]]]}},{"type":"Feature","id":"SA","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.53,"hc-key":"sa","hc-a2":"SA","name":"Saudi Arabia","labelrank":"2","country-abbrev":"Saud.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"SAU","iso-a2":"SA","woe-id":"23424938","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5641,7344],[5655,7313],[5692,7284],[5692,7255],[5712,7224],[5717,7218],[5724,7220],[5726,7210],[5734,7208],[5764,7167],[5842,7160],[5855,7137],[5836,7076],[5747,7045],[5662,7034],[5633,7020],[5611,6987],[5544,6998],[5485,6995],[5474,6966],[5427,7036],[5419,7061],[5381,7090],[5364,7117],[5364,7155],[5345,7193],[5318,7209],[5309,7237],[5249,7328],[5230,7330],[5241,7370],[5274,7365],[5331,7407],[5301,7439],[5366,7460],[5404,7453],[5453,7426],[5530,7365],[5585,7362],[5612,7358],[5641,7344]]]}},{"type":"Feature","id":"PK","properties":{"hc-group":"admin0","hc-middle-x":0.34,"hc-middle-y":0.64,"hc-key":"pk","hc-a2":"PK","name":"Pakistan","labelrank":"2","country-abbrev":"Pak.","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"PAK","iso-a2":"PK","woe-id":"23424922","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6416,7624],[6459,7605],[6482,7577],[6490,7559],[6453,7539],[6410,7548],[6393,7534],[6400,7495],[6438,7461],[6415,7446],[6416,7427],[6381,7388],[6368,7360],[6337,7325],[6295,7328],[6265,7289],[6313,7222],[6280,7205],[6247,7208],[6227,7195],[6203,7202],[6173,7246],[6088,7238],[6032,7238],[6039,7270],[6076,7283],[6067,7334],[6041,7344],[6010,7386],[6058,7372],[6106,7371],[6168,7385],[6173,7421],[6226,7450],[6261,7454],[6268,7491],[6290,7499],[6281,7523],[6313,7524],[6330,7562],[6316,7590],[6357,7617],[6416,7624]]]}},{"type":"Feature","id":"YE","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.75,"hc-key":"ye","hc-a2":"YE","name":"Yemen","labelrank":"3","country-abbrev":"Yem.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"YEM","iso-a2":"YE","woe-id":"23425002","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5747,7045],[5769,6994],[5780,6974],[5754,6943],[5675,6916],[5649,6895],[5629,6896],[5590,6877],[5564,6875],[5508,6852],[5494,6859],[5472,6941],[5474,6966],[5485,6995],[5544,6998],[5611,6987],[5633,7020],[5662,7034],[5747,7045]]]}},{"type":"Feature","id":"AE","properties":{"hc-group":"admin0","hc-middle-x":0.59,"hc-middle-y":0.65,"hc-key":"ae","hc-a2":"AE","name":"United Arab Emirates","labelrank":"4","country-abbrev":"U.A.E.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"ARE","iso-a2":"AE","woe-id":"23424738","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5874,7251],[5877,7248],[5877,7231],[5860,7228],[5842,7160],[5764,7167],[5734,7208],[5810,7205],[5868,7265],[5870,7253],[5874,7251]],[[5874,7239],[5876,7241],[5873,7241],[5873,7238],[5874,7239]]]}},{"type":"Feature","id":"KE","properties":{"hc-group":"admin0","hc-middle-x":0.87,"hc-middle-y":0.70,"hc-key":"ke","hc-a2":"KE","name":"Kenya","labelrank":"2","country-abbrev":"Ken.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"KEN","iso-a2":"KE","woe-id":"23424863","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5367,6341],[5325,6371],[5321,6389],[5215,6448],[5220,6471],[5213,6486],[5242,6527],[5240,6552],[5212,6603],[5255,6627],[5270,6615],[5297,6609],[5335,6585],[5377,6579],[5414,6605],[5447,6596],[5420,6562],[5420,6453],[5437,6429],[5396,6397],[5367,6341]]]}},{"type":"Feature","id":"PE","properties":{"hc-group":"admin0","hc-middle-x":0.69,"hc-middle-y":0.71,"hc-key":"pe","hc-a2":"PE","name":"Peru","labelrank":"2","country-abbrev":"Peru","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"PER","iso-a2":"PE","woe-id":"23424919","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[1970,6476],[2019,6442],[2032,6413],[2056,6406],[2096,6414],[2125,6399],[2105,6367],[2128,6354],[2103,6356],[2040,6327],[2034,6290],[2007,6256],[2061,6183],[2091,6185],[2111,6200],[2108,6153],[2139,6155],[2166,6108],[2153,6073],[2160,6058],[2145,6017],[2126,6008],[2153,5996],[2155,5997],[2157,5996],[2153,5988],[2155,5986],[2137,5964],[2141,5957],[2128,5935],[2115,5932],[2082,5964],[1973,6022],[1940,6061],[1942,6083],[1900,6144],[1860,6236],[1831,6278],[1797,6299],[1793,6354],[1820,6379],[1815,6358],[1858,6331],[1879,6379],[1928,6403],[1961,6433],[1970,6476]]]}},{"type":"Feature","id":"DO","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.38,"hc-key":"do","hc-a2":"DO","name":"Dominican Republic","labelrank":"5","country-abbrev":"Dom. Rep.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"DOM","iso-a2":"DO","woe-id":"23424800","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[2070,7030],[2070,7030],[2069,7031],[2069,7031],[2067,7033],[2076,7038],[2075,7067],[2097,7074],[2128,7066],[2138,7048],[2175,7035],[2159,7028],[2106,7028],[2085,7003],[2074,7016],[2076,7025],[2070,7030]]]}},{"type":"Feature","id":"HT","properties":{"hc-group":"admin0","hc-middle-x":0.82,"hc-middle-y":0.96,"hc-key":"ht","hc-a2":"HT","name":"Haiti","labelrank":"5","country-abbrev":"Haiti","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"HTI","iso-a2":"HT","woe-id":"23424839","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2070,7030],[2069,7031],[2069,7031],[2069,7031],[2070,7030]]],[[[2075,7067],[2076,7038],[2067,7033],[2068,7030],[2070,7030],[2076,7025],[2074,7016],[2028,7023],[2011,7016],[2000,7036],[2046,7028],[2046,7059],[2025,7070],[2075,7067]]]]}},{"type":"Feature","id":"PG","properties":{"hc-group":"admin0","hc-middle-x":0.14,"hc-middle-y":0.50,"hc-key":"pg","hc-a2":"PG","name":"Papua New Guinea","labelrank":"2","country-abbrev":"P.N.G.","subregion":"Melanesia","region-wb":"East Asia & Pacific","iso-a3":"PNG","iso-a2":"PG","woe-id":"23424926","continent":"Oceania"},"geometry":{"type":"MultiPolygon","coordinates":[[[[8388,6210],[8388,6275],[8388,6402],[8478,6367],[8493,6366],[8531,6335],[8530,6317],[8580,6303],[8592,6281],[8565,6279],[8572,6258],[8600,6241],[8632,6198],[8684,6195],[8676,6166],[8595,6178],[8568,6199],[8539,6240],[8470,6255],[8460,6214],[8437,6203],[8388,6210]]],[[[8654,6406],[8646,6432],[8662,6408],[8716,6383],[8749,6353],[8741,6336],[8723,6373],[8654,6406]]],[[[8645,6292],[8598,6309],[8685,6319],[8703,6332],[8701,6355],[8727,6351],[8719,6320],[8669,6294],[8645,6292]]]]}},{"type":"Feature","id":"AO","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.67,"hc-key":"ao","hc-a2":"AO","name":"Angola","labelrank":"3","country-abbrev":"Ang.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"AGO","iso-a2":"AO","woe-id":"23424745","continent":"Africa"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4566,6309],[4567,6317],[4560,6331],[4583,6349],[4592,6342],[4573,6330],[4566,6309]]],[[[4898,5953],[4821,5941],[4761,5950],[4752,5961],[4618,5960],[4595,5974],[4553,5965],[4553,6009],[4575,6081],[4609,6116],[4613,6163],[4590,6210],[4601,6232],[4568,6298],[4595,6306],[4697,6304],[4708,6263],[4726,6239],[4778,6242],[4783,6272],[4850,6264],[4851,6201],[4862,6185],[4864,6146],[4915,6157],[4916,6093],[4856,6093],[4856,5998],[4898,5953]]]]}},{"type":"Feature","id":"KH","properties":{"hc-group":"admin0","hc-middle-x":0.84,"hc-middle-y":0.49,"hc-key":"kh","hc-a2":"KH","name":"Cambodia","labelrank":"3","country-abbrev":"Camb.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"KHM","iso-a2":"KH","woe-id":"23424776","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7395,6915],[7395,6844],[7342,6805],[7304,6787],[7279,6789],[7258,6824],[7241,6881],[7280,6907],[7325,6904],[7374,6904],[7395,6915]]]}},{"type":"Feature","id":"VN","properties":{"hc-group":"admin0","hc-middle-x":0.59,"hc-middle-y":0.89,"hc-key":"vn","hc-a2":"VN","name":"Vietnam","labelrank":"2","country-abbrev":"Viet.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"VNM","iso-a2":"VN","woe-id":"23424984","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7304,6787],[7342,6805],[7395,6844],[7395,6915],[7399,6932],[7365,6984],[7311,7039],[7286,7055],[7319,7079],[7292,7106],[7264,7103],[7260,7125],[7234,7150],[7245,7162],[7289,7154],[7329,7180],[7372,7161],[7366,7149],[7409,7122],[7377,7105],[7350,7076],[7338,7046],[7368,6999],[7432,6936],[7452,6861],[7439,6815],[7387,6786],[7371,6790],[7364,6761],[7313,6739],[7314,6781],[7304,6787]]]}},{"type":"Feature","id":"MZ","properties":{"hc-group":"admin0","hc-middle-x":0.83,"hc-middle-y":0.28,"hc-key":"mz","hc-a2":"MZ","name":"Mozambique","labelrank":"3","country-abbrev":"Moz.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MOZ","iso-a2":"MZ","woe-id":"23424902","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5238,6078],[5234,6118],[5242,6136],[5316,6132],[5404,6169],[5416,6039],[5388,5991],[5305,5946],[5239,5885],[5233,5868],[5258,5816],[5246,5739],[5205,5723],[5169,5696],[5180,5668],[5164,5667],[5157,5668],[5155,5685],[5152,5696],[5153,5744],[5133,5807],[5166,5841],[5184,5880],[5176,5898],[5185,5932],[5182,5982],[5106,6014],[5101,6034],[5189,6063],[5202,6045],[5223,6052],[5220,6006],[5247,5987],[5266,6002],[5268,6044],[5238,6078]]]}},{"type":"Feature","id":"CR","properties":{"hc-group":"admin0","hc-middle-x":0.55,"hc-middle-y":0.31,"hc-key":"cr","hc-a2":"CR","name":"Costa Rica","labelrank":"5","country-abbrev":"C.R.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"CRI","iso-a2":"CR","woe-id":"23424791","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[1722,6802],[1727,6789],[1754,6762],[1740,6726],[1740,6726],[1736,6734],[1656,6785],[1661,6807],[1701,6804],[1722,6802]]],[[[1744,6716],[1739,6725],[1740,6725],[1740,6725],[1744,6716]]]]}},{"type":"Feature","id":"BJ","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.49,"hc-key":"bj","hc-a2":"BJ","name":"Benin","labelrank":"5","country-abbrev":"Benin","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"BEN","iso-a2":"BJ","woe-id":"23424764","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4311,6825],[4318,6792],[4286,6746],[4284,6667],[4260,6664],[4252,6662],[4252,6746],[4231,6804],[4247,6818],[4275,6831],[4288,6846],[4311,6825]]]}},{"type":"Feature","id":"NG","properties":{"hc-group":"admin0","hc-middle-x":0.36,"hc-middle-y":0.33,"hc-key":"ng","hc-a2":"NG","name":"Nigeria","labelrank":"2","country-abbrev":"Nigeria","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"NGA","iso-a2":"NG","woe-id":"23424908","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4284,6667],[4286,6746],[4318,6792],[4311,6825],[4326,6878],[4368,6891],[4410,6864],[4436,6874],[4490,6859],[4504,6872],[4543,6875],[4574,6866],[4608,6885],[4621,6866],[4639,6839],[4567,6725],[4540,6669],[4518,6689],[4466,6651],[4459,6621],[4388,6605],[4370,6615],[4335,6666],[4284,6667]]]}},{"type":"Feature","id":"IR","properties":{"hc-group":"admin0","hc-middle-x":0.58,"hc-middle-y":0.51,"hc-key":"ir","hc-a2":"IR","name":"Iran","labelrank":"2","country-abbrev":"Iran","subregion":"Southern Asia","region-wb":"Middle East & North Africa","iso-a3":"IRN","iso-a2":"IR","woe-id":"23424851","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5532,7628],[5516,7656],[5510,7704],[5534,7714],[5552,7692],[5573,7687],[5580,7689],[5584,7687],[5627,7716],[5629,7685],[5654,7672],[5659,7648],[5694,7636],[5720,7614],[5744,7609],[5807,7617],[5804,7634],[5849,7660],[5902,7666],[5906,7656],[5949,7646],[5995,7610],[6020,7608],[6022,7576],[6001,7491],[6009,7439],[6035,7435],[6038,7418],[6010,7386],[6041,7344],[6067,7334],[6076,7283],[6039,7270],[6032,7238],[5982,7242],[5905,7256],[5896,7290],[5876,7301],[5830,7279],[5729,7324],[5690,7397],[5657,7404],[5644,7390],[5619,7423],[5623,7448],[5611,7469],[5577,7487],[5551,7521],[5579,7582],[5549,7589],[5532,7628]]]}},{"type":"Feature","id":"SV","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.55,"hc-key":"sv","hc-a2":"SV","name":"El Salvador","labelrank":"6","country-abbrev":"El. S.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"SLV","iso-a2":"SV","woe-id":"23424807","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1598,6876],[1569,6871],[1530,6886],[1530,6889],[1552,6907],[1601,6889],[1598,6876]]]}},{"type":"Feature","id":"SL","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.48,"hc-key":"sl","hc-a2":"SL","name":"Sierra Leone","labelrank":"4","country-abbrev":"S.L.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SLE","iso-a2":"SL","woe-id":"23424946","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3863,6683],[3820,6702],[3809,6746],[3833,6770],[3870,6774],[3899,6729],[3889,6708],[3863,6683]]]}},{"type":"Feature","id":"GW","properties":{"hc-group":"admin0","hc-middle-x":0.55,"hc-middle-y":0.49,"hc-key":"gw","hc-a2":"GW","name":"Guinea Bissau","labelrank":"6","country-abbrev":"GnB.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GNB","iso-a2":"GW","woe-id":"23424929","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3758,6803],[3732,6811],[3708,6844],[3753,6854],[3797,6854],[3797,6825],[3767,6819],[3758,6803]]]}},{"type":"Feature","id":"HR","properties":{"hc-group":"admin0","hc-middle-x":0.35,"hc-middle-y":0.59,"hc-key":"hr","hc-a2":"HR","name":"Croatia","labelrank":"6","country-abbrev":"Cro.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"HRV","iso-a2":"HR","woe-id":"23424843","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4753,7811],[4732,7826],[4728,7828],[4734,7826],[4751,7816],[4751,7814],[4753,7811]]],[[[4607,7923],[4659,7921],[4668,7949],[4694,7960],[4719,7940],[4765,7939],[4769,7910],[4768,7900],[4706,7915],[4672,7911],[4685,7876],[4726,7830],[4699,7837],[4645,7875],[4645,7908],[4619,7898],[4607,7923]]]]}},{"type":"Feature","id":"BZ","properties":{"hc-group":"admin0","hc-middle-x":0.53,"hc-middle-y":0.50,"hc-key":"bz","hc-a2":"BZ","name":"Belize","labelrank":"6","country-abbrev":"Belize","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"BLZ","iso-a2":"BZ","woe-id":"23424760","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1558,7009],[1567,7012],[1583,7030],[1586,6984],[1565,6951],[1556,6951],[1558,7009]]]}},{"type":"Feature","id":"ZA","properties":{"hc-group":"admin0","hc-middle-x":0.36,"hc-middle-y":0.70,"hc-key":"za","hc-a2":"ZA","name":"South Africa","labelrank":"2","country-abbrev":"S.Af.","subregion":"Southern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"ZAF","iso-a2":"ZA","woe-id":"23424942","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5157,5668],[5164,5667],[5180,5668],[5165,5613],[5129,5581],[5106,5539],[5061,5492],[5008,5451],[4942,5430],[4874,5436],[4854,5424],[4787,5410],[4753,5441],[4733,5474],[4746,5480],[4744,5511],[4717,5555],[4693,5613],[4711,5630],[4720,5608],[4771,5600],[4797,5617],[4797,5734],[4822,5690],[4818,5666],[4847,5667],[4878,5695],[4887,5716],[4941,5700],[4963,5706],[4972,5734],[5000,5749],[5006,5769],[5041,5799],[5075,5814],[5104,5809],[5133,5807],[5153,5744],[5152,5696],[5137,5702],[5118,5682],[5128,5656],[5157,5668]],[[5040,5608],[5006,5579],[5037,5545],[5078,5588],[5054,5613],[5040,5608]]]}},{"type":"Feature","id":"CF","properties":{"hc-group":"admin0","hc-middle-x":0.47,"hc-middle-y":0.46,"hc-key":"cf","hc-a2":"CF","name":"Central African Republic","labelrank":"4","country-abbrev":"C.A.R.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"CAF","iso-a2":"CF","woe-id":"23424792","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4882,6802],[4906,6770],[4901,6738],[4921,6735],[4956,6696],[4987,6675],[4988,6658],[5018,6628],[4963,6637],[4872,6602],[4815,6609],[4789,6630],[4754,6606],[4757,6581],[4722,6588],[4696,6581],[4685,6545],[4682,6562],[4654,6590],[4631,6657],[4663,6701],[4702,6702],[4756,6716],[4771,6745],[4810,6749],[4870,6804],[4882,6802]]]}},{"type":"Feature","id":"SD","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.38,"hc-key":"sd","hc-a2":"SD","name":"Sudan","labelrank":"3","country-abbrev":"Sudan","subregion":"Northern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SDN","iso-a2":"SD","woe-id":"-90","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4921,6735],[4901,6738],[4906,6770],[4882,6802],[4863,6856],[4859,6887],[4873,6898],[4889,6945],[4916,6946],[4916,7061],[4916,7076],[4945,7076],[4945,7138],[5131,7138],[5299,7138],[5310,7102],[5318,7037],[5350,7015],[5302,6987],[5285,6928],[5288,6902],[5276,6855],[5263,6854],[5238,6796],[5230,6801],[5215,6758],[5189,6800],[5190,6840],[5156,6834],[5166,6806],[5131,6768],[5095,6783],[5060,6754],[4992,6760],[4970,6787],[4948,6783],[4921,6735]]]}},{"type":"Feature","id":"CD","properties":{"hc-group":"admin0","hc-middle-x":0.58,"hc-middle-y":0.42,"hc-key":"cd","hc-a2":"CD","name":"Democratic Republic of the Congo","labelrank":"2","country-abbrev":"D.R.C.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"COD","iso-a2":"CD","woe-id":"23424780","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5071,6380],[5067,6329],[5079,6281],[5111,6236],[5061,6228],[5045,6210],[5050,6201],[5056,6189],[5046,6140],[5066,6112],[5088,6119],[5088,6081],[5070,6080],[5011,6136],[4996,6123],[4956,6134],[4955,6147],[4925,6142],[4915,6157],[4864,6146],[4862,6185],[4851,6201],[4850,6264],[4783,6272],[4778,6242],[4726,6239],[4708,6263],[4697,6304],[4595,6306],[4573,6300],[4566,6309],[4573,6330],[4592,6342],[4631,6353],[4644,6337],[4685,6381],[4686,6416],[4731,6463],[4740,6542],[4757,6581],[4754,6606],[4789,6630],[4815,6609],[4872,6602],[4963,6637],[5018,6628],[5046,6605],[5088,6613],[5119,6582],[5115,6551],[5132,6543],[5109,6523],[5108,6515],[5093,6503],[5085,6476],[5074,6464],[5084,6465],[5081,6452],[5082,6438],[5075,6434],[5071,6429],[5063,6421],[5061,6406],[5061,6400],[5065,6398],[5072,6389],[5071,6380]]]}},{"type":"Feature","id":"KW","properties":{"hc-group":"admin0","hc-middle-x":0.61,"hc-middle-y":0.40,"hc-key":"kw","hc-a2":"KW","name":"Kuwait","labelrank":"6","country-abbrev":"Kwt.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"KWT","iso-a2":"KW","woe-id":"23424870","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5641,7344],[5612,7358],[5585,7362],[5602,7390],[5627,7391],[5631,7370],[5641,7344]]]}},{"type":"Feature","id":"DE","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.34,"hc-key":"de","hc-a2":"DE","name":"Germany","labelrank":"2","country-abbrev":"Ger.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"DEU","iso-a2":"DE","woe-id":"23424829","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4477,8004],[4477,8003],[4477,8003],[4477,8004]]],[[[4461,8288],[4466,8289],[4484,8285],[4544,8248],[4575,8271],[4609,8275],[4620,8254],[4626,8249],[4625,8248],[4625,8247],[4621,8251],[4627,8239],[4623,8205],[4639,8194],[4644,8126],[4575,8108],[4571,8083],[4614,8045],[4582,8021],[4591,7997],[4565,8005],[4530,7993],[4492,7999],[4473,8009],[4477,8004],[4455,8001],[4429,8001],[4447,8053],[4392,8072],[4397,8085],[4386,8097],[4393,8105],[4382,8122],[4393,8164],[4412,8180],[4417,8221],[4422,8240],[4458,8233],[4471,8247],[4461,8288]]]]}},{"type":"Feature","id":"BE","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.40,"hc-key":"be","hc-a2":"BE","name":"Belgium","labelrank":"2","country-abbrev":"Belg.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"BEL","iso-a2":"BE","woe-id":"23424757","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4382,8122],[4393,8105],[4386,8097],[4374,8088],[4376,8075],[4327,8092],[4279,8135],[4297,8145],[4303,8146],[4317,8140],[4329,8146],[4331,8144],[4330,8146],[4353,8150],[4382,8122]]]}},{"type":"Feature","id":"IE","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.48,"hc-key":"ie","hc-a2":"IE","name":"Ireland","labelrank":"3","country-abbrev":"Ire.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"IRL","iso-a2":"IE","woe-id":"23424803","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[3989,8295],[3961,8270],[3987,8256],[4018,8256],[4026,8209],[4015,8179],[3979,8174],[3946,8154],[3913,8149],[3895,8167],[3939,8222],[3907,8226],[3912,8265],[3948,8262],[3958,8299],[3989,8295]]]}},{"type":"Feature","id":"KP","properties":{"hc-group":"admin0","hc-middle-x":0.32,"hc-middle-y":0.63,"hc-key":"kp","hc-a2":"KP","name":"North Korea","labelrank":"3","country-abbrev":"N.K.","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"PRK","iso-a2":"KP","woe-id":"23424865","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[8083,7807],[8051,7781],[8053,7755],[7988,7717],[7986,7697],[8013,7678],[7978,7667],[7963,7651],[7931,7658],[7924,7646],[7907,7675],[7927,7702],[7895,7730],[7943,7758],[7962,7785],[8007,7774],[8004,7796],[8053,7812],[8057,7831],[8078,7815],[8081,7811],[8083,7807]]]}},{"type":"Feature","id":"KR","properties":{"hc-group":"admin0","hc-middle-x":0.54,"hc-middle-y":0.50,"hc-key":"kr","hc-a2":"KR","name":"South Korea","labelrank":"2","country-abbrev":"S.K.","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"KOR","iso-a2":"KR","woe-id":"23424868","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7963,7651],[7978,7667],[8013,7678],[8042,7632],[8046,7573],[8021,7546],[8004,7553],[7987,7536],[7955,7542],[7963,7651]]]}},{"type":"Feature","id":"GY","properties":{"hc-group":"admin0","hc-middle-x":0.26,"hc-middle-y":0.07,"hc-key":"gy","hc-a2":"GY","name":"Guyana","labelrank":"4","country-abbrev":"Guy.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"GUY","iso-a2":"GY","woe-id":"23424836","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[2423,6732],[2450,6715],[2507,6658],[2505,6641],[2481,6602],[2528,6536],[2509,6538],[2459,6514],[2431,6534],[2423,6558],[2437,6595],[2424,6629],[2401,6632],[2382,6653],[2387,6672],[2415,6689],[2408,6709],[2423,6732]]]}},{"type":"Feature","id":"HN","properties":{"hc-group":"admin0","hc-middle-x":0.71,"hc-middle-y":0.09,"hc-key":"hn","hc-a2":"HN","name":"Honduras","labelrank":"5","country-abbrev":"Hond.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"HND","iso-a2":"HN","woe-id":"23424841","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1586,6946],[1654,6955],[1702,6949],[1737,6924],[1688,6919],[1660,6893],[1630,6887],[1613,6864],[1607,6873],[1598,6876],[1601,6889],[1552,6907],[1558,6926],[1586,6946]]]}},{"type":"Feature","id":"MM","properties":{"hc-group":"admin0","hc-middle-x":0.17,"hc-middle-y":0.49,"hc-key":"mm","hc-a2":"MM","name":"Myanmar","labelrank":"3","country-abbrev":"Myan.","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"MMR","iso-a2":"MM","woe-id":"23424763","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6942,7109],[6953,7116],[6951,7137],[6969,7150],[6973,7200],[6996,7195],[7023,7255],[7024,7278],[7074,7306],[7092,7333],[7098,7343],[7132,7313],[7133,7260],[7103,7234],[7101,7195],[7130,7203],[7138,7175],[7157,7171],[7146,7143],[7170,7139],[7177,7120],[7206,7124],[7193,7117],[7175,7086],[7128,7066],[7113,7070],[7095,7030],[7137,6959],[7119,6918],[7146,6886],[7161,6829],[7134,6785],[7129,6870],[7106,6921],[7102,6963],[7088,6985],[7036,6946],[7000,6955],[7012,7001],[6993,7058],[6965,7077],[6942,7109]]]}},{"type":"Feature","id":"GA","properties":{"hc-group":"admin0","hc-middle-x":0.36,"hc-middle-y":0.65,"hc-key":"ga","hc-a2":"GA","name":"Gabon","labelrank":"4","country-abbrev":"Gabon","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GAB","iso-a2":"GA","woe-id":"23424822","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4495,6508],[4540,6508],[4540,6543],[4541,6547],[4599,6542],[4597,6515],[4633,6506],[4614,6473],[4634,6461],[4622,6405],[4573,6423],[4547,6410],[4555,6369],[4534,6363],[4479,6425],[4462,6461],[4479,6467],[4480,6495],[4495,6508]]]}},{"type":"Feature","id":"GQ","properties":{"hc-group":"admin0","hc-middle-x":0.53,"hc-middle-y":0.55,"hc-key":"gq","hc-a2":"GQ","name":"Equatorial Guinea","labelrank":"4","country-abbrev":"Eq. G.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GNQ","iso-a2":"GQ","woe-id":"23424804","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4540,6543],[4540,6508],[4495,6508],[4481,6514],[4495,6548],[4500,6543],[4540,6543]]]}},{"type":"Feature","id":"NI","properties":{"hc-group":"admin0","hc-middle-x":0.84,"hc-middle-y":0.50,"hc-key":"ni","hc-a2":"NI","name":"Nicaragua","labelrank":"5","country-abbrev":"Nic.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"NIC","iso-a2":"NI","woe-id":"23424915","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1661,6807],[1603,6860],[1613,6864],[1630,6887],[1660,6893],[1688,6919],[1737,6924],[1715,6816],[1722,6802],[1701,6804],[1661,6807]]]}},{"type":"Feature","id":"LV","properties":{"hc-group":"admin0","hc-middle-x":0.05,"hc-middle-y":0.36,"hc-key":"lv","hc-a2":"LV","name":"Latvia","labelrank":"5","country-abbrev":"Lat.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"LVA","iso-a2":"LV","woe-id":"23424874","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[5016,8399],[5024,8370],[5039,8340],[5023,8325],[4993,8320],[4942,8353],[4929,8345],[4860,8352],[4829,8337],[4829,8370],[4849,8401],[4875,8408],[4907,8375],[4927,8386],[4925,8413],[4954,8422],[4990,8398],[5016,8399]]]}},{"type":"Feature","id":"UG","properties":{"hc-group":"admin0","hc-middle-x":0.16,"hc-middle-y":0.56,"hc-key":"ug","hc-a2":"UG","name":"Uganda","labelrank":"3","country-abbrev":"Uga.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"UGA","iso-a2":"UG","woe-id":"23424974","continent":"Africa"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5148,6449],[5148,6450],[5149,6449],[5148,6449]]],[[[5082,6438],[5081,6452],[5084,6465],[5091,6474],[5085,6476],[5093,6503],[5108,6515],[5136,6535],[5132,6543],[5115,6551],[5119,6582],[5198,6589],[5212,6603],[5240,6552],[5242,6527],[5213,6486],[5171,6483],[5147,6449],[5119,6449],[5108,6447],[5092,6435],[5082,6438]]]]}},{"type":"Feature","id":"MW","properties":{"hc-group":"admin0","hc-middle-x":0.16,"hc-middle-y":0.29,"hc-key":"mw","hc-a2":"MW","name":"Malawi","labelrank":"6","country-abbrev":"Mal.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MWI","iso-a2":"MW","woe-id":"23424889","continent":"Africa"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5240,6141],[5240,6141],[5240,6141],[5240,6141]]],[[[5235,6145],[5235,6146],[5234,6146],[5235,6145],[5235,6145]]],[[[5222,6192],[5219,6195],[5219,6195],[5222,6192]]],[[[5216,6197],[5215,6198],[5215,6197],[5216,6197]]],[[[5181,6201],[5195,6195],[5210,6191],[5223,6133],[5222,6082],[5238,6078],[5268,6044],[5266,6002],[5247,5987],[5220,6006],[5223,6052],[5202,6045],[5189,6063],[5178,6072],[5194,6107],[5190,6157],[5203,6166],[5181,6201]]]]}},{"type":"Feature","id":"AM","properties":{"hc-group":"admin0","hc-middle-x":0.10,"hc-middle-y":0.12,"hc-key":"am","hc-a2":"AM","name":"Armenia","labelrank":"6","country-abbrev":"Arm.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"ARM","iso-a2":"AM","woe-id":"23424743","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5584,7687],[5580,7689],[5573,7687],[5563,7710],[5533,7716],[5500,7730],[5493,7765],[5515,7769],[5539,7771],[5568,7734],[5558,7727],[5584,7687]],[[5540,7763],[5540,7764],[5538,7764],[5539,7762],[5540,7763]],[[5546,7760],[5545,7761],[5545,7761],[5545,7760],[5546,7760]],[[5554,7747],[5555,7747],[5556,7749],[5554,7749],[5554,7747]]]}},{"type":"Feature","id":"SX","properties":{"hc-group":"admin0","hc-middle-x":0.76,"hc-middle-y":0.53,"hc-key":"sx","hc-a2":"SX","name":"Somaliland","labelrank":"5","country-abbrev":"Solnd.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"-99","iso-a2":"SX","woe-id":"-99","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5487,6819],[5518,6788],[5562,6801],[5582,6795],[5611,6810],[5656,6812],[5656,6758],[5628,6715],[5598,6715],[5510,6744],[5470,6793],[5478,6804],[5487,6819]]]}},{"type":"Feature","id":"TM","properties":{"hc-group":"admin0","hc-middle-x":0.40,"hc-middle-y":0.42,"hc-key":"tm","hc-a2":"TM","name":"Turkmenistan","labelrank":"4","country-abbrev":"Turkm.","subregion":"Central Asia","region-wb":"Europe & Central Asia","iso-a3":"TKM","iso-a2":"TM","woe-id":"23424972","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5898,7794],[5921,7785],[5915,7802],[5943,7825],[5981,7807],[5987,7775],[6043,7761],[6057,7726],[6151,7665],[6179,7658],[6178,7635],[6156,7642],[6126,7626],[6117,7598],[6052,7560],[6022,7576],[6020,7608],[5995,7610],[5949,7646],[5906,7656],[5902,7666],[5849,7660],[5804,7634],[5806,7688],[5794,7724],[5769,7728],[5775,7760],[5798,7748],[5828,7765],[5803,7799],[5792,7800],[5792,7800],[5812,7808],[5851,7770],[5865,7773],[5896,7770],[5898,7794]]],[[[5780,7795],[5782,7800],[5792,7800],[5792,7800],[5780,7795],[5780,7795],[5780,7795]]],[[[5780,7795],[5771,7775],[5760,7788],[5780,7795],[5780,7795],[5780,7795]]]]}},{"type":"Feature","id":"ZM","properties":{"hc-group":"admin0","hc-middle-x":0.36,"hc-middle-y":0.58,"hc-key":"zm","hc-a2":"ZM","name":"Zambia","labelrank":"3","country-abbrev":"Zambia","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"ZMB","iso-a2":"ZM","woe-id":"23425003","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5050,6201],[5069,6222],[5061,6228],[5111,6236],[5125,6219],[5129,6225],[5153,6211],[5181,6201],[5203,6166],[5190,6157],[5194,6107],[5178,6072],[5189,6063],[5101,6034],[5106,6014],[5060,6001],[5058,5987],[5038,5977],[5022,5969],[5006,5944],[4996,5940],[4954,5949],[4923,5958],[4898,5953],[4856,5998],[4856,6093],[4916,6093],[4915,6157],[4925,6142],[4955,6147],[4956,6134],[4996,6123],[5011,6136],[5070,6080],[5088,6081],[5088,6119],[5066,6112],[5046,6140],[5056,6189],[5050,6201]]]}},{"type":"Feature","id":"NC","properties":{"hc-group":"admin0","hc-middle-x":0.56,"hc-middle-y":0.71,"hc-key":"nc","hc-a2":"NC","name":"Northern Cyprus","labelrank":"6","country-abbrev":"N. Cy.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"-99","iso-a2":"NC","woe-id":"-90","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5210,7558],[5206,7556],[5203,7556],[5196,7562],[5175,7561],[5175,7561],[5175,7561],[5175,7561],[5175,7561],[5175,7561],[5231,7579],[5213,7557],[5210,7558]]],[[[5171,7561],[5173,7562],[5172,7561],[5171,7561]]]]}},{"type":"Feature","id":"MR","properties":{"hc-group":"admin0","hc-middle-x":0.61,"hc-middle-y":0.63,"hc-key":"mr","hc-a2":"MR","name":"Mauritania","labelrank":"3","country-abbrev":"Mrt.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MRT","iso-a2":"MR","woe-id":"23424896","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3946,7304],[4040,7245],[4061,7231],[4008,7231],[4040,6939],[3886,6937],[3856,6941],[3840,6917],[3779,6974],[3719,6968],[3713,6949],[3728,7014],[3714,7058],[3723,7083],[3698,7100],[3701,7117],[3818,7117],[3818,7170],[3847,7183],[3847,7263],[3946,7263],[3946,7304]]]}},{"type":"Feature","id":"DZ","properties":{"hc-group":"admin0","hc-middle-x":0.63,"hc-middle-y":0.50,"hc-key":"dz","hc-a2":"DZ","name":"Algeria","labelrank":"3","country-abbrev":"Alg.","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"DZA","iso-a2":"DZ","woe-id":"23424740","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4061,7231],[4040,7245],[3946,7304],[3946,7316],[3946,7348],[3977,7371],[4033,7378],[4096,7414],[4095,7444],[4129,7460],[4167,7459],[4173,7473],[4154,7497],[4151,7547],[4138,7558],[4235,7605],[4291,7616],[4346,7619],[4359,7611],[4423,7626],[4459,7621],[4452,7604],[4448,7543],[4426,7518],[4451,7473],[4472,7458],[4486,7398],[4496,7363],[4496,7279],[4483,7267],[4502,7227],[4546,7209],[4559,7185],[4426,7103],[4376,7059],[4329,7050],[4296,7050],[4299,7070],[4260,7083],[4238,7110],[4061,7231]]]}},{"type":"Feature","id":"LT","properties":{"hc-group":"admin0","hc-middle-x":0.27,"hc-middle-y":0.06,"hc-key":"lt","hc-a2":"LT","name":"Lithuania","labelrank":"5","country-abbrev":"Lith.","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"LTU","iso-a2":"LT","woe-id":"23424875","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4835,8303],[4832,8321],[4829,8337],[4860,8352],[4929,8345],[4942,8353],[4993,8320],[4998,8305],[4972,8290],[4960,8264],[4927,8247],[4901,8249],[4900,8258],[4880,8266],[4881,8288],[4835,8303]]],[[[4825,8304],[4830,8313],[4827,8304],[4825,8304]]]]}},{"type":"Feature","id":"ET","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.58,"hc-key":"et","hc-a2":"ET","name":"Ethiopia","labelrank":"2","country-abbrev":"Eth.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"ETH","iso-a2":"ET","woe-id":"23424808","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5444,6813],[5441,6810],[5444,6807],[5449,6802],[5478,6804],[5470,6793],[5510,6744],[5598,6715],[5628,6715],[5538,6624],[5509,6625],[5447,6596],[5414,6605],[5377,6579],[5335,6585],[5297,6609],[5270,6615],[5235,6675],[5205,6705],[5185,6709],[5190,6729],[5211,6728],[5215,6758],[5230,6801],[5238,6796],[5263,6854],[5276,6855],[5288,6902],[5328,6921],[5416,6897],[5462,6848],[5443,6820],[5444,6813]]]}},{"type":"Feature","id":"ER","properties":{"hc-group":"admin0","hc-middle-x":0.29,"hc-middle-y":0.05,"hc-key":"er","hc-a2":"ER","name":"Eritrea","labelrank":"4","country-abbrev":"Erit.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"ERI","iso-a2":"ER","woe-id":"23424806","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5462,6848],[5416,6897],[5328,6921],[5288,6902],[5285,6928],[5302,6987],[5350,7015],[5382,6928],[5426,6913],[5484,6855],[5471,6845],[5462,6848]]]}},{"type":"Feature","id":"GH","properties":{"hc-group":"admin0","hc-middle-x":0.13,"hc-middle-y":0.77,"hc-key":"gh","hc-a2":"GH","name":"Ghana","labelrank":"3","country-abbrev":"Ghana","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GHA","iso-a2":"GH","woe-id":"23424824","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4239,6659],[4142,6618],[4111,6629],[4112,6629],[4116,6629],[4120,6631],[4108,6681],[4130,6721],[4124,6759],[4122,6804],[4199,6808],[4215,6781],[4219,6681],[4239,6659]]]}},{"type":"Feature","id":"SI","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.57,"hc-key":"si","hc-a2":"SI","name":"Slovenia","labelrank":"6","country-abbrev":"Slo.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"SVN","iso-a2":"SI","woe-id":"23424945","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4607,7923],[4607,7925],[4611,7927],[4601,7952],[4611,7961],[4635,7956],[4682,7974],[4687,7974],[4694,7960],[4668,7949],[4659,7921],[4607,7923]]]}},{"type":"Feature","id":"GT","properties":{"hc-group":"admin0","hc-middle-x":0.44,"hc-middle-y":0.87,"hc-key":"gt","hc-a2":"GT","name":"Guatemala","labelrank":"3","country-abbrev":"Guat.","subregion":"Central America","region-wb":"Latin America & Caribbean","iso-a3":"GTM","iso-a2":"GT","woe-id":"23424834","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1565,6951],[1574,6947],[1586,6946],[1558,6926],[1552,6907],[1530,6889],[1530,6886],[1494,6893],[1466,6911],[1482,6956],[1522,6966],[1491,6992],[1504,7009],[1558,7009],[1556,6951],[1565,6951]]]}},{"type":"Feature","id":"BA","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.48,"hc-key":"ba","hc-a2":"BA","name":"Bosnia and Herzegovina","labelrank":"5","country-abbrev":"B.H.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"BIH","iso-a2":"BA","woe-id":"23424761","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4728,7828],[4725,7830],[4726,7830],[4685,7876],[4672,7911],[4706,7915],[4768,7900],[4779,7901],[4774,7851],[4752,7832],[4751,7816],[4734,7826],[4728,7828]]]}},{"type":"Feature","id":"JO","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.85,"hc-key":"jo","hc-a2":"JO","name":"Jordan","labelrank":"4","country-abbrev":"Jord.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"JOR","iso-a2":"JO","woe-id":"23424860","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5255,7426],[5258,7429],[5255,7431],[5254,7432],[5255,7434],[5259,7434],[5259,7448],[5259,7477],[5265,7480],[5296,7466],[5355,7501],[5363,7472],[5366,7460],[5301,7439],[5331,7407],[5274,7365],[5241,7370],[5243,7376],[5241,7377],[5247,7405],[5255,7426]]]}},{"type":"Feature","id":"SY","properties":{"hc-group":"admin0","hc-middle-x":0.25,"hc-middle-y":0.54,"hc-key":"sy","hc-a2":"SY","name":"Syria","labelrank":"3","country-abbrev":"Syria","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"SYR","iso-a2":"SY","woe-id":"23424956","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5355,7501],[5296,7466],[5265,7480],[5269,7487],[5267,7502],[5290,7529],[5271,7544],[5270,7569],[5270,7586],[5291,7617],[5338,7620],[5384,7614],[5457,7634],[5461,7627],[5432,7606],[5427,7548],[5412,7533],[5355,7501]]]}},{"type":"Feature","id":"MC","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.67,"hc-key":"mc","hc-a2":"MC","name":"Monaco","labelrank":"6","country-abbrev":"Mco.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"MCO","iso-a2":"MC","woe-id":"23424892","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4425,7859],[4424,7858],[4423,7858],[4424,7860],[4425,7859]]]}},{"type":"Feature","id":"AL","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.49,"hc-key":"al","hc-a2":"AL","name":"Albania","labelrank":"6","country-abbrev":"Alb.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"ALB","iso-a2":"AL","woe-id":"23424742","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4826,7757],[4826,7757],[4825,7758],[4826,7757]]],[[[4779,7800],[4779,7805],[4780,7808],[4789,7820],[4799,7816],[4812,7804],[4814,7792],[4811,7781],[4816,7764],[4817,7758],[4819,7758],[4822,7758],[4825,7758],[4825,7757],[4826,7756],[4826,7756],[4824,7753],[4826,7754],[4826,7753],[4828,7750],[4827,7750],[4828,7750],[4809,7720],[4798,7715],[4777,7749],[4779,7791],[4778,7795],[4779,7800]]],[[[4779,7807],[4779,7807],[4779,7806],[4779,7807]]]]}},{"type":"Feature","id":"UY","properties":{"hc-group":"admin0","hc-middle-x":0.81,"hc-middle-y":0.63,"hc-key":"uy","hc-a2":"UY","name":"Uruguay","labelrank":"4","country-abbrev":"Ury.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"URY","iso-a2":"UY","woe-id":"23424979","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[2626,5480],[2612,5465],[2615,5450],[2615,5447],[2620,5444],[2608,5422],[2573,5404],[2537,5404],[2487,5420],[2471,5437],[2477,5487],[2477,5505],[2494,5561],[2517,5563],[2542,5531],[2554,5539],[2626,5480]]]}},{"type":"Feature","id":"CNM","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.11,"hc-key":"cnm","hc-a2":"CN","name":"Cyprus No Mans Area","labelrank":"9","country-abbrev":null,"subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"-99","iso-a2":null,"woe-id":"-99","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[5213,7557],[5214,7557],[5213,7557],[5210,7557],[5210,7558],[5213,7557]]],[[[5171,7561],[5171,7561],[5172,7561],[5173,7562],[5173,7562],[5172,7560],[5171,7561]]],[[[5175,7561],[5174,7561],[5175,7561],[5175,7561],[5175,7561],[5175,7561]]],[[[5203,7556],[5205,7555],[5204,7555],[5196,7561],[5175,7561],[5175,7561],[5196,7562],[5203,7556]]]]}},{"type":"Feature","id":"MN","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.53,"hc-key":"mn","hc-a2":"MN","name":"Mongolia","labelrank":"3","country-abbrev":"Mong.","subregion":"Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"MNG","iso-a2":"MN","woe-id":"23424887","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7691,8008],[7702,8011],[7698,8015],[7722,8015],[7762,7975],[7756,7963],[7714,7968],[7664,7953],[7637,7921],[7603,7919],[7575,7895],[7528,7908],[7511,7885],[7526,7857],[7453,7813],[7372,7807],[7326,7787],[7282,7788],[7232,7803],[7220,7815],[7064,7822],[7034,7879],[6979,7903],[6901,7912],[6906,7963],[6885,8003],[6847,8016],[6814,8039],[6810,8061],[6945,8127],[7001,8115],[7011,8094],[7093,8083],[7121,8113],[7106,8132],[7139,8176],[7237,8144],[7239,8117],[7280,8098],[7330,8111],[7407,8090],[7425,8067],[7490,8060],[7559,8077],[7596,8104],[7628,8089],[7667,8086],[7632,8021],[7642,8005],[7691,8008]]]}},{"type":"Feature","id":"RW","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.56,"hc-key":"rw","hc-a2":"RW","name":"Rwanda","labelrank":"3","country-abbrev":"Rwa.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"RWA","iso-a2":"RW","woe-id":"23424937","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5065,6398],[5061,6400],[5061,6406],[5075,6419],[5071,6429],[5075,6434],[5082,6438],[5092,6435],[5108,6447],[5119,6432],[5111,6408],[5091,6400],[5065,6398]]]}},{"type":"Feature","id":"SO","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.74,"hc-key":"so","hc-a2":"SO","name":"Somalia","labelrank":"6","country-abbrev":"Som.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SOM","iso-a2":"SO","woe-id":"-90","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5447,6596],[5509,6625],[5538,6624],[5628,6715],[5656,6758],[5656,6812],[5726,6829],[5713,6758],[5627,6610],[5570,6551],[5494,6497],[5437,6429],[5420,6453],[5420,6562],[5447,6596]]]}},{"type":"Feature","id":"BO","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.59,"hc-key":"bo","hc-a2":"BO","name":"Bolivia","labelrank":"3","country-abbrev":"Bolivia","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"BOL","iso-a2":"BO","woe-id":"23424762","continent":"South America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[2153,5996],[2153,6001],[2157,5996],[2155,5997],[2153,5996]]],[[[2141,5957],[2137,5964],[2155,5986],[2169,5993],[2145,6017],[2160,6058],[2153,6073],[2166,6108],[2139,6155],[2177,6154],[2226,6186],[2262,6192],[2263,6149],[2293,6110],[2332,6104],[2369,6077],[2409,6069],[2419,5995],[2469,5993],[2471,5965],[2496,5937],[2478,5876],[2450,5903],[2371,5892],[2356,5864],[2345,5812],[2307,5819],[2295,5792],[2287,5813],[2238,5826],[2210,5794],[2189,5794],[2180,5842],[2163,5868],[2173,5898],[2157,5913],[2141,5957]]]]}},{"type":"Feature","id":"CM","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.81,"hc-key":"cm","hc-a2":"CM","name":"Cameroon","labelrank":"3","country-abbrev":"Cam.","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"CMR","iso-a2":"CM","woe-id":"23424785","continent":"Africa"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4599,6542],[4541,6547],[4540,6543],[4500,6543],[4495,6548],[4490,6593],[4459,6621],[4466,6651],[4518,6689],[4540,6669],[4567,6725],[4639,6839],[4621,6866],[4629,6866],[4627,6861],[4634,6863],[4653,6820],[4651,6798],[4669,6774],[4625,6774],[4618,6764],[4655,6729],[4663,6701],[4631,6657],[4654,6590],[4682,6562],[4685,6545],[4684,6530],[4636,6544],[4599,6542]]],[[[4631,6866],[4631,6866],[4630,6866],[4631,6866]]]]}},{"type":"Feature","id":"CG","properties":{"hc-group":"admin0","hc-middle-x":0.15,"hc-middle-y":0.78,"hc-key":"cg","hc-a2":"CG","name":"Republic of Congo","labelrank":"4","country-abbrev":"Rep. Congo","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"COG","iso-a2":"CG","woe-id":"23424779","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4599,6542],[4636,6544],[4684,6530],[4685,6545],[4696,6581],[4722,6588],[4757,6581],[4740,6542],[4731,6463],[4686,6416],[4685,6381],[4644,6337],[4631,6353],[4592,6342],[4583,6349],[4560,6331],[4554,6344],[4534,6363],[4555,6369],[4547,6410],[4573,6423],[4622,6405],[4634,6461],[4614,6473],[4633,6506],[4597,6515],[4599,6542]]]}},{"type":"Feature","id":"EH","properties":{"hc-group":"admin0","hc-middle-x":0.41,"hc-middle-y":0.71,"hc-key":"eh","hc-a2":"EH","name":"Western Sahara","labelrank":"7","country-abbrev":"W. Sah.","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"ESH","iso-a2":"EH","woe-id":"23424990","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3698,7100],[3696,7103],[3699,7120],[3764,7121],[3782,7148],[3788,7182],[3835,7226],[3847,7264],[3866,7291],[3915,7290],[3943,7298],[3946,7316],[3946,7304],[3946,7263],[3847,7263],[3847,7183],[3818,7170],[3818,7117],[3701,7117],[3698,7100]]]}},{"type":"Feature","id":"RS","properties":{"hc-group":"admin0","hc-middle-x":0.42,"hc-middle-y":0.52,"hc-key":"rs","hc-a2":"RS","name":"Republic of Serbia","labelrank":"5","country-abbrev":"Serb.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"SRB","iso-a2":"RS","woe-id":"-90","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4774,7851],[4779,7901],[4768,7900],[4769,7910],[4765,7939],[4784,7948],[4805,7946],[4842,7910],[4839,7897],[4877,7877],[4867,7861],[4885,7836],[4867,7808],[4855,7808],[4844,7805],[4850,7820],[4820,7842],[4808,7826],[4786,7839],[4774,7851]]]}},{"type":"Feature","id":"ME","properties":{"hc-group":"admin0","hc-middle-x":0.42,"hc-middle-y":0.47,"hc-key":"me","hc-a2":"ME","name":"Montenegro","labelrank":"6","country-abbrev":"Mont.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"MNE","iso-a2":"ME","woe-id":"20069817","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4774,7851],[4786,7839],[4808,7826],[4798,7822],[4799,7816],[4789,7820],[4780,7808],[4779,7807],[4779,7806],[4772,7806],[4779,7800],[4778,7795],[4779,7791],[4761,7806],[4753,7811],[4751,7814],[4751,7816],[4752,7832],[4774,7851]]]}},{"type":"Feature","id":"TG","properties":{"hc-group":"admin0","hc-middle-x":0.76,"hc-middle-y":0.81,"hc-key":"tg","hc-a2":"TG","name":"Togo","labelrank":"6","country-abbrev":"Togo","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"TGO","iso-a2":"TG","woe-id":"23424965","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4231,6804],[4252,6746],[4252,6662],[4246,6661],[4239,6659],[4219,6681],[4215,6781],[4199,6808],[4218,6804],[4231,6804]]]}},{"type":"Feature","id":"LA","properties":{"hc-group":"admin0","hc-middle-x":0.88,"hc-middle-y":0.79,"hc-key":"la","hc-a2":"LA","name":"Laos","labelrank":"4","country-abbrev":"Laos","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"LAO","iso-a2":"LA","woe-id":"23424872","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[7395,6915],[7374,6904],[7325,6904],[7338,6946],[7313,6970],[7315,6996],[7290,7025],[7272,7029],[7249,7010],[7233,7022],[7205,6999],[7209,7061],[7186,7062],[7175,7086],[7193,7117],[7206,7124],[7222,7111],[7217,7146],[7234,7150],[7260,7125],[7264,7103],[7292,7106],[7319,7079],[7286,7055],[7311,7039],[7365,6984],[7399,6932],[7395,6915]]]}},{"type":"Feature","id":"AF","properties":{"hc-group":"admin0","hc-middle-x":0.37,"hc-middle-y":0.52,"hc-key":"af","hc-a2":"AF","name":"Afghanistan","labelrank":"3","country-abbrev":"Afg.","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"AFG","iso-a2":"AF","woe-id":"23424739","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6426,7631],[6411,7627],[6416,7624],[6357,7617],[6316,7590],[6330,7562],[6313,7524],[6281,7523],[6290,7499],[6268,7491],[6261,7454],[6226,7450],[6173,7421],[6168,7385],[6106,7371],[6058,7372],[6010,7386],[6038,7418],[6035,7435],[6009,7439],[6001,7491],[6022,7576],[6052,7560],[6117,7598],[6126,7626],[6156,7642],[6178,7635],[6200,7629],[6215,7629],[6259,7626],[6285,7641],[6299,7669],[6329,7653],[6329,7613],[6379,7639],[6426,7631]]]}},{"type":"Feature","id":"UA","properties":{"hc-group":"admin0","hc-middle-x":0.70,"hc-middle-y":0.46,"hc-key":"ua","hc-a2":"UA","name":"Ukraine","labelrank":"3","country-abbrev":"Ukr.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"UKR","iso-a2":"UA","woe-id":"23424976","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4861,8032],[4866,8042],[4873,8057],[4876,8075],[4919,8114],[4905,8152],[4928,8166],[4969,8168],[5013,8155],[5074,8146],[5110,8154],[5122,8174],[5147,8175],[5207,8185],[5225,8161],[5218,8142],[5245,8140],[5262,8106],[5315,8109],[5367,8087],[5395,8064],[5382,8045],[5384,8010],[5356,8011],[5338,7983],[5269,7966],[5237,7948],[5260,7909],[5212,7882],[5179,7928],[5206,7939],[5146,7950],[5163,7959],[5129,7965],[5089,7927],[5084,7913],[5059,7914],[5041,7922],[5063,7958],[5097,7955],[5068,7999],[5072,8011],[5028,8033],[4994,8026],[4954,8013],[4883,8014],[4875,8020],[4861,8032]],[[5098,7955],[5107,7945],[5109,7947],[5100,7956],[5098,7955]],[[5213,7945],[5242,7929],[5237,7943],[5218,7952],[5213,7945]]]}},{"type":"Feature","id":"SK","properties":{"hc-group":"admin0","hc-middle-x":0.21,"hc-middle-y":0.52,"hc-key":"sk","hc-a2":"SK","name":"Slovakia","labelrank":"6","country-abbrev":"Svk.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"SVK","iso-a2":"SK","woe-id":"23424877","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4873,8057],[4866,8042],[4861,8032],[4812,8036],[4795,8021],[4733,8007],[4713,8017],[4704,8030],[4707,8039],[4741,8058],[4763,8074],[4852,8069],[4873,8057]]]}},{"type":"Feature","id":"JK","properties":{"hc-group":"admin0","hc-middle-x":0.40,"hc-middle-y":0.63,"hc-key":"jk","hc-a2":"JK","name":"Siachen Glacier","labelrank":"5","country-abbrev":"Siachen","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"-99","iso-a2":"JK","woe-id":"23424928","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6513,7572],[6490,7559],[6482,7577],[6500,7571],[6513,7572]]]}},{"type":"Feature","id":"BG","properties":{"hc-group":"admin0","hc-middle-x":0.76,"hc-middle-y":0.51,"hc-key":"bg","hc-a2":"BG","name":"Bulgaria","labelrank":"4","country-abbrev":"Bulg.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"BGR","iso-a2":"BG","woe-id":"23424771","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[5052,7859],[5026,7812],[5035,7796],[5007,7799],[4985,7786],[4953,7770],[4931,7781],[4884,7773],[4887,7787],[4867,7808],[4885,7836],[4867,7861],[4877,7877],[4896,7864],[4957,7856],[5006,7875],[5052,7859]]]}},{"type":"Feature","id":"QA","properties":{"hc-group":"admin0","hc-middle-x":0.36,"hc-middle-y":0.46,"hc-key":"qa","hc-a2":"QA","name":"Qatar","labelrank":"5","country-abbrev":"Qatar","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"QAT","iso-a2":"QA","woe-id":"23424930","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5712,7224],[5710,7247],[5735,7259],[5724,7220],[5717,7218],[5712,7224]]]}},{"type":"Feature","id":"LI","properties":{"hc-group":"admin0","hc-middle-x":0.61,"hc-middle-y":0.53,"hc-key":"li","hc-a2":"LI","name":"Liechtenstein","labelrank":"6","country-abbrev":"Liech.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"LIE","iso-a2":"LI","woe-id":"23424879","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4487,7989],[4489,7983],[4488,7981],[4485,7981],[4487,7989]]]}},{"type":"Feature","id":"AT","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.62,"hc-key":"at","hc-a2":"AT","name":"Austria","labelrank":"4","country-abbrev":"Aust.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"AUT","iso-a2":"AT","woe-id":"23424750","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4488,7981],[4489,7983],[4487,7989],[4490,7994],[4488,7998],[4491,7997],[4492,7999],[4530,7993],[4565,8005],[4591,7997],[4582,8021],[4614,8045],[4640,8039],[4648,8053],[4707,8039],[4704,8030],[4713,8017],[4696,8007],[4682,7974],[4635,7956],[4611,7961],[4572,7967],[4566,7982],[4514,7974],[4504,7973],[4488,7981]]]}},{"type":"Feature","id":"SZ","properties":{"hc-group":"admin0","hc-middle-x":0.51,"hc-middle-y":0.45,"hc-key":"sz","hc-a2":"SZ","name":"Swaziland","labelrank":"4","country-abbrev":"Swz.","subregion":"Southern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SWZ","iso-a2":"SZ","woe-id":"23424993","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5152,5696],[5155,5685],[5157,5668],[5128,5656],[5118,5682],[5137,5702],[5152,5696]]]}},{"type":"Feature","id":"HU","properties":{"hc-group":"admin0","hc-middle-x":0.27,"hc-middle-y":0.61,"hc-key":"hu","hc-a2":"HU","name":"Hungary","labelrank":"5","country-abbrev":"Hun.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"HUN","iso-a2":"HU","woe-id":"23424844","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4861,8032],[4875,8020],[4883,8014],[4857,7997],[4831,7952],[4805,7946],[4784,7948],[4765,7939],[4719,7940],[4694,7960],[4687,7974],[4682,7974],[4696,8007],[4713,8017],[4733,8007],[4795,8021],[4812,8036],[4861,8032]]]}},{"type":"Feature","id":"RO","properties":{"hc-group":"admin0","hc-middle-x":0.67,"hc-middle-y":0.50,"hc-key":"ro","hc-a2":"RO","name":"Romania","labelrank":"3","country-abbrev":"Rom.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"ROU","iso-a2":"RO","woe-id":"23424933","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4877,7877],[4839,7897],[4842,7910],[4805,7946],[4831,7952],[4857,7997],[4883,8014],[4954,8013],[4994,8026],[5005,8023],[5042,7965],[5041,7922],[5059,7914],[5084,7913],[5054,7880],[5052,7859],[5006,7875],[4957,7856],[4896,7864],[4877,7877]]]}},{"type":"Feature","id":"NE","properties":{"hc-group":"admin0","hc-middle-x":0.64,"hc-middle-y":0.53,"hc-key":"ne","hc-a2":"NE","name":"Niger","labelrank":"3","country-abbrev":"Niger","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"NER","iso-a2":"NE","woe-id":"23424906","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4311,6825],[4288,6846],[4275,6831],[4269,6852],[4233,6865],[4210,6922],[4243,6933],[4308,6935],[4328,6967],[4329,7050],[4376,7059],[4426,7103],[4559,7185],[4604,7175],[4626,7157],[4649,7169],[4655,7122],[4678,7087],[4671,7073],[4663,6982],[4603,6906],[4608,6885],[4574,6866],[4543,6875],[4504,6872],[4490,6859],[4436,6874],[4410,6864],[4368,6891],[4326,6878],[4311,6825]]]}},{"type":"Feature","id":"LU","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.60,"hc-key":"lu","hc-a2":"LU","name":"Luxembourg","labelrank":"6","country-abbrev":"Lux.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"LUX","iso-a2":"LU","woe-id":"23424881","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4392,8072],[4381,8071],[4376,8075],[4374,8088],[4386,8097],[4397,8085],[4392,8072]]]}},{"type":"Feature","id":"AD","properties":{"hc-group":"admin0","hc-middle-x":0.58,"hc-middle-y":0.28,"hc-key":"ad","hc-a2":"AD","name":"Andorra","labelrank":"6","country-abbrev":"And.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"AND","iso-a2":"AD","woe-id":"23424744","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4246,7818],[4255,7818],[4255,7814],[4249,7812],[4246,7818]]]}},{"type":"Feature","id":"CI","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.48,"hc-key":"ci","hc-a2":"CI","name":"Ivory Coast","labelrank":"3","country-abbrev":"I.C.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"CIV","iso-a2":"CI","woe-id":"23424854","continent":"Africa"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4124,6759],[4130,6721],[4108,6681],[4120,6631],[4030,6627],[3980,6607],[3982,6650],[3948,6670],[3952,6702],[3971,6757],[3967,6779],[4019,6782],[4040,6787],[4065,6765],[4109,6772],[4124,6759]]],[[[4111,6629],[4107,6630],[4112,6629],[4111,6629]]]]}},{"type":"Feature","id":"LR","properties":{"hc-group":"admin0","hc-middle-x":0.96,"hc-middle-y":0.75,"hc-key":"lr","hc-a2":"LR","name":"Liberia","labelrank":"4","country-abbrev":"Liberia","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"LBR","iso-a2":"LR","woe-id":"23424876","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3952,6702],[3948,6670],[3982,6650],[3980,6607],[3929,6631],[3863,6683],[3889,6708],[3899,6729],[3922,6725],[3933,6691],[3952,6702]]]}},{"type":"Feature","id":"BN","properties":{"hc-group":"admin0","hc-middle-x":0.32,"hc-middle-y":0.34,"hc-key":"bn","hc-a2":"BN","name":"Brunei","labelrank":"6","country-abbrev":"Brunei","subregion":"South-Eastern Asia","region-wb":"East Asia & Pacific","iso-a3":"BRN","iso-a2":"BN","woe-id":"23424773","continent":"Asia"},"geometry":{"type":"MultiPolygon","coordinates":[[[[7618,6621],[7621,6622],[7621,6623],[7627,6606],[7618,6621]]],[[[7587,6614],[7603,6617],[7616,6623],[7606,6597],[7587,6614]]]]}},{"type":"Feature","id":"IQ","properties":{"hc-group":"admin0","hc-middle-x":0.46,"hc-middle-y":0.44,"hc-key":"iq","hc-a2":"IQ","name":"Iraq","labelrank":"3","country-abbrev":"Iraq","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"IRQ","iso-a2":"IQ","woe-id":"23424855","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5644,7390],[5632,7392],[5627,7391],[5602,7390],[5585,7362],[5530,7365],[5453,7426],[5404,7453],[5366,7460],[5363,7472],[5355,7501],[5412,7533],[5427,7548],[5432,7606],[5461,7627],[5472,7635],[5532,7628],[5549,7589],[5579,7582],[5551,7521],[5577,7487],[5611,7469],[5623,7448],[5619,7423],[5644,7390]]]}},{"type":"Feature","id":"GE","properties":{"hc-group":"admin0","hc-middle-x":0.99,"hc-middle-y":0.82,"hc-key":"ge","hc-a2":"GE","name":"Georgia","labelrank":"5","country-abbrev":"Geo.","subregion":"Western Asia","region-wb":"Europe & Central Asia","iso-a3":"GEO","iso-a2":"GE","woe-id":"23424823","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5539,7771],[5515,7769],[5493,7765],[5474,7782],[5436,7779],[5436,7819],[5391,7846],[5475,7838],[5508,7816],[5534,7823],[5582,7793],[5584,7763],[5539,7771]]]}},{"type":"Feature","id":"GM","properties":{"hc-group":"admin0","hc-middle-x":0.51,"hc-middle-y":0.51,"hc-key":"gm","hc-a2":"GM","name":"Gambia","labelrank":"6","country-abbrev":"Gambia","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GMB","iso-a2":"GM","woe-id":"23424821","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3707,6866],[3705,6874],[3713,6882],[3762,6888],[3734,6869],[3707,6866]]]}},{"type":"Feature","id":"CH","properties":{"hc-group":"admin0","hc-middle-x":0.12,"hc-middle-y":0.55,"hc-key":"ch","hc-a2":"CH","name":"Switzerland","labelrank":"4","country-abbrev":"Switz.","subregion":"Western Europe","region-wb":"Europe & Central Asia","iso-a3":"CHE","iso-a2":"CH","woe-id":"23424957","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4477,8004],[4477,8004],[4477,8003],[4477,8003],[4486,7997],[4488,7998],[4490,7994],[4487,7989],[4485,7981],[4488,7981],[4504,7973],[4514,7974],[4500,7955],[4466,7944],[4444,7951],[4412,7939],[4405,7947],[4405,7957],[4400,7961],[4393,7956],[4389,7952],[4386,7963],[4429,8001],[4455,8001],[4477,8004]]]}},{"type":"Feature","id":"TD","properties":{"hc-group":"admin0","hc-middle-x":0.47,"hc-middle-y":0.63,"hc-key":"td","hc-a2":"TD","name":"Chad","labelrank":"3","country-abbrev":"Chad","subregion":"Middle Africa","region-wb":"Sub-Saharan Africa","iso-a3":"TCD","iso-a2":"TD","woe-id":"23424777","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4634,6863],[4642,6866],[4631,6866],[4630,6866],[4628,6868],[4629,6866],[4621,6866],[4608,6885],[4603,6906],[4663,6982],[4671,7073],[4678,7087],[4655,7122],[4649,7169],[4678,7183],[4916,7061],[4916,6946],[4889,6945],[4873,6898],[4859,6887],[4863,6856],[4882,6802],[4870,6804],[4810,6749],[4771,6745],[4756,6716],[4702,6702],[4663,6701],[4655,6729],[4618,6764],[4625,6774],[4669,6774],[4651,6798],[4653,6820],[4634,6863]]]}},{"type":"Feature","id":"KV","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.52,"hc-key":"kv","hc-a2":"KV","name":"Kosovo","labelrank":"6","country-abbrev":"Kos.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"-99","iso-a2":"KV","woe-id":"-90","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4814,7792],[4812,7804],[4799,7816],[4798,7822],[4808,7826],[4820,7842],[4850,7820],[4844,7805],[4830,7804],[4814,7792]]]}},{"type":"Feature","id":"LB","properties":{"hc-group":"admin0","hc-middle-x":0.39,"hc-middle-y":0.57,"hc-key":"lb","hc-a2":"LB","name":"Lebanon","labelrank":"5","country-abbrev":"Leb.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"LBN","iso-a2":"LB","woe-id":"23424873","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5246,7492],[5260,7519],[5271,7544],[5290,7529],[5267,7502],[5257,7492],[5246,7492]]]}},{"type":"Feature","id":"DJ","properties":{"hc-group":"admin0","hc-middle-x":0.56,"hc-middle-y":0.55,"hc-key":"dj","hc-a2":"DJ","name":"Djibouti","labelrank":"5","country-abbrev":"Dji.","subregion":"Eastern Africa","region-wb":"Middle East & North Africa","iso-a3":"DJI","iso-a2":"DJ","woe-id":"23424797","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5478,6804],[5449,6802],[5444,6807],[5447,6810],[5444,6813],[5443,6820],[5462,6848],[5471,6845],[5484,6855],[5490,6834],[5487,6819],[5478,6804]]]}},{"type":"Feature","id":"BI","properties":{"hc-group":"admin0","hc-middle-x":0.57,"hc-middle-y":0.47,"hc-key":"bi","hc-a2":"BI","name":"Burundi","labelrank":"6","country-abbrev":"Bur.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"BDI","iso-a2":"BI","woe-id":"23424774","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5084,6347],[5076,6364],[5071,6380],[5072,6389],[5065,6398],[5091,6400],[5111,6408],[5118,6383],[5084,6347]]]}},{"type":"Feature","id":"SR","properties":{"hc-group":"admin0","hc-middle-x":0.91,"hc-middle-y":0.09,"hc-key":"sr","hc-a2":"SR","name":"Suriname","labelrank":"4","country-abbrev":"Sur.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"SUR","iso-a2":"SR","woe-id":"23424913","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[2583,6547],[2543,6553],[2528,6536],[2481,6602],[2505,6641],[2514,6656],[2601,6651],[2596,6636],[2587,6623],[2601,6581],[2583,6547]]]}},{"type":"Feature","id":"IL","properties":{"hc-group":"admin0","hc-middle-x":0.68,"hc-middle-y":0.10,"hc-key":"il","hc-a2":"IL","name":"Israel","labelrank":"4","country-abbrev":"Isr.","subregion":"Western Asia","region-wb":"Middle East & North Africa","iso-a3":"ISR","iso-a2":"IL","woe-id":"23424852","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[5219,7433],[5238,7465],[5246,7492],[5257,7492],[5267,7502],[5269,7487],[5265,7480],[5259,7477],[5259,7448],[5254,7440],[5255,7434],[5254,7432],[5255,7431],[5253,7429],[5255,7426],[5247,7405],[5241,7377],[5240,7374],[5239,7374],[5237,7382],[5219,7433]]]}},{"type":"Feature","id":"ML","properties":{"hc-group":"admin0","hc-middle-x":0.59,"hc-middle-y":0.38,"hc-key":"ml","hc-a2":"ML","name":"Mali","labelrank":"3","country-abbrev":"Mali","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MLI","iso-a2":"ML","woe-id":"23424891","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4040,6787],[4019,6782],[3967,6779],[3955,6815],[3931,6848],[3886,6831],[3866,6846],[3845,6885],[3840,6917],[3856,6941],[3886,6937],[4040,6939],[4008,7231],[4061,7231],[4238,7110],[4260,7083],[4299,7070],[4296,7050],[4329,7050],[4328,6967],[4308,6935],[4243,6933],[4210,6922],[4183,6927],[4141,6899],[4120,6895],[4099,6869],[4083,6876],[4069,6839],[4051,6832],[4040,6787]]]}},{"type":"Feature","id":"SN","properties":{"hc-group":"admin0","hc-middle-x":0.20,"hc-middle-y":0.55,"hc-key":"sn","hc-a2":"SN","name":"Senegal","labelrank":"3","country-abbrev":"Sen.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SEN","iso-a2":"SN","woe-id":"23424943","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3708,6844],[3705,6859],[3707,6866],[3734,6869],[3762,6888],[3713,6882],[3695,6922],[3713,6949],[3719,6968],[3779,6974],[3840,6917],[3845,6885],[3866,6846],[3837,6843],[3797,6854],[3753,6854],[3708,6844]]]}},{"type":"Feature","id":"GN","properties":{"hc-group":"admin0","hc-middle-x":0.24,"hc-middle-y":0.51,"hc-key":"gn","hc-a2":"GN","name":"Guinea","labelrank":"3","country-abbrev":"Gin.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"GIN","iso-a2":"GN","woe-id":"23424835","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[3866,6846],[3886,6831],[3931,6848],[3955,6815],[3967,6779],[3971,6757],[3952,6702],[3933,6691],[3922,6725],[3899,6729],[3870,6774],[3833,6770],[3809,6746],[3793,6770],[3758,6803],[3767,6819],[3797,6825],[3797,6854],[3837,6843],[3866,6846]]]}},{"type":"Feature","id":"ZW","properties":{"hc-group":"admin0","hc-middle-x":0.81,"hc-middle-y":0.42,"hc-key":"zw","hc-a2":"ZW","name":"Zimbabwe","labelrank":"3","country-abbrev":"Zimb.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"ZWE","iso-a2":"ZW","woe-id":"23425004","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4954,5949],[4996,5940],[5006,5944],[5038,5977],[5038,5977],[5058,5987],[5060,6001],[5106,6014],[5182,5982],[5185,5932],[5176,5898],[5184,5880],[5166,5841],[5133,5807],[5104,5809],[5075,5814],[5036,5833],[5026,5865],[4979,5896],[4954,5949]]]}},{"type":"Feature","id":"PL","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.48,"hc-key":"pl","hc-a2":"PL","name":"Poland","labelrank":"3","country-abbrev":"Pol.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"POL","iso-a2":"PL","woe-id":"23424923","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4786,8270],[4779,8263],[4790,8269],[4878,8266],[4880,8266],[4900,8258],[4901,8249],[4912,8198],[4891,8183],[4905,8152],[4919,8114],[4876,8075],[4873,8057],[4852,8069],[4763,8074],[4755,8089],[4691,8116],[4644,8126],[4639,8194],[4623,8205],[4627,8239],[4638,8245],[4625,8247],[4625,8248],[4626,8249],[4683,8263],[4696,8274],[4748,8286],[4756,8269],[4786,8270],[4786,8270]]]}},{"type":"Feature","id":"MK","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.44,"hc-key":"mk","hc-a2":"MK","name":"Macedonia","labelrank":"6","country-abbrev":"Mkd.","subregion":"Southern Europe","region-wb":"Europe & Central Asia","iso-a3":"MKD","iso-a2":"MK","woe-id":"23424890","continent":"Europe"},"geometry":{"type":"MultiPolygon","coordinates":[[[[4826,7756],[4826,7756],[4826,7756],[4826,7756]]],[[[4867,7808],[4887,7787],[4884,7773],[4854,7765],[4831,7756],[4826,7762],[4826,7757],[4825,7758],[4825,7758],[4822,7758],[4819,7758],[4822,7765],[4816,7764],[4811,7781],[4814,7792],[4830,7804],[4844,7805],[4855,7808],[4867,7808]]]]}},{"type":"Feature","id":"PY","properties":{"hc-group":"admin0","hc-middle-x":0.35,"hc-middle-y":0.36,"hc-key":"py","hc-a2":"PY","name":"Paraguay","labelrank":"4","country-abbrev":"Para.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"PRY","iso-a2":"PY","woe-id":"23424917","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[2594,5755],[2590,5743],[2583,5712],[2584,5709],[2584,5708],[2578,5674],[2549,5649],[2465,5653],[2496,5712],[2422,5757],[2394,5763],[2345,5812],[2356,5864],[2371,5892],[2450,5903],[2478,5876],[2488,5852],[2483,5817],[2530,5817],[2553,5800],[2559,5759],[2594,5755]]]}},{"type":"Feature","id":"BY","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"by","hc-a2":"BY","name":"Belarus","labelrank":"4","country-abbrev":"Bela.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"BLR","iso-a2":"BY","woe-id":"23424765","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4905,8152],[4891,8183],[4912,8198],[4901,8249],[4927,8247],[4960,8264],[4972,8290],[4998,8305],[4993,8320],[5023,8325],[5039,8340],[5121,8317],[5146,8243],[5175,8229],[5131,8212],[5147,8175],[5122,8174],[5110,8154],[5074,8146],[5013,8155],[4969,8168],[4928,8166],[4905,8152]]]}},{"type":"Feature","id":"CZ","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.56,"hc-key":"cz","hc-a2":"CZ","name":"Czech Republic","labelrank":"5","country-abbrev":"Cz. Rep.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"CZE","iso-a2":"CZ","woe-id":"23424810","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[4763,8074],[4741,8058],[4707,8039],[4648,8053],[4640,8039],[4614,8045],[4571,8083],[4575,8108],[4644,8126],[4691,8116],[4755,8089],[4763,8074]]]}},{"type":"Feature","id":"BF","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.54,"hc-key":"bf","hc-a2":"BF","name":"Burkina Faso","labelrank":"3","country-abbrev":"B.F.","subregion":"Western Africa","region-wb":"Sub-Saharan Africa","iso-a3":"BFA","iso-a2":"BF","woe-id":"23424978","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4231,6804],[4218,6804],[4199,6808],[4122,6804],[4124,6759],[4109,6772],[4065,6765],[4040,6787],[4051,6832],[4069,6839],[4083,6876],[4099,6869],[4120,6895],[4141,6899],[4183,6927],[4210,6922],[4233,6865],[4269,6852],[4275,6831],[4247,6818],[4231,6804]]]}},{"type":"Feature","id":"NA","properties":{"hc-group":"admin0","hc-middle-x":0.33,"hc-middle-y":0.37,"hc-key":"na","hc-a2":"NA","name":"Namibia","labelrank":"3","country-abbrev":"Nam.","subregion":"Southern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"NAM","iso-a2":"NA","woe-id":"23424987","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4898,5953],[4923,5958],[4954,5949],[4904,5928],[4895,5942],[4826,5933],[4827,5821],[4797,5819],[4797,5734],[4797,5617],[4771,5600],[4720,5608],[4711,5630],[4693,5613],[4658,5652],[4637,5740],[4631,5811],[4602,5855],[4577,5909],[4561,5927],[4553,5965],[4595,5974],[4618,5960],[4752,5961],[4761,5950],[4821,5941],[4898,5953]]]}},{"type":"Feature","id":"LY","properties":{"hc-group":"admin0","hc-middle-x":0.51,"hc-middle-y":0.38,"hc-key":"ly","hc-a2":"LY","name":"Libya","labelrank":"3","country-abbrev":"Libya","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"LBY","iso-a2":"LY","woe-id":"23424882","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4649,7169],[4626,7157],[4604,7175],[4559,7185],[4546,7209],[4502,7227],[4483,7267],[4496,7279],[4496,7363],[4486,7398],[4509,7421],[4504,7437],[4547,7471],[4545,7495],[4570,7483],[4600,7486],[4655,7469],[4680,7432],[4719,7426],[4770,7399],[4790,7407],[4795,7448],[4814,7474],[4846,7487],[4890,7477],[4889,7467],[4945,7455],[4950,7445],[4937,7397],[4945,7364],[4945,7138],[4945,7076],[4916,7076],[4916,7061],[4678,7183],[4649,7169]]]}},{"type":"Feature","id":"TN","properties":{"hc-group":"admin0","hc-middle-x":0.53,"hc-middle-y":0.03,"hc-key":"tn","hc-a2":"TN","name":"Tunisia","labelrank":"3","country-abbrev":"Tun.","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"TUN","iso-a2":"TN","woe-id":"23424967","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4545,7495],[4547,7471],[4504,7437],[4509,7421],[4486,7398],[4472,7458],[4451,7473],[4426,7518],[4448,7543],[4452,7604],[4459,7621],[4493,7635],[4535,7563],[4505,7533],[4511,7512],[4532,7515],[4545,7495]]]}},{"type":"Feature","id":"BT","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.48,"hc-key":"bt","hc-a2":"BT","name":"Bhutan","labelrank":"5","country-abbrev":"Bhutan","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"BTN","iso-a2":"BT","woe-id":"23424770","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6842,7305],[6882,7338],[6923,7319],[6937,7293],[6869,7285],[6842,7305]]]}},{"type":"Feature","id":"MD","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.42,"hc-key":"md","hc-a2":"MD","name":"Moldova","labelrank":"6","country-abbrev":"Mda.","subregion":"Eastern Europe","region-wb":"Europe & Central Asia","iso-a3":"MDA","iso-a2":"MD","woe-id":"23424885","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[5041,7922],[5042,7965],[5005,8023],[4994,8026],[5028,8033],[5072,8011],[5068,7999],[5097,7955],[5063,7958],[5041,7922]]]}},{"type":"Feature","id":"SS","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.58,"hc-key":"ss","hc-a2":"SS","name":"South Sudan","labelrank":"3","country-abbrev":"S. Sud.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"SSD","iso-a2":"SS","woe-id":"-99","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5212,6603],[5198,6589],[5119,6582],[5088,6613],[5046,6605],[5018,6628],[4988,6658],[4987,6675],[4956,6696],[4921,6735],[4948,6783],[4970,6787],[4992,6760],[5060,6754],[5095,6783],[5131,6768],[5166,6806],[5156,6834],[5190,6840],[5189,6800],[5215,6758],[5211,6728],[5190,6729],[5185,6709],[5205,6705],[5235,6675],[5270,6615],[5255,6627],[5212,6603]]]}},{"type":"Feature","id":"BW","properties":{"hc-group":"admin0","hc-middle-x":0.49,"hc-middle-y":0.60,"hc-key":"bw","hc-a2":"BW","name":"Botswana","labelrank":"4","country-abbrev":"Bwa.","subregion":"Southern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"BWA","iso-a2":"BW","woe-id":"23424755","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[4954,5949],[4979,5896],[5026,5865],[5036,5833],[5075,5814],[5041,5799],[5006,5769],[5000,5749],[4972,5734],[4963,5706],[4941,5700],[4887,5716],[4878,5695],[4847,5667],[4818,5666],[4822,5690],[4797,5734],[4797,5819],[4827,5821],[4826,5933],[4895,5942],[4904,5928],[4954,5949]]]}},{"type":"Feature","id":"BS","properties":{"hc-group":"admin0","hc-middle-x":0.80,"hc-middle-y":0.92,"hc-key":"bs","hc-a2":"BS","name":"The Bahamas","labelrank":"4","country-abbrev":"Bhs.","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"BHS","iso-a2":"BS","woe-id":"23424758","continent":"North America"},"geometry":{"type":"MultiPolygon","coordinates":[[[[1956,7219],[1937,7241],[1937,7241],[1937,7241],[1944,7236],[1956,7219],[1956,7219]]],[[[1956,7219],[1970,7205],[1976,7173],[2045,7149],[1983,7165],[1949,7190],[1966,7207],[1956,7219],[1956,7219]]],[[[1937,7241],[1911,7260],[1890,7236],[1901,7192],[1881,7221],[1883,7237],[1912,7268],[1937,7241],[1937,7241],[1937,7241]]]]}},{"type":"Feature","id":"NZ","properties":{"hc-group":"admin0","hc-middle-x":0.25,"hc-middle-y":0.81,"hc-key":"nz","hc-a2":"NZ","name":"New Zealand","labelrank":"2","country-abbrev":"N.Z.","subregion":"Australia and New Zealand","region-wb":"East Asia & Pacific","iso-a3":"NZL","iso-a2":"NZ","woe-id":"23424916","continent":"Oceania"},"geometry":{"type":"MultiPolygon","coordinates":[[[[9238,4994],[9198,4996],[9194,4975],[9181,5009],[9153,5008],[9145,5023],[9159,5047],[9201,5088],[9241,5104],[9282,5140],[9311,5200],[9330,5213],[9341,5185],[9362,5199],[9374,5165],[9321,5099],[9289,5079],[9268,5027],[9238,4994]]],[[[9429,5191],[9404,5174],[9386,5186],[9404,5221],[9361,5252],[9385,5272],[9393,5308],[9378,5347],[9341,5395],[9364,5402],[9402,5361],[9422,5343],[9427,5313],[9470,5301],[9503,5310],[9483,5263],[9469,5264],[9429,5191]]]]}},{"type":"Feature","id":"CU","properties":{"hc-group":"admin0","hc-middle-x":0.67,"hc-middle-y":0.64,"hc-key":"cu","hc-a2":"CU","name":"Cuba","labelrank":"3","country-abbrev":"Cuba","subregion":"Caribbean","region-wb":"Latin America & Caribbean","iso-a3":"CUB","iso-a2":"CU","woe-id":"23424793","continent":"North America"},"geometry":{"type":"Polygon","coordinates":[[[1916,7091],[1870,7097],[1853,7124],[1817,7140],[1776,7144],[1774,7159],[1748,7160],[1696,7131],[1700,7149],[1734,7169],[1770,7175],[1828,7171],[1852,7150],[1867,7154],[1879,7155],[1933,7113],[1986,7095],[2000,7078],[1898,7071],[1916,7091]]]}},{"type":"Feature","id":"EC","properties":{"hc-group":"admin0","hc-middle-x":0.16,"hc-middle-y":0.37,"hc-key":"ec","hc-a2":"EC","name":"Ecuador","labelrank":"3","country-abbrev":"Ecu.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"ECU","iso-a2":"EC","woe-id":"23424801","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[1820,6379],[1837,6400],[1803,6410],[1803,6447],[1828,6480],[1827,6500],[1865,6521],[1905,6498],[1940,6492],[1970,6476],[1961,6433],[1928,6403],[1879,6379],[1858,6331],[1815,6358],[1820,6379]]]}},{"type":"Feature","id":"AU","properties":{"hc-group":"admin0","hc-middle-x":0.53,"hc-middle-y":0.39,"hc-key":"au","hc-a2":"AU","name":"Australia","labelrank":"2","country-abbrev":"Auz.","subregion":"Australia and New Zealand","region-wb":"East Asia & Pacific","iso-a3":"AUS","iso-a2":"AU","woe-id":"-90","continent":"Oceania"},"geometry":{"type":"MultiPolygon","coordinates":[[[[8563,5105],[8537,5105],[8515,5139],[8497,5193],[8499,5215],[8479,5229],[8543,5191],[8602,5210],[8604,5168],[8595,5117],[8581,5130],[8563,5105]]],[[[8541,5953],[8550,5909],[8629,5866],[8644,5812],[8680,5798],[8682,5771],[8712,5753],[8733,5720],[8756,5726],[8746,5701],[8761,5650],[8762,5603],[8731,5487],[8709,5472],[8660,5372],[8655,5318],[8605,5306],[8551,5275],[8505,5283],[8507,5304],[8464,5271],[8430,5288],[8379,5298],[8351,5328],[8347,5368],[8329,5384],[8261,5366],[8280,5383],[8270,5405],[8300,5464],[8283,5464],[8229,5404],[8216,5439],[8189,5463],[8185,5486],[8128,5500],[8096,5519],[8032,5512],[7981,5492],[7949,5494],[7887,5463],[7870,5437],[7765,5438],[7718,5405],[7680,5400],[7646,5408],[7616,5433],[7637,5459],[7637,5513],[7616,5560],[7616,5583],[7592,5627],[7587,5653],[7556,5702],[7573,5710],[7590,5680],[7592,5701],[7570,5741],[7577,5802],[7645,5849],[7698,5861],[7793,5892],[7834,5938],[7830,5965],[7853,5985],[7871,5957],[7872,5998],[7896,5993],[7897,6026],[7916,6045],[7961,6056],[7971,6072],[8008,6042],[8052,6031],[8043,6051],[8090,6125],[8063,6129],[8073,6147],[8104,6146],[8105,6115],[8141,6119],[8139,6152],[8156,6132],[8212,6115],[8254,6129],[8267,6115],[8237,6071],[8224,6036],[8256,6011],[8329,5976],[8359,5951],[8384,5959],[8408,6030],[8406,6107],[8417,6122],[8422,6177],[8436,6161],[8463,6071],[8476,6048],[8492,6058],[8517,6035],[8519,5993],[8541,5953]]]]}},{"type":"Feature","id":"VE","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.33,"hc-key":"ve","hc-a2":"VE","name":"Venezuela","labelrank":"3","country-abbrev":"Ven.","subregion":"South America","region-wb":"Latin America & Caribbean","iso-a3":"VEN","iso-a2":"VE","woe-id":"23424982","continent":"South America"},"geometry":{"type":"Polygon","coordinates":[[[2087,6830],[2070,6823],[2080,6796],[2064,6769],[2082,6746],[2096,6767],[2080,6799],[2122,6818],[2160,6818],[2188,6788],[2237,6794],[2282,6777],[2307,6793],[2343,6797],[2357,6776],[2400,6756],[2397,6742],[2423,6732],[2408,6709],[2415,6689],[2387,6672],[2382,6653],[2401,6632],[2377,6604],[2286,6596],[2303,6552],[2324,6550],[2301,6525],[2258,6498],[2219,6515],[2210,6549],[2191,6564],[2207,6580],[2190,6612],[2201,6662],[2143,6659],[2123,6685],[2064,6688],[2056,6726],[2037,6753],[2040,6787],[2068,6824],[2087,6830]]]}},{"type":"Feature","id":"SB","properties":{"hc-group":"admin0","hc-middle-x":0.13,"hc-middle-y":0.24,"hc-key":"sb","hc-a2":"SB","name":"Solomon Islands","labelrank":"3","country-abbrev":"S. Is.","subregion":"Melanesia","region-wb":"East Asia & Pacific","iso-a3":"SLB","iso-a2":"SB","woe-id":"23424766","continent":"Oceania"},"geometry":{"type":"Polygon","coordinates":[[[8977,6187],[8947,6189],[8947,6226],[8902,6255],[8881,6242],[8899,6222],[8858,6239],[8861,6266],[8912,6255],[8947,6233],[8955,6212],[8982,6224],[8977,6187]]]}},{"type":"Feature","id":"MG","properties":{"hc-group":"admin0","hc-middle-x":0.45,"hc-middle-y":0.48,"hc-key":"mg","hc-a2":"MG","name":"Madagascar","labelrank":"3","country-abbrev":"Mad.","subregion":"Eastern Africa","region-wb":"Sub-Saharan Africa","iso-a3":"MDG","iso-a2":"MG","woe-id":"23424883","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5683,5987],[5616,5762],[5601,5727],[5544,5707],[5511,5726],[5503,5774],[5487,5812],[5495,5841],[5524,5882],[5508,5959],[5523,5997],[5558,6004],[5613,6031],[5635,6081],[5650,6080],[5665,6125],[5686,6092],[5702,6020],[5677,6017],[5683,5987]]]}},{"type":"Feature","id":"IS","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.50,"hc-key":"is","hc-a2":"IS","name":"Iceland","labelrank":"3","country-abbrev":"Iceland","subregion":"Northern Europe","region-wb":"Europe & Central Asia","iso-a3":"ISL","iso-a2":"IS","woe-id":"23424845","continent":"Europe"},"geometry":{"type":"Polygon","coordinates":[[[3490,8732],[3556,8739],[3551,8757],[3516,8766],[3476,8762],[3500,8775],[3508,8796],[3538,8790],[3534,8809],[3571,8786],[3566,8765],[3584,8755],[3607,8792],[3661,8795],[3682,8785],[3715,8796],[3713,8811],[3768,8789],[3763,8773],[3795,8763],[3803,8741],[3772,8709],[3677,8676],[3648,8661],[3605,8668],[3575,8684],[3530,8682],[3560,8708],[3538,8728],[3490,8732]]]}},{"type":"Feature","id":"EG","properties":{"hc-group":"admin0","hc-middle-x":0.50,"hc-middle-y":0.66,"hc-key":"eg","hc-a2":"EG","name":"Egypt","labelrank":"2","country-abbrev":"Egypt","subregion":"Northern Africa","region-wb":"Middle East & North Africa","iso-a3":"EGY","iso-a2":"EG","woe-id":"23424802","continent":"Africa"},"geometry":{"type":"Polygon","coordinates":[[[5239,7374],[5220,7318],[5190,7345],[5169,7390],[5172,7358],[5201,7320],[5213,7282],[5258,7199],[5263,7167],[5299,7138],[5131,7138],[4945,7138],[4945,7364],[4937,7397],[4950,7445],[5015,7435],[5065,7418],[5105,7440],[5140,7438],[5157,7425],[5219,7433],[5237,7382],[5239,7374]]]}},{"type":"Feature","id":"KG","properties":{"hc-group":"admin0","hc-middle-x":0.48,"hc-middle-y":0.43,"hc-key":"kg","hc-a2":"KG","name":"Kyrgyzstan","labelrank":"4","country-abbrev":"Kgz.","subregion":"Central Asia","region-wb":"Europe & Central Asia","iso-a3":"KGZ","iso-a2":"KG","woe-id":"23424864","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6389,7707],[6348,7698],[6325,7713],[6261,7709],[6280,7734],[6310,7734],[6331,7731],[6374,7754],[6333,7777],[6323,7766],[6286,7782],[6309,7805],[6336,7826],[6385,7812],[6405,7842],[6435,7827],[6531,7828],[6584,7803],[6529,7774],[6521,7763],[6482,7759],[6450,7736],[6446,7748],[6399,7728],[6389,7707]],[[6300,7721],[6296,7722],[6299,7718],[6302,7720],[6300,7721]],[[6333,7723],[6334,7726],[6331,7724],[6332,7723],[6333,7723]],[[6316,7728],[6310,7729],[6312,7722],[6317,7722],[6316,7728]]]}},{"type":"Feature","id":"NP","properties":{"hc-group":"admin0","hc-middle-x":0.52,"hc-middle-y":0.54,"hc-key":"np","hc-a2":"NP","name":"Nepal","labelrank":"3","country-abbrev":"Nepal","subregion":"Southern Asia","region-wb":"South Asia","iso-a3":"NPL","iso-a2":"NP","woe-id":"23424911","continent":"Asia"},"geometry":{"type":"Polygon","coordinates":[[[6819,7322],[6820,7286],[6795,7274],[6751,7281],[6714,7305],[6660,7310],[6579,7353],[6589,7383],[6608,7397],[6640,7401],[6683,7364],[6699,7367],[6729,7336],[6756,7323],[6773,7330],[6819,7322]]]}}]};