import React,{useContext} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {DataContext} from '../store/GlobalState'
import Cookies from 'js-cookie'

function NavBar() {
    const router = useRouter()
    const {state, dispatch} = useContext(DataContext)
    const {auth,cart} = state

    const isActive = (r) => {
        return r === router.pathname ? ' active' : ''
    }

    const handleLogout = () => {
        Cookies.remove('refreshToken', {path: 'api/auth/accessToken'})
        localStorage.removeItem('firstLogin')
        dispatch({type: 'AUTH', payload: {}})
        dispatch({type: 'NOTIFY', payload: {success: 'Logged out!'}})
        return router.push('/')
    }

    const adminRouter = () => {
        return(
            <>
                <Link href="/users">
                    <a className="dropdown-item">Users</a>
                </Link>
                <Link href="/product_manager">
                    <a className="dropdown-item">Products</a>
                </Link>
                <Link href="/categories">
                    <a className="dropdown-item">Categories</a>
                </Link>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={auth.user.avatar} alt={auth.user.avatar} 
                    style={{
                        borderRadius: '50%', width: '30px', height: '30px',
                        marginRight: '3px'
                    }}/>
                    {auth.user.name}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile">
                        <a className="dropdown-item">Profile</a>
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </li>
        )
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">Pavaris-SHOP</a>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className={"nav-item" + isActive('/cart')}>
                        <Link href="/cart">
                            <a className="nav-link">
                                <i className="fas fa-shopping-cart position-relative" aria-hidden="true">
                                    <span className="position-absolute"
                                    style={{
                                        padding: '3px 6px',
                                        background: '#ed143dc2',
                                        borderRadius: '50%',
                                        top: '-10px',
                                        right: '-10px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>
                                        {cart.length}
                                    </span>
                                </i>Cart</a>
                        </Link>
                    </li>

                    {
                        Object.keys(auth).length === 0 ? 
                        <li className={"nav-item" + isActive('/signin')}>
                            <Link href="/signin">
                                <a className="nav-link"><i className="fas fa-user" aria-hidden="true"></i>Sign in</a>
                            </Link>
                        </li> :
                        loggedRouter()
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
