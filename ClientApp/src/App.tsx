import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import ItemContainer from './components/ItemContainer';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import authService from './components/api-authorization/AuthorizeService';


import './custom.css'

export default class App extends React.PureComponent<{}, { ready: boolean, authenticated: boolean }> {

    private subscription?: number | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
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

        if (!this.state.ready) {
            return (
                <Layout>
                    <span>Loading...</span>
                    <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                </Layout>

            )
        }
        else if (!this.state.authenticated) {
            return (
            <Layout>
                <span>Unauthenticated</span>
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
            </Layout>)
        }
        else {
            return (
                <Layout>
                    <Route path="/:id?" exact render={(props: any) => (<ItemContainer parent="" {...props} />)} />
                    <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                </Layout>)
        }
    };
}
