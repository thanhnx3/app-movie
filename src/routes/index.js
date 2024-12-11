import Info from '../pages/Cartoon/cartoon';
import Cartoon from '../pages/Info/info';
import Movie from '../pages/Movie/movie';
import News from '../pages/News/news';
import Search from '../pages/Search/search';
import TV from '../pages/TV/tv';
import Watch from '../pages/Watch/watch';


import Content from '../components/Content/content';

const routerPublic = [
    { path: '/', component: Content },
    { path: '/hoat-hinh', component: Cartoon },
    { path: '/movie/:movieId', component: Movie },
    { path: '/tv/:tvId', component: TV },
    { path: '/news', component: News },
    { path: '/search', component: Search },
    { path: '/info/:slug', component: Info },
    { path: '/watch/:slug', component: Watch },
];

export default routerPublic;
