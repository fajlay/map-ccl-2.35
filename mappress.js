function MappMap(h, d) {
    var v = h.mapid,
        k = parseInt(h.zoom, 10),
        g = h.center,
        r = h.mapTypeId,
        w = h.title,
        Y = h.metaKey,
        a = h.pois ? h.pois : [],
        x = h.width,
        u = h.height,
        o = false,
        b = d.mapName,
        X = d.country,
        E = d.language,
        j = d.directionsServer,
        s = d.editable,
        n = d.directions,
        R = d.mapTypeControl,
        O = d.streetViewControl,
        T = d.scrollwheel,
        N = d.keyboardShortcuts,
        H = d.navigationControlOptions,
        Q = d.initialOpenInfo,
        J = d.initialOpenDirections,
        bb = d.postid,
        ab = d.traffic,
        V = d.tooltips,
        M = d.overviewMapControl,
        G = d.overviewMapControlOptions,
        W = d.control,
        p = null,
        i = null,
        t = null,
        f = null,
        U = "Powered by <a style='font-size:10px; background:white; color:blue;' href='http://www.wphostreviews.com/mappress'>MapPress</a>",
        c = null,
        m = null,
        Z = d.poiList,
        e = this;
    this.display = function(a) {
        if (s)
            google.load("maps", "3", {
                other_params: "sensor=false",
                callback: function() {
                    F(a)
                }
            });
        else {
            google.load("maps", "3", {
                other_params: "sensor=false&language=" + E
            });
            google.setOnLoadCallback(function() {
                F(a)
            })
        }
    };

    function F(h) {
        var i = document.getElementById(b);
        if (!i)
            return;
        var o = {
            zoom: k ? k : 0,
            center: g ? new google.maps.LatLng(parseFloat(g.lat),
                parseFloat(g.lng)) : new google.maps.LatLng(0, 0),
            mapTypeId: r,
            mapTypeControl: R,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT
            },
            scrollwheel: T,
            navigationControlOptions: {
                style: H.style
            },
            streetViewControl: O,
            keyboardShortcuts: N,
            overviewMapControl: M,
            overviewMapControlOptions: G
        };
        c = new google.maps.Map(i, o);
        c.panBy(0, -50);
        if (W) {
            var m = mQuery(
                "<div id= '" + b + "_poweredby' style='font-size:10px; background:white; color:black; padding:2px 2px 2px 2px; margin-bottom:10px;display:block'>" + U + "</div>").get(0);
            c.controls[google.maps.ControlPosition.BOTTOM].push(m)
        }
        ab && P();
        if (typeof j == "undefined" || j.indexOf("google") == -1)
            j = "http://maps.google.com";
        else if (j.toLowerCase().indexOf("http") == -1)
            j = "http://" + j;
        f = new google.maps.InfoWindow({
            maxWidth: 0,
            pixelOffset: new google.maps.Size(0, +33)
        });
        for (var d = 0; d < a.length; d++)
            D(d);
        if (!g || g.lat == 0 && g.lng == 0)
            if (!k || k == 0)
                e.recenter(null, true);
            else
                e.recenter(null, false);
            (s || Z) && l();
        n == "inline" && K();
        Q == true && a[0] && google.maps.event.trigger(a[0].marker, "click");
        if (J == true && a[0]) {
            e.recenter(0, false);
            e.openDirections(0)
        }
        h && h()
    }
    this.getWidth = function() {
        return x
    };
    this.getHeight = function() {
        return u
    };
    this.getTitle = function() {
        return w
    };
    this.getMapid = function() {
        return v
    };
    this.setTitle = function(a) {
        w = a
    };
    this.getMap = function() {
        return c
    };
    this.openMarker = function(d) {
        var e = "<div class='mapp-overlay' id='mapp-overlay-m'>";

        e += "<div class='mapp-overlay-venue'><td><b>";
        e += w;
        e += "</b></td></div>";

        e += "<div class='mapp-overlay-title'>";
        if (a[d].titleUrl)
            e += "<a href='" + a[d].titleUrl + "' alt='" + a[d].title + "'>" + a[d].title + "</a>";
        else
            e += a[d].title;
        e += "</div><div class='mapp-overlay-body'>" + a[d].body + "</div><div class='mapp-overlay-links'>";
        if (o)
            e += "<a href='#' id='" + b + "_editmarker' alt='" + mappl10n.edit + "'>" + mappl10n.edit + "</a> | <a href='#' id='" + b + "_deletemarker' alt = '" + mappl10n.del + "'>" + mappl10n.del + "</a> | <a href='#' id='" + b + "_zoommarker' alt = '" + mappl10n.zoom + "'>" + mappl10n.zoom + "</a></div>";
        else if (n == "inline" || n == "google")
            e += "<a href='#' id='" + b + "_directionslink'>" + mappl10n.directions + "</a></div>";
        e += "</div>";
        z(d);
        f.setContent(e);
        f.open(c, a[d].marker);
        google.maps.event.addListenerOnce(f, "domready", function() {
            L(d)
        })
    };
    this.openDirections = function(c) {
        var d;
        d = a[c].correctedAddress ? a[c].correctedAddress : a[c].title + " @" + a[c].point.lat + "," + a[c].point.lng;
        switch (n) {
            case "google":
                var e = j + "?daddr=" + d + "&pw=3";
                window.open(e);
                break;
            case "inline":
                mQuery("#" + b + "_directions").show();
                mQuery("#" + b + "_saddr").val("");
                mQuery("#" + b + "_daddr").val(d);
                mQuery("#" + b + "_saddr").focus()
        }
    };
    this.closeDirections = function() {
        mQuery("#" + b + "_directions").hide();
        if (i) {
            i.setPanel(null);
            if (i.getMap()) {
                i.setMap(null);
                for (var d = 0; d < a.length; d++)
                    a[d].marker.setMap(c)
            }
        }
    };
    this.geoCode = function(a, c, d) {
        mQuery(a).removeClass("mapp-address-error");
        mQuery(c).html("");
        if (mQuery(a).val() == "") {
            mQuery(a).addClass("mapp-address-error");
            mQuery(c).html(mappl10n.enter_address);
            return false
        }
        if (MappMap.stringToLatLng(mQuery(a).val())) {
            d();
            return true
        }
        if (!t)
            t = new google.maps.Geocoder;
        t
            .geocode({
                    address: a.val(),
                    region: X,
                    language: E
                },
                function(f, h) {
                    for (var g = 0; g < f.length; g++)
                        (g > 0 && f[g].formatted_address == f[g - 1].formatted_address || f[g].formatted_address == "") && f.splice(g, 1);
                    if (!f || f.length == 0 || h != google.maps.GeocoderStatus.OK) {
                        mQuery(a).addClass("mapp-address-error");
                        mQuery(c).html(mappl10n.no_address);
                        return false
                    }
                    if (f.length > 1) {
                        var i = mappl10n.did_you_mean + "<a href='#' id='" + b + "_acceptaddress'>" + f[0].formatted_address + "</a>";
                        mQuery(c).html(i);
                        mQuery("#" + b + "_acceptaddress").click(
                            function() {
                                mQuery(a).val(
                                    f[0].formatted_address);
                                e.geoCode(a, c, d);
                                return false
                            });
                        return false
                    }
                    mQuery(a).removeClass("mapp-address-error");
                    mQuery(a).val(f[0].formatted_address);
                    mQuery(c).html("");
                    d(f);
                    return true
                })
    };

    function P() {
        var d = "<div class='gmnoprint mapp-traffic-button'><div class='mapp-traffic-button-inner'><input type='checkbox' id='" + b + "_traffic_checkbox' /> " + mappl10n.traffic + "</div></div>",
            a = mQuery(d).get(0);
        c.controls[google.maps.ControlPosition.TOP_CENTER].push(a);
        google.maps.event.addDomListener(a, "click", function() {
            if (!m)
                m = new google.maps.TrafficLayer;
            if (m.getMap()) {
                mQuery("#" + b + "_traffic_checkbox").attr("checked", "");
                m.setMap(null)
            } else {
                mQuery("#" + b + "_traffic_checkbox")
                    .attr("checked", "checked");
                m.setMap(c)
            }
        })
    }

    function D(b) {
        var e = getIconMarker(a[b].iconid).icon,
            d = getIconMarker(a[b].iconid).shadow;
        a[b].marker = new google.maps.Marker({
            position: new google.maps.LatLng(a[b].point.lat, a[b].point.lng),
            draggable: o,
            clickable: true,
            map: c,
            icon: e,
            shadow: d,
            zIndex: 0
        });
        z(b);
        y(b);
        q(b)
    }

    function z(e) {
        for (var c = [], b = 0; b < a.length; b++) {
            if (b == e)
                continue;
            a[b].marker && c.push({
                marker: a[b].marker,
                zindex: a[b].marker.getZIndex()
            })
        }
        c.sort(function(a, b) {
            return a.zindex - b.zindex
        });
        c.push({
            marker: a[e].marker,
            zindex: a[e].marker.getZIndex()
        });
        for (var d = 0; d < c.length; d++)
            c[d].marker.setZIndex(d)
    }

    function y(b) {
        if (o) {
            a[b].marker.setTitle(mappl10n.click_and_drag);
            return
        }
        if (V)
            a[b].marker.setTitle(mQuery("<div>").html(a[b].title).text());
        else
            a[b].marker.setTitle(null)
    }

    function q(b) {
        var c = a[b].marker;
        google.maps.event.clearListeners(c, "click");
        google.maps.event.addListener(c, "click", function() {
            //alert(c);
            e.openMarker(b)
        });
        e.openMarker(b);
        google.maps.event.addListener(c, "dragstart", function() {
            f.close()
        });
        google.maps.event.addListener(c, "dragend", function() {
            a[b].viewport = null;
            a[b].correctedAddress = null;
            e.openMarker(b)
        })
    }

    function L(d) {
        mQuery("#" + b + "_editmarker").click(function() {
            C(d);
            return false
        });
        mQuery("#" + b + "_deletemarker").click(function() {
            S(d);
            return false
        });
        mQuery("#" + b + "_zoommarker").click(function() {
            c.setCenter(a[d].marker.getPosition());
            var b = c.getZoom();
            b = parseInt(b + b * .3, 10);
            if (b > 19)
                b = 19;
            c.setZoom(b);
            return false
        });
        mQuery("#" + b + "_directionslink").click(function() {
            e.openDirections(d);
            return false
        })
    }

    function K() {
        mQuery("#" + b + "_get_directions").click(
            function() {
                var e = mQuery("#" + b + "_saddr"),
                    d = mQuery("#" + b + "_daddr"),
                    c = mQuery("#" + b + "_saddr_corrected"),
                    a = mQuery("#" + b + "_daddr_corrected");
                f.close();
                B(e, d, c, a);
                return false
            });
        mQuery("#" + b + "_addrswap").click(
            function() {
                var c = mQuery("#" + b + "_saddr"),
                    a = mQuery("#" + b + "_daddr"),
                    d = c.val();
                c.val(a.val());
                a.val(d);
                mQuery("#" + b + "_get_directions").click();
                return false
            });
        mQuery("#" + b + "_print_directions").click(
            function() {
                var c = mQuery("#" + b + "_saddr"),
                    a = mQuery("#" + b + "_daddr"),
                    e = mQuery("#" + b + "_saddr_corrected"),
                    d = mQuery("#" + b + "_daddr_corrected"),
                    f = j + "?saddr=" + c.val() + "&daddr=" + a.val() + "&pw=2";
                window.open(f);
                B(c, a, e, d)
            });
        mQuery("#" + b + "_close_directions").click(function() {
            e.closeDirections();
            return false
        });
        mQuery("#" + b + "_directions .mapp-travelmode").click(function() {
            mQuery(".mapp-travelmode").removeClass("selected");
            mQuery(this).addClass("selected");
            mQuery("#" + b + "_get_directions").click()
        })
    }

    function B(g, f, l, k, j) {
        var d, h = mQuery("#" + b + "_directions .mapp-travelmode.selected")
            .attr("id");
        if (h.indexOf("walk") >= 0)
            d = google.maps.DirectionsTravelMode.WALKING;
        else if (h.indexOf("bike") >= 0)
            d = google.maps.DirectionsTravelMode.BICYCLING;
        else
            d = google.maps.DirectionsTravelMode.DRIVING;
        e.geoCode(g, l, function() {
            e.geoCode(f, k, function() {
                var l = document.getElementById(b + "_directions_renderer");
                if (!p)
                    p = new google.maps.DirectionsService;
                var e = {
                        travelMode: d,
                        provideRouteAlternatives: true
                    },
                    k = MappMap.stringToLatLng(g.val()),
                    h = MappMap
                    .stringToLatLng(f.val());
                e.origin = k ? k.latLng : g.val();
                e.destination = h ? h.latLng : f.val();
                p.route(e, function(d, e) {
                    switch (e) {
                        case google.maps.DirectionsStatus.OK:
                            for (var b = 0; b < a.length; b++)
                                a[b].marker.setMap(null);
                            if (!i)
                                i = new google.maps.DirectionsRenderer({
                                    map: c,
                                    panel: l,
                                    hideRouteList: false,
                                    directions: d,
                                    draggable: true
                                });
                            else {
                                i.setMap(c);
                                i.setPanel(l);
                                i.setDirections(d)
                            }
                            j && j();
                            break;
                        case google.maps.DirectionsStatus.NOT_FOUND:
                            alert(mappl10n.dir_not_found);
                            break;
                        case google.maps.DirectionsStatus.ZERO_RESULTS:
                            alert(mappl10n.dir_zero_results);
                            break;
                        default:
                            alert(mappl10n.dir_default + e)
                    }
                })
            })
        })
    }
    this.addPOI = function(c) {
        a.push(c);
        var b = a.length - 1;
        D(b);
        l();
        e.recenter(b, true);
        this.openMarker(b);
        return b
    };
    this.setEditingMode = function(c) {
        f && f.close();
        o = c;
        for (var b = 0; b < a.length; b++) {
            a[b].marker.setDraggable(o);
            y(b)
        }
    };
    this.resize = function() {
        g.lat = c.getCenter().lat();
        g.lng = c.getCenter().lng();
        google.maps.event.trigger(c, "resize");
        c
            .setCenter(new google.maps.LatLng(parseFloat(g.lat),
                parseFloat(g.lng)))
    };
    this.recenter = function(b, e) {
        var d = new google.maps.LatLngBounds;
        if (typeof b == "undefined")
            b = null;
        if (a.length == 0) {
            c.setCenter(new google.maps.LatLng(0, 0));
            !k && c.setZoom(1);
            return
        }
        if (a.length == 1)
            b = 0;
        if (b !== null) {
            if (e && a[b].viewport && a[b].viewport != {
                    sw: {
                        lat: 0,
                        lng: 0
                    },
                    ne: {
                        lat: 0,
                        lng: 0
                    }
                })
                c.fitBounds(new google.maps.LatLngBounds(
                    new google.maps.LatLng(a[b].viewport.sw.lat,
                        a[b].viewport.sw.lng), new google.maps.LatLng(
                        a[b].viewport.ne.lat, a[b].viewport.ne.lng)));
            else {
                c.setCenter(a[b].marker.getPosition());
                e && c.setZoom(14)
            }
            return
        }
        for (var f = 0; f < a.length; f++)
            d.extend(a[f].marker.getPosition());
        if (e)
            c.fitBounds(d);
        else
            c.setCenter(d.getCenter())
    };

    function S(c) {
        var d = confirm(mappl10n.delete_prompt);
        if (!d)
            return;
        f.close();
        a[c].marker.setMap(null);
        a.splice(c, 1);
        l();
        for (var b = 0; b < a.length; b++)
            q(b)
    }

    function C(b) {
        var d = a[b].title.replace(/\'/g, "&rsquo;"),
            e = "<div id='mapp_edit_overlay'><input id='mapp_edit_overlay_title' type='text' value='" + d + "' /><span id='mapp_edit_iconpicker'>" + getIconHtml(a[b].iconid) + "</span><br/><textarea id='mapp_edit_overlay_body' cols='40'>" + a[b].body + "</textarea><div><input class='button-primary' type='button' id='mapp_edit_savemarker' value='" + mappl10n.save + "' /><input type='button' id='mapp_edit_cancelmarker' value='" + mappl10n.cancel + "' /></div></div>";
        f.setContent(e);
        f.open(c, a[b].marker);
        google.maps.event.addListenerOnce(f, "domready", function() {
            I(b)
        })
    }

    function I(b) {
        mQuery("#mapp_edit_iconpicker").click(function() {
            A(b);
            l();
            getIconPicker(a[b].iconid, f, function(c) {
                if (c) {
                    a[b].iconid = c;
                    var d = getIconMarker(c);
                    a[b].marker.setIcon(d.icon);
                    a[b].marker.setShadow(d.shadow);
                    l()
                }
                C(b)
            })
        });
        mQuery("#mapp_edit_savemarker").click(function() {
            A(b);
            e.openMarker(b);
            q(b);
            l();
            return false
        });
        mQuery("#mapp_edit_cancelmarker").click(function() {
            e.openMarker(b);
            return false
        })
    }

    function A(b) {
        a[b].title = mQuery("#mapp_edit_overlay_title").val();
        a[b].body = mQuery("#mapp_edit_overlay_body").val()
    }
    this.ajaxMapSave = function(h, i) {
        var d;
        x = document.getElementById(b).style.width.replace("px", "");
        u = document.getElementById(b).style.height.replace("px", "");
        k = c.getZoom();
        g.lat = c.getCenter().lat();
        g.lng = c.getCenter().lng();
        r = c.getMapTypeId();
        for (d = 0; d < a.length; d++)
            a[d].point = {
                lat: a[d].marker.getPosition().lat(),
                lng: a[d].marker.getPosition().lng()
            };
        var e = {
            mapid: v,
            width: x,
            height: u,
            zoom: k,
            center: g,
            title: w,
            metaKey: Y,
            mapTypeId: r
        };
        e.pois = [];
        for (d = 0; d < a.length; d++)
            e.pois[d] = {
                point: a[d].point,
                title: a[d].title,
                body: a[d].body,
                address: a[d].address,
                correctedAddress: a[d].correctedAddress,
                iconid: a[d].iconid,
                viewport: a[d].viewport
            };
        var f;
        if (typeof Prototype !== "undefined" && typeof Object.toJSON !== "undefined")
            f = Object.toJSON(e);
        else
            f = JSON.stringify(e);
        var j = {
            action: "mapp_map_save",
            map: f,
            postid: h
        };
        MappMap.ajax("POST", j, function(a) {
            if (a.status == "OK" && a.data) {
                v = a.data;
                bb = h;
                i()
            }
        })
    };

    function l() {
        for (var h, c = "", f = 0; f < a.length; f++) {
            if (s)
                h = "<td class='mapp-marker'>[icon]</td><td><b>[title]</b>[bodytext]</td></tr>";
            else
                h = a[f].poiListTemplate ? a[f].poiListTemplate : d.poiListTemplate;
            h = h.toLowerCase();
            c += "<tr data-marker='" + f + "'>" + h + "</tr>";
            var i = MappMap.parseAddress(a[f].correctedAddress),
                g = {
                    icon: getIconHtml(a[f].iconid),
                    body: a[f].body ? a[f].body + "<br/>" : "",
                    bodyText: a[f].body ? mQuery("<div>" + a[f].body + "</div>")
                        .text() + "<br/>" : "",
                    directions: n != "none" ? "<a href='#' class='poi_list_directions'>" + mappl10n.directions + "</a>" : "",
                    address: a[f].address ? a[f].address : "",
                    correctedAddress: a[f].correctedAddress ? a[f].correctedAddress : "",
                    parsedAddress1: i.firstLine,
                    parsedAddress2: i.secondLine
                };
            if (a[f].title)
                if (a[f].url)
                    g.title = "<a href='" + a[f].url + "'>" + a[f].title + "</a><br/>";
                else
                    g.title = a[f].title + "<br/>";
            else
                g.title = "";
            c = c.replace("[icon]", g.icon);
            c = c.replace("[title]", g.title);
            c = c.replace("[body]", g.body);
            c = c.replace("[bodytext]", g.bodyText);
            c = c.replace("[directions]", g.directions);
            c = c.replace("[address]", g.address);
            c = c.replace("[correctedaddress]", g.correctedAddress);
            c = c.replace("[address1]", g.parsedAddress1);
            c = c.replace("[address2]", g.parsedAddress2)
        }
        var j = "<table>" + c + "</table>";
        mQuery("#" + b + "_poi_list").html(j);
        mQuery("#" + b + "_poi_list tr .poi_list_directions").click(function() {
            mQuery("#" + b + "_poi_list tr").removeClass("mapp-selected");
            var a = mQuery(this).closest("tr").attr("data-marker");
            if (a) {
                mQuery(this).closest("tr").addClass("mapp-selected");
                e.openMarker(a);
                e.openDirections(a)
            }
            return false
        });
        mQuery("#" + b + "_poi_list tr").click(function() {
            mQuery("#" + b + "_poi_list tr").removeClass("mapp-selected");
            var a = mQuery(this).attr("data-marker");
            if (a) {
                mQuery(this).addClass("mapp-selected");
                e.openMarker(a)
            }
            return false
        })
    }
    getIconHtml = function(a) {
        return typeof mappIcons != "undefined" ? mappIcons.getIconHtml(a) : "<img src='http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png'>"
    };
    getIconMarker = function(a) {
        return typeof mappIcons != "undefined" ? mappIcons.getIconMarker(a) : {
            icon: null,
            shadow: null
        }
    };
    getIconPicker = function(c, b, a) {
        if (typeof mappIcons == "undefined")
            a(null);
        else
            mappIcons.getIconPicker(c, b, a)
    }
}
MappMap.ajax = function(c, b, a) {
    mQuery.ajax({
        type: c,
        cache: false,
        url: ajaxurl,
        data: b,
        success: function(b) {
            if (b.status == "OK") {
                a(b);
                return
            } else if (b) {
                alert(mappl10n.ajax_error + "\r\n" + b);
                a(b);
                return
            }
        },
        error: function(d, b, a) {
            if (typeof a == "undefined")
                return;
            var c = mappl10n.ajax_error + "\r\nStatus=" + b + "\r\n" + a;
            alert(c);
            return
        }
    })
};
MappMap.ajaxMapCreate = function(a, b) {
    var c = {
        action: "mapp_map_create",
        postid: a.postid
    };
    MappMap.ajax("POST", c, function(c) {
        if (c.status == "OK") {
            var d = new MappMap(c.data.map, a);
            b(d)
        }
    })
};
MappMap.ajaxMapDelete = function(b, a) {
    !b && a(true);
    var c = {
        action: "mapp_map_delete",
        mapid: b
    };
    MappMap.ajax("POST", c, function(b) {
        b.status == "OK" && a()
    })
};
MappMap.ajaxMapGet = function(c, b, a) {
    !c && a(false);
    var d = {
        action: "mapp_map_get",
        mapid: c,
        options: b
    };
    MappMap.ajax("POST", d, function(c) {
        if (c.status == "OK") {
            var d = new MappMap(c.data.map, b, c.data.icons);
            a(d)
        }
    })
};
MappMap.ajaxIconGetList = function(a) {
    var b = {
        action: "mapp_icon_get_list"
    };
    MappMap.ajax("POST", b, function(b) {
        b.status == "OK" && a(b.data.icons)
    })
};
MappMap.parseAddress = function(a) {
    if (!a || a == "")
        return {
            firstLine: "",
            secondLine: ""
        };
    if (a.lastIndexOf(", USA") > 0) {
        a = a.slice(0, a.lastIndexOf(", USA"));
        if (a.indexOf(",") == a.lastIndexOf(","))
            return {
                firstLine: a,
                secondLine: ""
            }
    }
    return a.indexOf(",") == -1 ? {
        firstLine: a,
        secondLine: ""
    } : {
        firstLine: a.slice(0, a.indexOf(",")),
        secondLine: a.slice(a.indexOf(", ") + 2)
    }
};
MappMap.stringToLatLng = function(b) {
    var a = {
        title: null,
        latLng: null
    };
    if (b.lastIndexOf("@") !== -1) {
        a.title = b.substr(0, b.lastIndexOf("@")).replace(/^\s+|\s+$/g, "");
        b = b.substr(b.lastIndexOf("@") + 1)
    }
    var c = b.split(",", 2),
        d = Number(c[0]),
        e = Number(c[1]);
    if (isNaN(d) || isNaN(e))
        return false;
    a.latLng = new google.maps.LatLng(d, e);
    a.title = a.title ? a.title : a.latLng.toUrlValue();
    return a
};

