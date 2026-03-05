import { GalleryState } from '../service/gallery.state';
import { GalleryConfig } from './gallery.config';

export const defaultState: GalleryState = {
  images: [],
  prevIndex: 0,
  currIndex: 0,
  hasNext: false,
  hasPrev: false,
  active: false,
};

export const defaultConfig: GalleryConfig = {
  style: {
    background: '#ffffff',
    height: '90%',
    width: '80%',
  },
  animation: 'fade',
  loader: {
    width: '50px',
    height: '50px',
    position: 'center',
    icon: 'oval',
  },
  description: {
    position: 'bottom',
    overlay: true,
    text: true,
    counter: true,
    style: {
      background: 'rgba(0,0,0, 0.7)',
    },
  },
  thumbnails: {
    width: 70,
    height: 70,
    position: 'bottom',
    space: 20,
  },
  // bullets: false,
  player: {
    autoplay: false,
    speed: 3000,
  },
  navigation: {
    nextIcon: '>',
    prevIcon: '<',
  },
};
