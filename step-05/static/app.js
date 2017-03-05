/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Eslint configuration for editor.
/* globals google */
/* eslint-env browser */
/* eslint quotes: ["warn", "single"]*/

class MapManager {

  constructor(mapDivClass) {
    this.map = new google.maps.Map(document.getElementsByClassName(mapDivClass)[0], {
      zoom: 11,
      center: {
        lat: 40.7305,
        lng: -73.9091
      }
    });
    this.stationDataFeatures = [];
    this.bounds = "";
    this.infowindow = new google.maps.InfoWindow();

    this.map.data.loadGeoJson('/data/subway-lines');
    google.maps.event.addListener(this.map, 'idle', () => {
      this.mapIdle();
    });
    this.map.data.addListener('click', ev => {
      this.clickHandler(ev);
    });
  }

  clickHandler(ev) {
    let f = ev.feature;
    let stationName = f.getProperty('name');
    let line = f.getProperty('line');
    // Stations have line property, while lines do not.
    if (typeof line === "undefined") {
      return;
    }
    if (line.includes('-')) {
      line += ' lines';
    } else {
      line += ' line';
    }
    this.infowindow.setContent(`<b>${stationName} Station</b><br/>Serves ${line}`);
    // Hat tip geocodezip: http://stackoverflow.com/questions/23814197
    this.infowindow.setPosition(f.getGeometry().get());
    this.infowindow.setOptions({
      pixelOffset: new google.maps.Size(0, -30)
    });
    this.infowindow.open(this.map);
  }

  // mapIdle() is called every time the map has finished moving, zooming, 
  // panning or animating. We use it to load Geojson for the new viewport.
  mapIdle() {
    let newBounds = this.map.getBounds().toString();
    if (this.bounds !== newBounds) {
      this.bounds = newBounds;

      let sw = this.map.getBounds().getSouthWest();
      let ne = this.map.getBounds().getNorthEast();
      this.map.data.loadGeoJson(
        `/data/subway-stations?viewport=${sw.lat()},${sw.lng()}|${ne.lat()},${ne.lng()}`,
        null,
        features => {
          this.stationDataFeatures.forEach(dataFeature => {
            this.map.data.remove(dataFeature);
          });
          this.stationDataFeatures = features;
        });
    }
  }
}

function initMap() {
  new MapManager('map');
}