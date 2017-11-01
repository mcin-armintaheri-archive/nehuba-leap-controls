import { NehubaViewer, createNehubaViewer, Config, vec3, vec4, quat } from "nehuba/exports";
import { config } from 'nehuba-leap-controls/ViewerConfig';
import { LeapControls } from 'nehuba-leap-controls/LeapControls';

window.addEventListener('DOMContentLoaded', () => {
  const viewer: NehubaViewer = createNehubaViewer(config); //viewer is of type NehubaViewer, which is a wrapper around neuroglancer's Viewer
  viewer.setMeshesToLoad([100, 200]);
  const controls: LeapControls = new LeapControls(viewer);
});
