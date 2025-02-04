import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../../components/home-list/home-list'

const Home = () => {

    return <BrowserRouter>
        <Routes><Route path='/' element={Home}/></Routes>
    </BrowserRouter>
}