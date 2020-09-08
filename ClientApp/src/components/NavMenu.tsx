import * as React from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import authService from './api-authorization/AuthorizeService';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';

export default class NavMenu extends React.PureComponent<{}, { ready: boolean, authenticated: boolean, isOpen: boolean }> {

    private subscription?: number | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            isOpen: false,
            ready: false,
            authenticated: false
        };
    }

    componentDidMount() {
        this.subscription = authService.subscribe(() => this.authenticationChanged());
        this.populateAuthenticationState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this.subscription);
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ ready: true, authenticated });
    }

    async authenticationChanged() {
        this.setState({ ready: false, authenticated: false });
        await this.populateAuthenticationState();
    }

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand sticky-top mb-3">
                    <NavbarBrand tag={Link} to="/">bullt.io{/*<img id="logo" src="img/bulltio.svg" alt="Flau" />*/}</NavbarBrand>
                    {(() => {
                        if (this.state.authenticated) {
                            return (
                                <Nav className="navbar-nav ml-auto" navbar>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="#"><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/home-outline.svg" alt="home" /></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="#"><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/settings-outline.svg" alt="settings" /></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to={ApplicationPaths.Profile}><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/person-circle-outline.svg" alt="account" /></NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to={ApplicationPaths.LogOut}><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/log-out-outline.svg" alt="logout" /></NavLink>
                                    </NavItem>
                                </Nav>)
                        }
                        else {
                            return (
                            <Nav className="navbar-nav ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="#"><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/home-outline.svg" alt="home" /></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to={ApplicationPaths.Register} ><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/create-outline.svg" alt="login" /></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to={ApplicationPaths.Login} ><img className="navIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/log-in-outline.svg" alt="login" /></NavLink>
                                </NavItem>
                            </Nav>)
                        }
                    })()}
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
