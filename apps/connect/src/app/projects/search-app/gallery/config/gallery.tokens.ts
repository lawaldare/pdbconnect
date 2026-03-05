import { InjectionToken } from '@angular/core';
import { GalleryConfig } from '../config/gallery.config';

export const GALLERY_CONFIG = new InjectionToken<GalleryConfig>('GALLERY_CONFIG');
