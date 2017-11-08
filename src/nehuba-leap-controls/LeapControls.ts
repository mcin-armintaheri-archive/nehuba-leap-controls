import { NehubaViewer, vec3, quat } from 'nehuba/exports'
import Leap from 'leapjs';

const MATCH_FRAMES = 10;
const WORLD_UP: vec3 = vec3.fromValues(0, 1, 0);
const WORLD_RIGHT: vec3 = vec3.fromValues(1, 0, 0);
const SLICE_LOCK_TIMEOUT = 30;

export class LeapControls {
  viewer: NehubaViewer
  lastFrame: any
  rotation: quat
  axis: vec3
  sliceLock: boolean
  constructor(viewer) {
    this.viewer = viewer;
    this.lastFrame = null;
    this.rotation = quat.create();
    this.axis = vec3.create();
    this.sliceLock = false;
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
    if (this.isPointingTwoFingers(hand)) {
      this.rotateSlice(hand);
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
      !hand.middleFinger.extended &&
      !hand.ringFinger.extended &&
      !hand.pinky.extended
    );
  }
  isPointingTwoFingers(hand) {
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
    const SPEED_SCALE = 8000 * (this.viewer.ngviewer.navigationState.zoomFactor.value / 400000);
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
  leapToRotation(vel, rotSpeed, orientationStream, camOrientation: null | quat = null) {
    const speed: number = vec3.length(vel);
    let cur: quat = orientationStream.orientation;
    if (camOrientation) {
      vec3.transformQuat(this.axis, WORLD_UP, camOrientation);
      vec3.transformQuat(this.axis, this.axis, cur);
    } else {
      vec3.transformQuat(this.axis, WORLD_UP, cur);
    }
    quat.setAxisAngle(this.rotation, this.axis, vel[0] * rotSpeed);
    quat.multiply(orientationStream.orientation, this.rotation, cur);
    cur = orientationStream.orientation;
    if (camOrientation) {
      vec3.transformQuat(this.axis, WORLD_RIGHT, camOrientation);
      vec3.transformQuat(this.axis, this.axis, cur);
    } else {
      vec3.transformQuat(this.axis, WORLD_RIGHT, cur);
    }
    quat.setAxisAngle(this.rotation, this.axis, vel[2] * rotSpeed);
    quat.multiply(orientationStream.orientation, this.rotation, cur);
  }
  rotateMesh(hand) {
    const ROTATION_SPEED = 0.0001;
    const vel: vec3 = hand.palmVelocity;
    const temp = vel[1];
    vel[1] = -vel[2];
    vel[2] = temp;
    this.leapToRotation(
      vel,
      ROTATION_SPEED,
      this.viewer.ngviewer.perspectiveNavigationState.pose.orientation,
    );
    this.viewer.redraw();
  }
  rotateSlice(hand) {
    const ROTATION_SPEED = 0.0004;
    if (!this.sliceLock) {
      const vel: vec3 = hand.palmVelocity;
      const temp = vel[1];
      vel[0] = -vel[0];
      vel[1] = vel[2];
      vel[2] = -temp;
      this.leapToRotation(
        vel,
        ROTATION_SPEED,
        this.viewer.ngviewer.navigationState.pose.orientation,
        this.viewer.ngviewer.perspectiveNavigationState.pose.orientation.orientation
      );
      this.viewer.redraw();
      this.viewer.relayout();
      this.sliceLock = true
      setTimeout(() => { this.sliceLock = false}, SLICE_LOCK_TIMEOUT);
    }
  }
  zoomViews(hand) {
    const ZOOM_SPEED = 40;
    const vel = -hand.palmVelocity[2]
    if (this.viewer.ngviewer.navigationState.zoomFactor.value >= 10000) {
      this.viewer.ngviewer.navigationState.zoomFactor.value += ZOOM_SPEED * vel;
    } else {
      this.viewer.ngviewer.navigationState.zoomFactor.value = 10001;
    }
  }
}
