import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Alert from '../layout/alert';
import login from '../auth/login';
import register from '../auth/register';
import dashboard from '../DashBoard/dashboard';
import CreateProfile from '../profile-form/createProfile';
import EditProfile from '../profile-form/editProfile';
import AddExperience from '../profile-form/addExperience';
import AddEducation from '../profile-form/addEducation';
import profiles from '../Profiles/Profiles';
import Profile from '../profile/profile';
import Post from '../Posts/Post';
import SinglePost from '../Post/Post';
import PrivateRoute from '../Router/PrivateRoute';
import NotFound from '../layout/NotFound';

const Routes = props => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/login' component={login} />
        <Route exact path='/register' component={register} />
        <Route exact path='/profiles' component={profiles} />
        <Route exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={dashboard} />
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/posts' component={Post} />
        <PrivateRoute exact path='/posts/:id' component={SinglePost} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
