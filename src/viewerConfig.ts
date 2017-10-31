import { Config, vec3, vec4, quat } from "nehuba/exports";

export const config : Config = {
  "configName": "BigBrain",
  "globals": {
    "hideNullImageValues": true,
    "useNehubaLayout": {
      "keepDefaultLayouts": false
    },
    "useCustomSegmentColors": true,
    "useNehubaMeshLayer": true,
    "useNehubaSingleMeshLayer": false,
    "rightClickWithCtrlGlobal": false,
    "zoomWithoutCtrlGlobal": false
  },
  "zoomWithoutCtrl": true,
  "rightClickWithCtrl": true,
  "rotateAtViewCentre": true,
  "zoomAtViewCentre": true,
  "restrictUserNavigation": true,
  "disableSegmentHighlighting": true,
  "dataset": {
    "imageBackground": vec4.fromValues(1, 1, 1, 1),
    "initialNgState": {
      "layers": {
        " grey value: ": {
          "type": "image",
          "source": "precomputed:\/\/https:\/\/neuroglancer.humanbrainproject.org\/precomputed\/BigBrainRelease.2015\/8bit",
          "transform": [
            [ 1, 0, 0, -70677183.333333 ],
            [ 0, 1, 0, -70010000 ],
            [ 0, 0, 1, -58788283.333333 ],
            [ 0, 0, 0, 1 ]
          ]
        },
        " tissue type: ": {
          "type": "segmentation",
          "source": "precomputed:\/\/https:\/\/neuroglancer.humanbrainproject.org\/precomputed\/BigBrainRelease.2015\/classif",
          "selectedAlpha": 0,
          "transform": [
            [ 1, 0, 0, -70766600 ],
            [ 0, 1, 0, -73010000 ],
            [ 0, 0, 1, -58877700 ],
            [ 0, 0, 0, 1 ]
          ]
        }
      },
      "navigation": {
        "pose": {
          "position": {
            "voxelSize": [
              21166.666015625,
              20000,
              21166.666015625
            ],
            "voxelCoordinates": [
              -21.884405136108,
              16.288618087769,
              28.418994903564
            ]
          }
        },
        "zoomFactor": 563818.35624262
      },
      "perspectiveOrientation": [
        0.31407672166824,
        -0.74185198545456,
        0.49889850616455,
        -0.3195493221283
      ],
      "perspectiveZoom": 1922235.5293811
    }
  },
  "layout": {
    "views": "hbp-neuro",
    "planarSlicesBackground": vec4.fromValues(1, 1, 1, 1),
    "useNehubaPerspective": {
      "enableShiftDrag": false,
      "doNotRestrictUserNavigation": false,
      "perspectiveSlicesBackground": vec4.fromValues(1, 1, 1, 1),
      "removePerspectiveSlicesBackground": {
        "color": vec4.fromValues(1, 1, 1, 1),
        "mode": "=="
      },
      "perspectiveBackground": vec4.fromValues(1, 1, 1, 1),
      "fixedZoomPerspectiveSlices": {
        "sliceViewportWidth": 300,
        "sliceViewportHeight": 300,
        "sliceZoom": 563818.35624262,
        "sliceViewportSizeMultiplier": 2
      },
      "mesh": {
        "removeOctant": vec4.fromValues(-1, 1, 1, 1),
        "backFaceColor": vec4.fromValues(1, 1, 1, 1),
        "removeBasedOnNavigation": true,
        "flipRemovedOctant": true
      },
      "centerToOrigin": true,
      "drawSubstrates": {
        "color": vec4.fromValues(0, 0, 1, 0.20000000298023)
      },
      "drawZoomLevels": {
        "cutOff": 150000,
        "color": vec4.fromValues(0, 0, 1, 0.20000000298023)
      },
      "hideImages": false,
      "waitForMesh": true,
      "restrictZoomLevel": {
        "minZoom": 1200000,
        "maxZoom": 3500000
      }
    }
  }
};
