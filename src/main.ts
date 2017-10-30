import { createNehubaViewer, Config } from "nehuba/exports";

window.addEventListener('DOMContentLoaded', () => {
  const config: Config = { restrictUserNavigation: true } //could be fetched from external json file
  createNehubaViewer(config); //viewer is of type NehubaViewer, which is a wrapper around neuroglancer's Viewer
});
