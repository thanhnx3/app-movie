import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import routerPublic from './routes';
import './index.css';

function App() {
    return (
        <>
            <Header />
            <Routes>
                {routerPublic.map((data, index) => {
                    const Page = data.component;
                    return <Route key={index} path={data.path} element={<Page />} />;
                })}
            </Routes>

            <Footer />
            <></>
        </>
    );
}

export default App;
