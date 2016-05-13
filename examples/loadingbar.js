import React from 'react';

export default () =>
  <div style={{ border: '1px solid green', margin: 10, padding: 10 }}>
    <p>This could be a loading bar...</p>
    <p>This portal is <strong>opened by the prop</strong> <i>isOpened</i>.</p>
    <p>... when <i>openByClickOn</i> is not enough.</p>
    <p>Notice, that by default you cannot close this by ESC or an outside click.</p>
  </div>;
