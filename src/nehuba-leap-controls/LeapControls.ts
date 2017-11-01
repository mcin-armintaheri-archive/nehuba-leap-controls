import { NehubaViewer, vec3, quat } from 'nehuba/exports'
import Leap from 'leapjs';

const MATCH_FRAMES = 10;
const WORLD_UP: vec3 = vec3.fromValues(0, 1, 0);
const WORLD_RIGHT: vec3 = vec3.fromValues(1, 0, 0);
export class LeapControls {
  viewer: NehubaViewer
  lastFrame: any
  rotation: quat
  axis: vec3
  constructor(viewer) {
    this.viewer = viewer;
    this.lastFrame = null;
    this.rotation = quat.create();
    this.axis = vec3.create();
  }
  run() {
    Leap.loop({
      frame: frame => {
        if (!this.lastFrame) {
          this.lastFrame = frame;
          return;
        }
        this.matchGesture(frame.hands[0]);
        this.lastFrame = frame;
      }
    });
  }
  matchGesture(hand) {
    if (!hand) {
      return;
    }
    if (this.isPinching(hand)) {
      this.rotateMesh(hand);
      return;
    }
    if (this.isPointingOneFinger(hand)) {
      this.translatePlanes(hand);
      return;
    }
    if (this.palmIsForward(hand)) {
      this.zoomViews(hand);
      return;
    }
  }
  isPinching(hand) {
    const PINCH_THRESHOLD = 0.80;
    return hand.pinchStrength >= PINCH_THRESHOLD;
  }
  isPointingOneFinger(hand) {
    return (
      hand.thumb.extended &&
      hand.indexFinger.extended &&
      hand.middleFinger.extended &&
      !hand.ringFinger.extended &&
      !hand.pinky.extended
    );
  }
  palmIsForward(hand) {
    const PALM_Z_THRESHOLD = 0.55;
    const palmNormalZ = hand.palmNormal[2];
    return (
      hand.thumb.extended &&
      hand.indexFinger.extended &&
      hand.middleFinger.extended &&
      hand.ringFinger.extended &&
      hand.pinky.extended &&
      palmNormalZ <= -PALM_Z_THRESHOLD
    );
  }
  translatePlanes(hand) {
    const SPEED_SCALE = 4000 * (this.viewer.ngviewer.navigationState.zoomFactor.value / 400000);
    const vel: vec3 = hand.palmVelocity;
    vel[1] = -vel[1];
    vel[2] = -vel[2];
    let cur: quat = this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation;
    vec3.transformQuat(vel, vel, cur);
    const { position } = this.viewer.ngviewer.navigationState.pose;
    vec3.scaleAndAdd(
      position.spatialCoordinates,
      position.spatialCoordinates,
      vel,
      SPEED_SCALE
    );
    position.markSpatialCoordinatesChanged();
    this.viewer.redraw();
  }
  rotateMesh(hand) {
    const ROTATION_SPEED = 0.0001;
    const vel: vec3 = hand.palmVelocity;
    const temp = vel[1];
    vel[1] = -vel[2];
    vel[2] = temp;
    const speed: number = vec3.length(vel);
    const rotation: quat = this.rotation;
    let cur: quat = this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation;
    let axis: vec3 = this.axis;
    vec3.transformQuat(axis, WORLD_UP, cur);
    quat.setAxisAngle(rotation, axis, vel[0] * ROTATION_SPEED);
    quat.multiply(this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation, rotation, cur);
    cur = this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation;
    vec3.transformQuat(axis, WORLD_RIGHT, cur);
    quat.setAxisAngle(rotation, axis, vel[2] * ROTATION_SPEED);
    quat.multiply(this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation, rotation, cur);
    this.viewer.redraw();
  }
  zoomViews(hand) {
    const ZOOM_SPEED = 10;
    const vel = -hand.palmVelocity[2]
    if (this.viewer.ngviewer.navigationState.zoomFactor.value >= 10000) {
      this.viewer.ngviewer.navigationState.zoomFactor.value += ZOOM_SPEED * vel;
    } else {
      this.viewer.ngviewer.navigationState.zoomFactor.value = 10001;
    }
  }
}
