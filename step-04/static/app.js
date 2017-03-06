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

function initMap() {
    const map = new google.maps.Map(document.getElementsByClassName('map')[0], {
        zoom: 11,
        center: {
            // New York City
            lat: 40.7305, 
            lng: -73.9091
        }
    });
    map.data.loadGeoJson('/data/subway-stations');
    map.data.loadGeoJson('/data/subway-lines');
}
