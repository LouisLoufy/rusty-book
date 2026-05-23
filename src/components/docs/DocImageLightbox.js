import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function DocImageLightbox({ close, open, slides }) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      plugins={[Zoom]}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 1.8,
        scrollToZoom: true
      }}
    />
  );
}
