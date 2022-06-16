import React from 'react';
import {branch, renderComponent} from 'recompose';
import {Redirect} from 'react-router';
import withUserRole from 'modules/user/withUserRole';

export const restrictTo = (roles = ['admin']) => Component =>
  Component
  |> branch(
    ({userRole}) => !roles.includes(userRole),
    renderComponent(() => <Redirect to="/notFound" />),
  )
  |> withUserRole;

export const restrictToAdmin = Component => Component |> restrictTo(['admin']);

export const restrictToClient = Component => Component |> restrictTo(['client']);