function MappEditor(ma, j, o) {
    for (var b = null, c = o, a = [], i = 0; i < j.length; i++)
        a.push(new MappMap(j[i], c));

    for (var bmn = null, ccnn = o, aaa = [], iii = 0; iii < ma.length; iii++)
        aaa.push(new MappMap(ma[iii], o));
    mQuery(document).ready(function() {
        p()
    });

    function p() {
        g();
        mQuery("#mapp_metabox").show();
        mQuery("#mapp_paypal")
            .click(
                function() {
                    window
                        .open(
                            "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4339298",
                            "Donate");
                    return false
                });
        mQuery("#publish").click(function() {
            h()
        });
        mQuery("#post-preview").click(function() {
            h()
        });
        mQuery("#mapp_create_btn").click(function() {
            k();
            mQuery("#mapp_save_btn_ms").hide();
            return false
        });
        mQuery("#mapp_save_btn").click(function() {
            h();
            return false
        });
        //
        mQuery("#mapp_save_btn_ms").click(function() {
            hms();
            return false
        });
        //
        mQuery("#mapp_recenter_btn").click(function() {
            a[b].recenter(null, false);
            return false
        });
        mQuery(".mapp-edit-size").click(function() {
            var a = mQuery(this).attr("title").split("x");
            f(a[0], a[1]);
            return false
        });
        mQuery("#mapp_width, #mapp_height").change(function() {
            mQuery(this).val() < 200 && mQuery(this).val(200);
            f(mQuery("#mapp_width").val(), mQuery("#mapp_height").val());
            return false
        });
        mQuery("#mapp_add_btn")
            .click(
                function() {
                    var d = mQuery("#mapp_saddr"),
                        e = mQuery("#mapp_saddr_corrected"),
                        c = MappMap
                        .stringToLatLng(d.val());
                    if (c) {
                        a[b]
                            .addPOI({
                                title: c.title,
                                body: "",
                                address: null,
                                correctedAddress: null,
                                point: {
                                    lat: c.latLng.lat(),
                                    lng: c.latLng.lng()
                                },
                                iconid: typeof mappIcons == "undefined" ? null : mappIcons.lastIcon,
                                viewport: null
                            });
                        return
                    }
                    a[b]
                        .geoCode(
                            d,
                            e,
                            function(c) {
                                var e = MappMap
                                    .parseAddress(c[0].formatted_address);
                                a[b]
                                    .addPOI({
                                        title: e.firstLine,
                                        body: e.secondLine,
                                        address: d.val(),
                                        correctedAddress: c[0].formatted_address,
                                        point: {
                                            lat: c[0].geometry.location
                                                .lat(),
                                            lng: c[0].geometry.location
                                                .lng()
                                        },
                                        iconid: typeof mappIcons == "undefined" ? null : mappIcons.lastIcon,
                                        viewport: {
                                            sw: {
                                                lat: c[0].geometry.viewport
                                                    .getSouthWest()
                                                    .lat(),
                                                lng: c[0].geometry.viewport
                                                    .getSouthWest()
                                                    .lng()
                                            },
                                            ne: {
                                                lat: c[0].geometry.viewport
                                                    .getNorthEast()
                                                    .lat(),
                                                lng: c[0].geometry.viewport
                                                    .getNorthEast()
                                                    .lng()
                                            }
                                        }
                                    })
                            })
                })
    }

    function g() {
        var c = "";
        if (a.length > 0) {
            c += "<table>";
            for (var b = 0; b < a.length; b++) {
                var d = a[b].getTitle();
                c += "<tr data-idx='" + b + "'><td><b><a href='#' class='mapp-maplist-title' data-idx='" + b + "'> [" + a[b].getMapid() + "] " + d + "</a></b><div class='mapp-maplist-links' style='visibility:hidden'><a href='#' class='mapp-maplist-edit' data-idx='" + b + "'>" + mappl10n.edit + "</a> | <a href='#' class='mapp-maplist-insert' data-idx='" + b + "'>" + mappl10n.insert_into_post + "</a> | <a href='#' class='mapp-maplist-delete' data-idx='" + b + "'>" + mappl10n.del + "</a></div></td></tr>"
            }
            c += "</table>"
        }
        if (aaa.length > 0) {
            c += "<table>";
            c += "<tr data-idx='0'><td>";
            c += "<select id='select-map-list' style='width:180px'>";
            for (var bmn = 0; bmn < aaa.length; bmn++) {
                var d = aaa[bmn].getTitle();
                c += "<option value='" + bmn + "'> " + d + " [" + aaa[bmn].getMapid() + "] " + "</option>"
            }
            c += "</select>" + "</b><div class='mapp-maplist-links' style='visibility:hidden'><a href='#' class='mapp-maplist-edit-ms' data-idx='1'>" + mappl10n.edit + "</a> | <a href='#' class='mapp-maplist-insert-ms' data-idx='1'>" + mappl10n.insert_into_post + "</a> | <a href='#' class='mapp-maplist-delete-ms' data-idx='1'>" + mappl10n.del + "</a></div>"
            c += "</td></tr></table>"
        }
        mQuery("#mapp_maplist").html(c);
        mQuery("#mapp_maplist tr").hover(
            function() {
                mQuery(this).find(".mapp-maplist-links").css("visibility",
                    "visible")
            },
            function() {
                mQuery(this).find(".mapp-maplist-links").css("visibility",
                    "hidden")
            });
        mQuery(".mapp-maplist-title").click(function() {
            var a = mQuery(this).attr("data-idx");
            m(a);
            return false
        });
        //
        mQuery("#select-map-list").change(function() {
            mapNm(mQuery("#select-map-list").val());
            return false
        });
        //
        mQuery(".mapp-maplist-edit").click(function() {
            var a = mQuery(this).attr("data-idx");
            n(a);
            mQuery("#mapp_save_btn").show();
            mQuery("#mapp_save_btn_ms").hide();
            return false
        });
        //
        mQuery(".mapp-maplist-edit-ms").click(function() {
            var a = mQuery("#select-map-list").val();
            nms(a);
            mQuery("#mapp_save_btn_ms").show();
            mQuery("#mapp_save_btn").hide();
            return false
        });
        //
        mQuery(".mapp-maplist-insert")
            .click(
                function() {
                    var c = mQuery(this).attr("data-idx"),
                        b = '[mappress mapid="' + a[c].getMapid() + '"]';
                    send_to_editor(b);
                    return false
                });
        //
        mQuery(".mapp-maplist-insert-ms")
            .click(
                function() {
                    var cms = mQuery("#select-map-list").val(),
                        bms = '[mappress mapid="' + aaa[cms].getMapid() + '"]';
                    aaa[cms].ajaxMapSave(ccnn.postid, function() {
                        aaa[cms].getMapid()
                            //mapNm(mQuery("#select-map-list").val());
                    })
                    send_to_editor(bms);
                    return false
                });
        //
        mQuery(".mapp-maplist-delete").click(function() {
            var a = mQuery(this).attr("data-idx");
            l(a);
            return false
        });
        //
        mQuery(".mapp-maplist-delete-ms").click(function() {
                var a = mQuery("#select-map-list").val();
                lms(a);
                return false
            })
            //
    }

    function k() {
        MappMap.ajaxMapCreate(c, function(c) {
            a.push(c);
            aaa.push(c);
            b = a.length - 1;
            e(true);
            a[b].display(function() {
                d(true)
            })
        })
    }

    function h() {
        if (b === null || mQuery("#mapp_adjust_panel").is(":hidden"))
            return;
        mQuery("#mapp_title").val() == "" && mQuery("#mapp_title").val(mappl10n.untitled);
        a[b].setTitle(mQuery("#mapp_title").val());
        a[b].ajaxMapSave(c.postid, function() {
            e(false);
            g()
        })
    }

    function hms() {
        if (bmn === null || mQuery("#mapp_adjust_panel").is(":hidden"))
            return;
        //mQuery("#mapp_title").val() == ""
        //&& mQuery("#mapp_title").val(mappl10n.untitled);
        aaa[bmn].setTitle(mQuery("#mapp_title").val());
        aaa[bmn].ajaxMapSave(c.postid, function() {
            ems(false);
            g();
            mQuery("#select-map-list").val(bmn)
                //mapNm(mQuery("#select-map-list").val());
        })
    }

    function m(c) {
        if (b === c)
            return;
        a[c].display(function() {
            b = c;
            d(true)
        })
    }

    function mapNm(c) {
        if (bmn === c)
            return;
        aaa[c].display(function() {
            bmn = c;
            mapNd(true)
        })
    }

    function n(c) {
        if (b === c) {
            e(true);
            d(true);
            return
        }
        a[c].display(function() {
            b = c;
            e(true);
            d(true)
        })
    }

    function nms(c) {
        if (bmn === c) {
            ems(true);
            mapNd(true);
            return
        }
        aaa[c].display(function() {
            bmn = c;
            ems(true);
            mapNd(true)
        })
    }

    function l(c) {
        b = c;
        confirm(mappl10n.delete_map_prompt) && MappMap.ajaxMapDelete(a[b].getMapid(), function() {
            a.splice(b, 1);
            b = null;
            d(false);
            g()
        })
    }

    function lms(c) {
        bmn = c;
        confirm(mappl10n.delete_map_prompt) && MappMap.ajaxMapDelete(aaa[bmn].getMapid(), function() {
            aaa.splice(bmn, 1);
            bmn = null;
            mapNd(false);
            g()
        })
    }

    function d(c) {
        if (c) {
            mQuery("#mapp0").show();
            f(a[b].getWidth(), a[b].getHeight())
        } else
            mQuery("#mapp0").hide()
    }

    function mapNd(c) {
        if (c) {
            mQuery("#mapp0").show();
            fmapN(aaa[bmn].getWidth(), aaa[bmn].getHeight())
        } else
            mQuery("#mapp0").hide()
    }

    function e(d) {
        if (d) {
            mQuery("#mapp_title").val(a[b].getTitle());
            var c = a[b].getMapid() ? a[b].getMapid() : "New";
            mQuery("#mapp_mapid").text(c);
            mQuery("#mapp_insert_btn").show();
            mQuery("#mapp_add_panel").css("visibility", "visible");
            mQuery("#mapp_maplist_panel").hide();
            mQuery("#mapp_adjust_panel").show();
            a[b].setEditingMode(true)
        } else {
            mQuery("#mapp_add_panel").css("visibility", "hidden");
            mQuery("#mapp_maplist_panel").show();
            mQuery("#mapp_adjust_panel").hide();
            mQuery("#mapp_insert_btn").hide();
            a[b].setEditingMode(false)
        }
        mQuery("#mapp_saddr").removeClass("mapp-address-error");
        mQuery("#mapp_saddr").val("");
        mQuery("#mapp_saddr_corrected").html("")
    }

    function ems(d) {
        if (d) {
            mQuery("#mapp_title").val(aaa[bmn].getTitle());
            var c = aaa[bmn].getMapid() ? aaa[bmn].getMapid() : "New";
            mQuery("#mapp_mapid").text(c);
            mQuery("#mapp_insert_btn").show();
            mQuery("#mapp_add_panel").css("visibility", "visible");
            mQuery("#mapp_maplist_panel").hide();
            mQuery("#mapp_adjust_panel").show();
            aaa[bmn].setEditingMode(true)
        } else {
            mQuery("#mapp_add_panel").css("visibility", "hidden");
            mQuery("#mapp_maplist_panel").show();
            mQuery("#mapp_adjust_panel").hide();
            mQuery("#mapp_insert_btn").hide();
            aaa[bmn].setEditingMode(false)
        }
        mQuery("#mapp_saddr").removeClass("mapp-address-error");
        mQuery("#mapp_saddr").val("");
        mQuery("#mapp_saddr_corrected").html("")
    }

    function f(e, d) {
        mQuery("#mapp_width").val(e);
        mQuery("#mapp_height").val(d);
        document.getElementById(c.mapName).style.width = e + "px";
        document.getElementById(c.mapName).style.height = d + "px";
        if (typeof Prototype != "undefined")
            document.getElementById("mapp0_poi_list").style.height = d - $("mapp_adjust").getDimensions().height - 12 + "px";
        else
            mQuery("#mapp0_poi_list").height(
                d - mQuery("#mapp_adjust").height() - 12 + "px");
        a[b].resize()
    }

    function fmapN(e, d) {
        mQuery("#mapp_width").val(e);
        mQuery("#mapp_height").val(d);
        document.getElementById("mapp0").style.width = e + "px";
        document.getElementById("mapp0").style.height = d + "px";
        if (typeof Prototype != "undefined")
            document.getElementById("mapp0_poi_list").style.height = d - $("mapp_adjust").getDimensions().height - 12 + "px";
        else
            mQuery("#mapp0_poi_list").height(
                d - mQuery("#mapp_adjust").height() - 12 + "px");
        aaa[bmn].resize()
    }
}

