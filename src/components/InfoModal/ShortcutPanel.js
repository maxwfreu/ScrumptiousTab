import React from 'react';

const shortcuts = [
  {
    title: 'New Task',
    mac: ['ENTER'],
    windows: ['ENTER'],
  },
  {
    title: 'Close / Reset Editor',
    mac: ['SHIFT', 'ENTER'],
    windows: ['SHIFT', 'ENTER'],
  },
  {
    title: 'Bold',
    mac: ['CMD', 'B'],
    windows: ['CTRL', 'B'],
  },
  {
    title: 'Italics',
    mac: ['CMD', 'I'],
    windows: ['CTRL', 'I'],
  },
  {
    title: 'Underline',
    mac: ['CMD', 'U'],
    windows: ['CTRL', 'U'],
  },
  {
    title: 'Numbered List',
    mac: ['CMD', 'K'],
    windows: ['CTRL', 'K'],
  },
  {
    title: 'Bulleted List',
    mac: ['CMD', 'J'],
    windows: ['CTRL', 'J'],
  },
  {
    title: 'Checklist',
    mac: ['CMD', '/'],
    windows: ['CTRL', '/'],
  },
  {
    title: 'Header 1',
    mac: ['CMD', 'SHIFT', '1'],
    windows: ['CTRL', 'SHIFT', '1'],
  },
  {
    title: 'Header 2',
    mac: ['CMD', 'SHIFT', '2'],
    windows: ['CTRL', 'SHIFT', '2'],
  },
  {
    title: 'Code',
    mac: ['CMD', '.'],
    windows: ['CTRL', '.'],
  },
  {
    title: 'Block Quote',
    mac: ['CMD', 'SHIFT', 'L'],
    windows: ['CTRL', 'SHIFT', 'L'],
  },
];

const customHeaderOffset = {
  width: 'calc(33% - 10px)',
  marginLeft: '23px',
};

const ShortcutPanel = () => (
  <div className="info-popup-inner">
    <div className="info-title">
      Keyboard Shortcuts
    </div>
    <div>
      <div className="shortcut-header">
        <div className="shortcut-header-item">Mac</div>
        <div className="shortcut-header-item" style={customHeaderOffset}>Windows</div>
      </div>
      {shortcuts.map(item => (
        <div className="shortcut-item" key={item.title}>
          <div className="shortcut-item-entry">
            {item.title}
          </div>
          <div className="shortcut-item-entry">
            {item.mac.map(shortcut => (
              <div key={`windows-${shortcut}`}>{shortcut}</div>
            ))}
          </div>
          <div className="shortcut-item-entry">
            {item.windows.map((shortcut, index) => {
              let style = {};
              if (index === 0) {
                style = {
                  marginLeft: '10px',
                };
              } else if (index === item.windows.length - 1) {
                style = {
                  marginRight: 0,
                };
              }
              return (
                <div key={`windows-${shortcut}`} style={style}>{shortcut}</div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShortcutPanel;
