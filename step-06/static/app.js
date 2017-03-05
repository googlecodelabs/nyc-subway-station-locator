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
      zoom: 12,
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

    this.map.data.setStyle(feature => {
      let type = feature.getProperty('type');
      if (type === "cluster") {
        // Icon path from: https://material.io/icons/#ic_add_circle_outline
        return {
          icon: {
            fillColor: 'blue',
            fillOpacity: 0.75,
            strokeColor: 'blue',
            strokeOpacity: 1,
            scale: 1.2,
            path: 'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4' +
              '.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8' +
              's3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
          }
        };
      } else if (type === "station") {
        // Icon path from: https://material.io/icons/#ic_train
        return {
          icon: {
            fillColor: 'blue',
            fillOpacity: 0.75,
            strokeColor: 'blue',
            strokeOpacity: 1,
            scale: 1.2,
            path: 'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.2' +
              '3l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-' +
              '4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1' +
              '.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5' +
              '-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
          }
        };
      }
    });
  }

  clickHandler(ev) {
    let f = ev.feature;
    let title = f.getProperty('title');
    let description = f.getProperty('description');

    if (typeof description === "undefined") {
      return;
    }

    this.infowindow.setContent(`<b>${title}</b><br/> ${description}`);
    // Hat tip geocodezip: http://stackoverflow.com/questions/23814197
    this.infowindow.setPosition(f.getGeometry().get());
    this.infowindow.setOptions({
      pixelOffset: new google.maps.Size(0, -30)
    });
    this.infowindow.open(this.map);
  }

  mapIdle() {
    let newBounds = this.map.getBounds().toString();
    if (this.bounds !== newBounds) {
      this.bounds = newBounds;

      let sw = this.map.getBounds().getSouthWest();
      let ne = this.map.getBounds().getNorthEast();
      let zm = this.map.getZoom();
      this.map.data.loadGeoJson(
        `/data/subway-stations?viewport=${sw.lat()},${sw.lng()}|${ne.lat()},${ne.lng()}&zoom=${zm}`,
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