function MappIcons(b, h, e) {
    this.lastIcon = null;
    var a = null,
        g = {
            "blue-dot": {
                shadow: "msmarker.shadow"
            },
            "ltblue-dot": {
                shadow: "msmarker.shadow"
            },
            "green-dot": {
                shadow: "msmarker.shadow"
            },
            "pink-dot": {
                shadow: "msmarker.shadow"
            },
            "purple-dot": {
                shadow: "msmarker.shadow"
            },
            "red-dot": {
                shadow: "msmarker.shadow"
            },
            "yellow-dot": {
                shadow: "msmarker.shadow"
            },
            blue: {
                shadow: "msmarker.shadow"
            },
            green: {
                shadow: "msmarker.shadow"
            },
            lightblue: {
                shadow: "msmarker.shadow"
            },
            pink: {
                shadow: "msmarker.shadow"
            },
            purple: {
                shadow: "msmarker.shadow"
            },
            red: {
                shadow: "msmarker.shadow"
            },
            yellow: {
                shadow: "msmarker.shadow"
            },
            "blue-pushpin": {
                shadow: "pushpin.shadow"
            },
            "grn-pushpin": {
                shadow: "pushpin.shadow"
            },
            "ltblu-pushpin": {
                shadow: "pushpin.shadow"
            },
            "pink-pushpin": {
                shadow: "pushpin.shadow"
            },
            "purple-pushpin": {
                shadow: "pushpin.shadow"
            },
            "red-pushpin": {
                shadow: "pushpin.shadow"
            },
            "ylw-pushpin": {
                shadow: "pushpin.shadow"
            },
            bar: {},
            coffeehouse: {},
            man: {},
            wheel_chair_accessible: {},
            woman: {},
            restaurant: {},
            snack_bar: {},
            parkinglot: {},
            bus: {},
            cabs: {},
            ferry: {},
            helicopter: {},
            plane: {},
            rail: {},
            subway: {},
            tram: {},
            truck: {},
            info: {},
            info_circle: {},
            rainy: {},
            sailing: {},
            ski: {},
            snowflake_simple: {},
            swimming: {},
            water: {},
            fishing: {},
            flag: {},
            marina: {},
            campfire: {},
            campground: {},
            cycling: {},
            golfer: {},
            hiker: {},
            horsebackriding: {},
            motorcycling: {},
            picnic: {},
            POI: {},
            rangerstation: {},
            sportvenue: {},
            toilets: {},
            trail: {},
            tree: {},
            arts: {},
            conveniencestore: {},
            dollar: {},
            electronics: {},
            euro: {},
            gas: {},
            grocerystore: {},
            homegardenbusiness: {},
            mechanic: {},
            movies: {},
            realestate: {},
            salon: {},
            shopping: {},
            yen: {},
            caution: {},
            earthquake: {},
            fallingrocks: {},
            firedept: {},
            hospitals: {},
            lodging: {},
            phone: {},
            partly_cloudy: {},
            police: {},
            "postoffice-us": {},
            sunny: {},
            volcano: {},
            camera: {},
            webcam: {},
            "iimm1-blue": {
                shadow: "iimm1-shadow"
            },
            "iimm1-green": {
                shadow: "iimm1-shadow"
            },
            "iimm1-orange": {
                shadow: "iimm1-shadow"
            },
            "iimm1-red": {
                shadow: "iimm1-shadow"
            },
            "iimm2-blue": {
                shadow: "iimm2-shadow"
            },
            "iimm2-green": {
                shadow: "iimm2-shadow"
            },
            "iimm2-orange": {
                shadow: "iimm2-shadow"
            },
            "iimm2-red": {
                shadow: "iimm2-shadow"
            },
            darkgreen_MarkerA: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerB: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerC: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerD: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerE: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerF: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerG: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerH: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerI: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerJ: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerK: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerL: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerM: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerN: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerO: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerP: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerQ: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerR: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerS: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerT: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerU: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerV: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerW: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerX: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerY: {
                shadow: "msmarker.shadow"
            },
            darkgreen_MarkerZ: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerA: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerB: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerC: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerD: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerE: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerF: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerG: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerH: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerI: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerJ: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerK: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerL: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerM: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerN: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerO: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerP: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerQ: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerR: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerS: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerT: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerU: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerV: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerW: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerX: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerY: {
                shadow: "msmarker.shadow"
            },
            blue_MarkerZ: {
                shadow: "msmarker.shadow"
            }
        };

    function c() {
        if (a)
            return;
        a = [];
        e && f("user", e);
        f("standard", g)
    }

    function f(f, e) {
        for (var d in e) {
            if (a[d])
                continue;
            var c = {
                type: f,
                url: null,
                anchor: {
                    x: 0,
                    y: 0
                },
                shadow: {
                    url: null,
                    anchor: {
                        x: 0,
                        y: 0
                    }
                }
            };
            if (f == "standard") {
                c.url = b + "/" + d + ".png";
                c.anchor.x = 16;
                c.anchor.y = 32;
                c.shadow.url = e[d].shadow ? b + "/" + e[d].shadow + ".png" : b + "/" + d + ".shadow.png";
                c.shadow.anchor.x = 16;
                c.shadow.anchor.y = 32
            } else
                c.url = h + "/" + d;
            a[d] = c
        }
    }

    function d(d) {
        var c = "<ul>";
        for (var b in a)
            if (a[b].type == d)
                c += "<a style='float:left' href='#' data-iconid='" + b + "'>" + this.getIconHtml(b, true) + "</a>";
        c += "</ul>";
        return c
    }
    this.getIconPicker = function(g, a, b) {
        var f = this;
        c();
        var e = "<div style='margin-bottom: 5px;padding: 0;'><a href='#' id='mapp_edit_icon_cancel'><< " + mappl10n.back + "</a> | <a href='#' id='mapp_edit_icon_standard'>" + mappl10n.standard_icons + "</a> | <a href='#' id='mapp_edit_icon_user'>" + mappl10n.my_icons + "</a></div><div id='mapp_edit_icon_list'><div id='mapp_edit_icon_list_standard'>" + d("standard") + "</div><div id='mapp_edit_icon_list_user' style='display:none'>" + d("user") + "</div></div>";
        a.setContent(e);
        google.maps.event.addListenerOnce(a, "domready", function() {
            mQuery("#mapp_edit_icon_standard").click(function() {
                mQuery("#mapp_edit_icon_list_standard").show();
                mQuery("#mapp_edit_icon_list_user").hide()
            });
            mQuery("#mapp_edit_icon_user").click(function() {
                mQuery("#mapp_edit_icon_list_standard").hide();
                mQuery("#mapp_edit_icon_list_user").show()
            });
            mQuery("#mapp_edit_icon_cancel").click(function() {
                b(null);
                return false
            });
            mQuery("#mapp_edit_icon_list a").click(function() {
                var a = mQuery(this).attr("data-iconid");
                f.lastIcon = a;
                b(a);
                return false
            })
        })
    };
    this.getIconMarker = function(h) {
        c();
        var b = a[h];
        if (!b)
            return {
                url: null,
                shadowUrl: null
            };
        if (b.type == "standard") {
            var g = new google.maps.Point(b.anchor.x, b.anchor.y),
                e = new google.maps.Point(
                    b.shadow.anchor.x, b.shadow.anchor.y),
                f = new google.maps.MarkerImage(
                    b.url, null, null, g, null),
                d = new google.maps.MarkerImage(
                    b.shadow.url, null, null, e, null);
            return {
                icon: f,
                shadow: d
            }
        } else
            return {
                icon: b.url,
                shadow: b.shadowUrl
            }
    };
    this.getIconHtml = function(b, d) {
        c();
        return a[b] ? d ? "<img class='mapp-icon' src='" + a[b].url + "' title='" + b + "' alt='" + b + "'/>" : "<img class='mapp-icon' src='" + a[b].url + "' />" : "<img class='mapp-icon' src='http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png'>"
    }
}