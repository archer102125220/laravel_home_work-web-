import React from 'react';
import { connect } from 'dva';

function IndexPage() {
  return (
    <div>
      <ul>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul>
      <img src='yay.jpg' alt='' />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
