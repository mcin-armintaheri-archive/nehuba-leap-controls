import { NehubaViewer, createNehubaViewer, Config, vec3, vec4, quat } from "nehuba/exports";
import { config } from './viewerConfig';

window.addEventListener('DOMContentLoaded', () => {
  const viewer: NehubaViewer = createNehubaViewer(config); //viewer is of type NehubaViewer, which is a wrapper around neuroglancer's Viewer
  viewer.setMeshesToLoad([100, 200]);
});
