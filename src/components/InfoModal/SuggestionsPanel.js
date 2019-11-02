import React from 'react';

const SuggestionsPanel = () => (
  <div className="info-popup-inner">
    <div className="info-title settings-title">
      Not Delicious?
      <a className="suggestion-link" href="https://scrumptioustab.com/feedback" rel="noopener noreferrer" target="_blank"> Leave Feedback </a>
    </div>
    <div className="info-title-subsection">
      <p>
        {`Let us know what you think about Scrumptious or
          if there is something we can fix.`}
      </p>
    </div>
    <div className="info-title not-delicious settings-title">
      Got Suggestions?
      <a className="suggestion-link" href="https://scrumptioustab.com/suggestions" rel="noopener noreferrer" target="_blank"> Make Suggestion </a>
    </div>
    <div className="info-title-subsection">
      <p>
        Request modifications or new features to help make Scrumptious even better.
      </p>
    </div>
    <div className="info-title not-delicious settings-title">
      Buy Me a Coffee!
      <a
        className="suggestion-link"
        href="https://scrumptioustab.com/buy-me-a-coffee"
        rel="noopener noreferrer"
        target="_blank"
      >
        Donate Now
      </a>
    </div>
    <div className="info-title-subsection">
      <p>
        Help support Scrumptious. Buy me a coffee (or a beer) to keep me motivated.
      </p>
    </div>
    <div className="info-title not-delicious settings-title">
      Connect
      <div style={{ display: 'flex' }}>
        <a
          href="https://www.instagram.com/scrumptioustab_/"
          rel="noopener noreferrer"
          target="_blank"
          className="instagram-footer"
        />
        <a
          href="https://twitter.com/scrumptioustab"
          rel="noopener noreferrer"
          target="_blank"
          className="twitter-footer"
        />
        <a
          href="https://www.facebook.com/Scrumptious-350923525519590/"
          rel="noopener noreferrer"
          target="_blank"
          className="facebook-footer"
        />
      </div>
    </div>
  </div>
);

export default SuggestionsPanel;
