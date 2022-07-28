import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import Logo from '../../assets/img/logo.png'
import styles from './Navbar.module.css'

/* Contenxt */
import {Context} from '../../context/UserContext'

function Navbar() {

    const {authenticated, logout} = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Get A Pet" />
                <h2>Get A Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>
                {authenticated ? (
                    //Empty tags as it is not allowed to have more than one child component <></>
                    <>
                    <li onClick={logout}>Sair</li>
                    </>
                    ) : (
                    <>  
                    <li>
                    <Link to="/login">Entrar</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar