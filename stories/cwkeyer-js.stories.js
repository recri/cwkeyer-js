import { html } from 'lit';
import '../src/cwkeyer-js.js';

export default {
  title: 'CwkeyerJs',
  component: 'cwkeyer-js',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <cwkeyer-js
      style="--cwkeyer-js-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </cwkeyer-js>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
