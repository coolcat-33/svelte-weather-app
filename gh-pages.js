import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'git@github.com:coolcat-33/svelte-weather-app.git', // Update to point to your repository
  user: {
   name: 'coolcat-33', // update to use your name
   email: 'coolcat-33' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);